const orcaConsts = require("../orcaConsts");
const solanaWeb3 = require('@solana/web3.js');
const bot = require('../bot.js');
const tokenSwap = require("../models/tokenSwap.js");
const splToken = require('@solana/spl-token');

const timer = ms => new Promise(res => setTimeout(res, ms));

const SLIPPAGE = 0.015;
const ARB_THRESHOLD = 0.0103;
const RETRY_TIMES = 10;
const INIT_ROUGH_AMOUNT = 0.2;

let txConfirmOption = {
    skipPreflight: true,
    commitment: "singleGossip",
};
let accountBalanceOption = "confirmed";


const sendTransaction = async (connection, account, instructions, signers) => {
    let transaction = new solanaWeb3.Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (
        await connection.getRecentBlockhash("confirmed")
    ).blockhash;
    transaction.setSigners(
        account.publicKey, ...signers.map((s) => s.publicKey)
    );

    // signers.forEach((signer) => {console.log("Signers contain: " + signer.publicKey.toBase58() + signer.secretKey.toJSON());});
    // console.log("Transaction Signers contins before: " + transaction.signers);

    transaction.feePayer = account.publicKey;
    transaction.sign(account);
    for (const signer of signers) {
        // console.log("Partial Sign by " + signer.publicKey.toBase58());
        transaction.partialSign(signer);
    }

    const rawTransaction = transaction.serialize();
    let options = {
        skipPreflight: true,
        commitment: "max",
    };

    // const txid = await solanaWeb3.sendAndConfirmRawTransaction(connection, rawTransaction, options);
    const txid = await connection.sendRawTransaction(rawTransaction, options);
    console.log(txid);

    return txid;
}


const swap = async function(connection, account, userAddress, order, amountIn, minAmountOut) {

    //---------------------------
    // SWAP
    //---------------------------

    let instructions = [];
    let cleanupInstructions = [];
    let signers = [];
    const market = order.market;

    let fromAccount, toAccount, holdingA, holdingB;
    if (order.side === 0){  // Buy
        fromAccount = new solanaWeb3.PublicKey(userAddress[market.tokenBName]);
        toAccount = new solanaWeb3.PublicKey(userAddress[market.tokenAName]);
        holdingA = new solanaWeb3.PublicKey(market.tokenAccountB);
        holdingB = new solanaWeb3.PublicKey(market.tokenAccountA);
    } else { // Sell
        fromAccount = new solanaWeb3.PublicKey(userAddress[market.tokenAName]);
        toAccount = new solanaWeb3.PublicKey(userAddress[market.tokenBName]);
        holdingA = new solanaWeb3.PublicKey(market.tokenAccountA);
        holdingB = new solanaWeb3.PublicKey(market.tokenAccountB);
    }

    const authority = new solanaWeb3.PublicKey(market.authority);

    // Approve
    const transferAuthority = bot.approveAmount(
        instructions, cleanupInstructions, fromAccount, account.publicKey, amountIn, undefined
    );
    signers.push(transferAuthority);


    instructions.push(
        tokenSwap.swapInstruction(
            new solanaWeb3.PublicKey(market.account),
            authority,
            transferAuthority.publicKey,
            fromAccount,
            holdingA, holdingB,
            toAccount,
            new solanaWeb3.PublicKey(market.poolTokenMint),
            new solanaWeb3.PublicKey(market.feeAccount),
            new solanaWeb3.PublicKey(orcaConsts.programIds.tokenSwap),
            new solanaWeb3.PublicKey(orcaConsts.programIds.token),
            amountIn,
            minAmountOut,
            undefined,
            true
        )
    );

    let tx = await sendTransaction(
        connection, account, instructions.concat(cleanupInstructions),
        signers
    );

    return tx;

}


