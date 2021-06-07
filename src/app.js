const bot = require('./bot.js');
const stepConsts = require('./step_consts');
const userConst = require('./userConsts.js');

const solanaWeb3 = require('@solana/web3.js');
const spl = require('@solana/spl-token');

const pools = stepConsts.stepConsts.pools;

let connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
let connection2 = new solanaWeb3.Connection("https://solana-api.projectserum.com");

for (const key of ['sol_usdc', 'eth_usdc', 'eth_sol']) {
    connection.onAccountChange(stepConsts.stepConsts.pools[key].token1, function (info, context) {
        console.log(key + " Token1 " + info.lamports / 10 ** 9);
    })
    connection.onAccountChange(stepConsts.stepConsts.pools[key].token2, function (info, context) {
        console.log(key + " Token2 " + info.lamports / 10 ** 9);
    })
}

const myAccount = new solanaWeb3.Account(userConst.user.secretKey);
console.log('MyAccount: ' + myAccount.publicKey.toBase58());

async function getPoolSize() {
    let poolSize = {};

    await Promise.all(Object.entries(stepConsts.stepConsts.pools).map(
        async ([key, value]) => {
            poolSize[key] = {};
            const v1 = await connection.getTokenAccountBalance(value.token1);
            poolSize[key].token1 = parseFloat(v1.value.uiAmount);
            const v2 = await connection.getTokenAccountBalance(value.token2);
            poolSize[key].token2 = parseFloat(v2.value.uiAmount);
            poolSize[key].price = poolSize[key].token2 / poolSize[key].token1;
        }
    ));
    return poolSize;
}

const timer = ms => new Promise(res => setTimeout(res, ms));

const run = async function (){
    while(true) {
        try {
            const poolSize = await getPoolSize()

            // console.log(poolSize);

            let v = 1;
            for (const key of ['sol_usdc', 'usdc_eth', 'eth_sol']) {
                v = v * poolSize[key].price;
            }
            if (Math.abs(v-1) > 0.005) {
                console.log((v * 100).toFixed(4) + '%   | ' + Date(Date.now()));
            }

            // Arbitrage Trigger
            const amount_sol = 15;
            const arbitrageThreshold = 0.0098;
            const epsilon = 0.001;
            const slippage = 0.015;
            let balance;
            let rst_amount_usdc, rst_amount_eth, rst_amount_sol;
            if (v - 1 > arbitrageThreshold) {
                console.log((v * 100).toFixed(4) + '%   | ' + Date(Date.now()));
                for (const key of ['sol_usdc', 'usdc_eth', 'eth_sol']) {
                    console.log(poolSize[key].price);
                }
                //// Forward arbitrage
                // SOL => USDC
                try {
                    rst_amount_usdc = amount_sol * poolSize.sol_usdc.price * (1 - epsilon) * (1-slippage);
                    console.log("Swap SOL for USDC, " + amount_sol.toFixed(6) + ", " + rst_amount_usdc.toFixed(6));
                    await bot.swap(connection2, myAccount, pools.sol_usdc,
                        amount_sol * 10 ** 9, rst_amount_usdc * 10 ** 6);
                } catch (exc) {console.log(exc); }

                // USDC => ETH
                try {
                    balance = await connection2.getTokenAccountBalance(stepConsts.stepConsts.pools.usdc_sol.userSource);
                    if (balance.value.uiAmount < 0.1){await timer(10000);}
                    rst_amount_usdc = parseFloat(balance.value.uiAmount) * 0.9995;
                    rst_amount_eth = rst_amount_usdc * poolSize.usdc_eth.price * (1 - epsilon) * (1-slippage);
                    console.log("Swap USDC for ETH, " + rst_amount_usdc.toFixed(6) + ", " + rst_amount_eth.toFixed(6));
                    await bot.swap(connection2, myAccount, pools.usdc_eth,
                        rst_amount_usdc * 10 ** 6, rst_amount_eth * 10 ** 6);
                } catch (exc) {console.log(exc); }
                // ETH => SOL
                try {
                    balance = await connection2.getTokenAccountBalance(stepConsts.stepConsts.pools.eth_sol.userSource);
                    if (balance.value.uiAmount < 0.05){await timer(10000);}
                    rst_amount_eth = parseFloat(balance.value.uiAmount) * 0.9995;
                    rst_amount_sol = rst_amount_eth * poolSize.eth_sol.price * (1 - epsilon) * (1-slippage)
                    console.log("Swap ETH for SOL, " + rst_amount_eth.toFixed(6) + ", " + rst_amount_sol.toFixed(6));
                    await bot.swap(connection2, myAccount, pools.eth_sol,
                        rst_amount_eth * 10 ** 6, rst_amount_sol * 10 ** 9);
                } catch (exc) {console.log(exc); }
            }
            if (1 - v > arbitrageThreshold) {
                console.log((v * 100).toFixed(4) + '%   | ' + Date(Date.now()));
                for (const key of ['sol_eth', 'eth_usdc', 'usdc_sol']) {
                    console.log(poolSize[key].price);
                }
                // SOL => ETH
                try{
                    rst_amount_eth = amount_sol * poolSize.sol_eth.price * (1 - epsilon) * (1-slippage);
                    console.log("Swap SOL for ETH, " + amount_sol.toFixed(6) + ", " + rst_amount_eth.toFixed(6));
                    await bot.swap(connection2, myAccount, pools.sol_eth,
                        amount_sol * 10 ** 9, rst_amount_eth * 10 ** 6);
                } catch (exc) {console.log(exc); }
                // ETH => USDC
                try{
                    balance = await connection2.getTokenAccountBalance(stepConsts.stepConsts.pools.eth_usdc.userSource);
                    if (balance.value.uiAmount < 0.05){await timer(10000);}
                    rst_amount_eth = parseFloat(balance.value.uiAmount) * 0.9995;
                    rst_amount_usdc = rst_amount_eth * poolSize.eth_usdc.price * (1 - epsilon) * (1-slippage);
                    console.log("Swap ETH for USDC, " + rst_amount_eth.toFixed(6) + ", " + rst_amount_usdc.toFixed(6));
                    await bot.swap(connection2, myAccount, pools.eth_usdc,
                        rst_amount_eth * 10 ** 6, rst_amount_usdc * 10 ** 6);
                } catch (exc) {console.log(exc); }
                // USDC => SOL
                try{
                    balance = await connection2.getTokenAccountBalance(stepConsts.stepConsts.pools.usdc_sol.userSource);
                    if (balance.value.uiAmount < 0.1){await timer(10000);}
                    rst_amount_usdc = parseFloat(balance.value.uiAmount) * 0.9995;
                    rst_amount_sol = rst_amount_usdc * poolSize.usdc_sol.price * (1-epsilon) * (1-slippage);
                    console.log("Swap USDC for SOL, " + rst_amount_usdc.toFixed(6) + ", " + rst_amount_sol.toFixed(6));
                    await bot.swap(connection2, myAccount, pools.usdc_sol,
                        rst_amount_usdc * 10 ** 6, rst_amount_sol * 10 ** 9)
                } catch (exc) {console.log(exc); }
            }
        } catch (exception) {
            console.log(exception);
        }

        await timer(1000);
    }
}
run();

// const amountIn = 100000000;
// bot.swap(connection, myAccount, stepConsts.stepConsts.pools.sol_eth, amountIn);


