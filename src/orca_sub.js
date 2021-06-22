const orcaConsts = require("./orcaConsts");
const solanaWeb3 = require('@solana/web3.js');
const bot = require('./bot.js');
const userConst = require('./userConsts.js');
const tokenSwap = require("./models/tokenSwap.js");
const splToken = require('@solana/spl-token');

// let connection = new solanaWeb3.Connection("https://vip-api.mainnet-beta.solana.com");
let connection = new solanaWeb3.Connection("https://solana-api.projectserum.com");
// let connection = new solanaWeb3.Connection("https://solana-api.orca.so");
// let connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");

connection.getBalance(new solanaWeb3.PublicKey('4Q2JvTnzeoZuvNTfqAmmSqNca2DmLj8VC3fNce17vLyb')).then((rst)=>{console.log(rst)})

const user = userConst.user;
const myAccount = new solanaWeb3.Account(user.secretKey);
console.log('MyAccount: ' + myAccount.publicKey.toBase58());

const markets = ["SOL/USDC", "ETH/USDC", "ETH/SOL"];
const SLIPPAGE = 0.015;
const ARB_THRESHOLD = 0.0111;
const RETRY_AMOUNT = 60;
const INIT_ROUGH_AMOUNT = 0.2;


let poolInfo = {};
let poolSanity = false;

const BALANCE_COMMITMENT = "finalized";

async function getPoolInfoHttp(marketList, markets) {
    // Append real-time pool info into original markets data
    let poolInfo = {};

    await Promise.all(marketList.map(
        async (key) => {
            poolInfo[key] = markets[key];
            const vA = await connection.getTokenAccountBalance(new solanaWeb3.PublicKey(orcaConsts.pools[key].tokenAccountA), BALANCE_COMMITMENT);
            poolInfo[key].tokenAAmount = parseFloat(vA.value.uiAmount);
            const vB = await connection.getTokenAccountBalance(new solanaWeb3.PublicKey(orcaConsts.pools[key].tokenAccountB), BALANCE_COMMITMENT);
            poolInfo[key].tokenBAmount = parseFloat(vB.value.uiAmount);
            poolInfo[key].price = poolInfo[key].tokenBAmount / poolInfo[key].tokenAAmount;
            poolInfo[key].tokenALastUpdate = Date.now();
            poolInfo[key].tokenBLastUpdate = Date.now();
        }
    ));
    return poolInfo;
}

function getLoopRatio(marketList, targetMarkets, orderSide){
    let v = 1; // Price in initial quote token for current holding token
    let pickOrders = [];
    let priceToken, priceQuoteToken;
    for (const [i, marketName] of marketList.entries()) {
        const market = targetMarkets[marketName];
        // Buy = 0, Sell = 1
        if (orderSide[i] === 0) {
            priceQuoteToken = v;
            priceToken = priceQuoteToken * market.price;
            v = priceToken;
        } else {
            priceToken = v;
            priceQuoteToken = v / market.price;
            v = priceQuoteToken;
        }
        pickOrders.push({market: market, side: orderSide[i]});
    }
    return [v, pickOrders]
}

let txConfirmOption = {
    skipPreflight: true,
    commitment: "singleGossip",
};
let accountBalanceOption = "confirmed";