async function placeOrders(connection, account, pickOrders){
    let tokenRoughAmount = INIT_ROUGH_AMOUNT;
    let lastTxid = null;
    console.log("======== Place Order =======");
    for (const [i, order] of pickOrders.entries()){
        try{
            let amountIn, minAmountOut, amountInUI, minAmountOutUI;
            if (order.side === 0) { // Buy, Swap B get A
                // Retry until transfer arrived
                for (let i = 0; i < RETRY_TIMES; i ++){
                    amountInUI = (await connection.getTokenAccountBalance(new solanaWeb3.PublicKey(user[order.market.tokenBName]), accountBalanceOption)).value.uiAmount;
                    if (parseFloat(amountInUI) > tokenRoughAmount * 0.8){break;}
                    let status;
                    if (lastTxid != null){
                        status = await connection.confirmTransaction(lastTxid, txConfirmOption && txConfirmOption.commitment);
                        if (status.value.err){console.log("Last tx error."); break;}
                    }
                    await timer(500);
                    console.log('.');
                    console.log('expecting for '+ tokenRoughAmount + " " + order.market.tokenBName + ", got "+ amountInUI);
                }
                console.log(" ");
                minAmountOutUI = amountInUI / order.market.price * (1 - SLIPPAGE);
                amountIn = amountInUI * 10 ** orcaConsts.tokens[order.market.tokenBName].decimals - 50;
                minAmountOut = minAmountOutUI * 10 ** orcaConsts.tokens[order.market.tokenAName].decimals * (1 - SLIPPAGE) - 50;
                console.log("----- Order Step " + i + " Swap " + amountInUI + " " + order.market.tokenBName + " for > " + minAmountOutUI + " " + order.market.tokenAName + "at price" + order.market.price + " | " + Date(Date.now()));
                tokenRoughAmount /= order.market.price;
            } else {  // Sell, Swap A get B
                // Retry until transfer arrived
                for (let i = 0; i < RETRY_TIMES; i ++){
                    amountInUI = (await connection.getTokenAccountBalance(new solanaWeb3.PublicKey(user[order.market.tokenAName]), accountBalanceOption)).value.uiAmount;
                    if (parseFloat(amountInUI) > tokenRoughAmount * 0.8){break;}
                    let status;
                    if (lastTxid != null){
                        status = await connection.confirmTransaction(lastTxid, txConfirmOption && txConfirmOption.commitment);
                        if (status.value.err){console.log("Last tx error."); break;}
                    }
                    await timer(500);
                    console.log('.');
                    console.log('expecting for '+ tokenRoughAmount + " " + order.market.tokenAName + ", got "+ amountInUI);
                }
                console.log(" ");
                minAmountOutUI = amountInUI * order.market.price * (1 - SLIPPAGE);
                amountIn = amountInUI * 10 ** orcaConsts.tokens[order.market.tokenAName].decimals - 50;
                minAmountOut = minAmountOutUI * 10 ** orcaConsts.tokens[order.market.tokenBName].decimals * (1 - SLIPPAGE) - 50;
                console.log("----- Order Step " + i + " Swap " + amountInUI + " " + order.market.tokenAName + " for > " + minAmountOutUI + " " + order.market.tokenBName + "at price" + order.market.price + " | " + Date(Date.now()));
                tokenRoughAmount *= order.market.price
            }
            // Swap
            lastTxid = await swap(connection, account, order, amountIn, minAmountOut);
        } catch (exc) {console.error(exc); }
    }
}


async function placeOrdersSimple(connection, account, userAddress, pickOrders){
    let tokenRoughAmount = INIT_ROUGH_AMOUNT;
    console.log("======== Place Order =======");
    for (const [i, order] of pickOrders.entries()){
        try{
            let amountIn, minAmountOut, amountInUI, minAmountOutUI;
            if (order.side === 0) { // Buy, Swap B get A
                // Retry until transfer arrived
                for (let i = 0; i < RETRY_TIMES; i ++){
                    amountInUI = order.size;
                    if (parseFloat(amountInUI) > tokenRoughAmount * 0.8){break;}
                    await timer(500);
                    console.log('.');
                    console.log('expecting for '+ tokenRoughAmount + " " + order.market.tokenBName + ", got "+ amountInUI);
                }
                console.log(" ");
                minAmountOutUI = amountInUI / order.market.price * (1 - SLIPPAGE);
                amountIn = amountInUI * 10 ** orcaConsts.tokens[order.market.tokenBName].decimals - 50;
                minAmountOut = minAmountOutUI * 10 ** orcaConsts.tokens[order.market.tokenAName].decimals * (1 - SLIPPAGE) - 50;
                console.log("----- Order Step " + i + " Swap " + amountInUI + " " + order.market.tokenBName + " for > " + minAmountOutUI + " " + order.market.tokenAName + "at price" + order.market.price + " | " + Date(Date.now()));
            } else {  // Sell, Swap A get B
                // Retry until transfer arrived
                for (let i = 0; i < RETRY_TIMES; i ++){
                    amountInUI = order.size;
                    if (parseFloat(amountInUI) > tokenRoughAmount * 0.8){break;}
                    await timer(500);
                    console.log('.');
                    console.log('expecting for '+ tokenRoughAmount + " " + order.market.tokenAName + ", got "+ amountInUI);
                }
                console.log(" ");
                minAmountOutUI = amountInUI * order.market.price * (1 - SLIPPAGE);
                amountIn = amountInUI * 10 ** orcaConsts.tokens[order.market.tokenAName].decimals - 50;
                minAmountOut = minAmountOutUI * 10 ** orcaConsts.tokens[order.market.tokenBName].decimals * (1 - SLIPPAGE) - 50;
                console.log("----- Order Step " + i + " Swap " + amountInUI + " " + order.market.tokenAName + " for > " + minAmountOutUI + " " + order.market.tokenBName + "at price" + order.market.price + " | " + Date(Date.now()));
            }
            // Swap
            const txId = await swap(connection, account, userAddress, order, amountIn, minAmountOut);
        } catch (exc) {console.error(exc); }
    }
}

async function getPoolInfoHttp(connection, marketList, markets) {
    // Append real-time pool info into original markets data
    let poolInfo = {};

    await Promise.all(marketList.map(
        async (key) => {
            poolInfo[key] = markets[key];
            const vA = await connection.getTokenAccountBalance(new solanaWeb3.PublicKey(orcaConsts.pools[key].tokenAccountA), 'confirmed');
            poolInfo[key].tokenAAmount = parseFloat(vA.value.uiAmount);
            const vB = await connection.getTokenAccountBalance(new solanaWeb3.PublicKey(orcaConsts.pools[key].tokenAccountB), 'confirmed');
            poolInfo[key].tokenBAmount = parseFloat(vB.value.uiAmount);
            poolInfo[key].price = poolInfo[key].tokenBAmount / poolInfo[key].tokenAAmount;
        }
    ));
    return poolInfo;
}

module.exports = {getPoolInfoHttp, placeOrders, placeOrdersSimple};