async function placeOrders(pickOrders){
    let tokenRoughAmount = INIT_ROUGH_AMOUNT;
    let lastTxid = null;
    console.log("======== Place Order =======");
    for (const [i, order] of pickOrders.entries()){
        try{
            let amountIn, minAmountOut, amountInUI, minAmountOutUI;
            if (order.side === 0) { // Buy, Swap B get A
                // Retry until transfer arrived
                for (let i = 0; i < RETRY_AMOUNT; i ++){
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
                for (let i = 0; i < RETRY_AMOUNT; i ++){
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
            lastTxid = await swap(connection, myAccount, order, amountIn, minAmountOut);
        } catch (exc) {console.error(exc); }
    }
}

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

const swap = async function(connection, account, order, amountIn, minAmountOut) {

    //---------------------------
    // SWAP
    //---------------------------

    let instructions = [];
    let cleanupInstructions = [];
    let signers = [];
    const market = order.market;

    let fromAccount, toAccount, holdingA, holdingB;
    if (order.side === 0){  // Buy
        fromAccount = new solanaWeb3.PublicKey(user[market.tokenBName]);
        toAccount = new solanaWeb3.PublicKey(user[market.tokenAName]);
        holdingA = new solanaWeb3.PublicKey(market.tokenAccountB);
        holdingB = new solanaWeb3.PublicKey(market.tokenAccountA);
    } else { // Sell
        fromAccount = new solanaWeb3.PublicKey(user[market.tokenAName]);
        toAccount = new solanaWeb3.PublicKey(user[market.tokenBName]);
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

const timer = ms => new Promise(res => setTimeout(res, ms));


async function checkLoopAndArb(poolInfo){
    if (!poolSanity){console.log("dirty pool"); return null;}

    let [v, pickOrders] = getLoopRatio(["ETH/SOL", "ETH/USDC", "SOL/USDC"], poolInfo, [0, 1, 0]);
    if (1-v > ARB_THRESHOLD / 2) {
        console.log("SOL => ETH  ... " + v + ' | ' + Date(Date.now()));
    }
    if (1 - v > ARB_THRESHOLD){
        console.log((v * 100).toFixed(4) + '%   | ' + Date(Date.now()));
        await placeOrders(pickOrders);
    }


    [v, pickOrders] = getLoopRatio(["SOL/USDC", "ETH/USDC", "ETH/SOL"], poolInfo, [1, 0, 1]);
    if (1-v > ARB_THRESHOLD / 2) {
        console.log("SOL => USDC ... " + v + ' | ' + Date(Date.now()));
    }

    if (1 - v > ARB_THRESHOLD){
        console.log((v * 100).toFixed(4) + '%   | ' + Date(Date.now()));
        await placeOrders(pickOrders);
    }
}

const run = async function (){
    function getAmount(name, info){
        if (name.toLowerCase() === "SOL".toLowerCase()){
            return info.lamports / 10 ** 9;
        } else {
            const d = splToken.AccountLayout.decode(info.data);
            const v = splToken.u64.fromBuffer(d.amount);
            return v / 10 ** orcaConsts.tokens[name].decimals;
        }
    }

    let marketList = ["ETH/SOL", "ETH/USDC", "SOL/USDC"];
    marketList.map(async (key) => {poolInfo[key] = orcaConsts.pools[key];});
    poolInfo = await getPoolInfoHttp(marketList, poolInfo);

    // Set Callbacks
    for (const key of ["SOL/USDC", "ETH/USDC", "ETH/SOL"]) {
        connection.onAccountChange(new solanaWeb3.PublicKey(orcaConsts.pools[key].tokenAccountA, BALANCE_COMMITMENT), async function (info, context) {
            const amount = getAmount(key.split('/')[0], info);
            poolInfo[key].tokenAAmount = amount;
            poolInfo[key].price = poolInfo[key].tokenBAmount / poolInfo[key].tokenAAmount;
            poolInfo[key].tokenALastUpdate = Date.now();
            poolSanity = Date.now() - poolInfo[key].tokenBLastUpdate <= 50;
        });
        connection.onAccountChange(new solanaWeb3.PublicKey(orcaConsts.pools[key].tokenAccountB, BALANCE_COMMITMENT), async function (info, context) {
            const amount = getAmount(key.split('/')[1], info);
            poolInfo[key].tokenBAmount = amount;
            poolInfo[key].price = poolInfo[key].tokenBAmount / poolInfo[key].tokenAAmount;
            poolInfo[key].tokenBLastUpdate = Date.now();
            poolSanity = Date.now() - poolInfo[key].tokenALastUpdate <= 50;
        });
    }
    while (true){
        await checkLoopAndArb(poolInfo);
        await timer(300);
    }

}
run();
