# ORCA Arbitrager
This is a project we release for Solana Hackathon. It captures the 
triangular arbitrage opportunities on a wonderful swap project named Orca.so.

## Overview
Solana is a promising blockchain. It's fast and low cost, which makes a profound difference
in the application scenario.

The features of Solana made possible on-chain high frequency operations 
which are beyond imagination of traditional blockchain system.

## The AB Team
We are a group of experienced devs active in Solana eco-system.

The team has many projects undergoing. We can't release these projects 
since they are under contract with our partners or customers. 

## The Project
Here we are releasing some of our self operating projects, arbitrage bots.

Due to the nature that arbitrage strategy has limited capacity, the strategy we release
is outdated. This project may still run well and make profit. However it's not guaranteed 
to make stable profit for you.

During some test runs weeks before releasing, the bot can make 2%-8% daily yeild trading on Orca
with swap fee taking into consideration. 

It's one of the most naive arbitrage strategy. We believe Solana eco is in its 
preliminary stage since there's still some room for naive arbitrage opportunities.

## Track Records

| TX id | Sol amount |
|---|---|
| 8aG9Y6DtAG75w6rsE3H~~~ | +17.271564861 |
| XotmfdBn9UazBDJWdYM~~~ | +17.327121539 |
| H18nr1FvNVpEpaU4jAv~~~ | +17.352796525 |
| 578sExpXFJz2zvdd6dA~~~ | +17.395042168 |
| 3C3Wx5BJK6UewH2nhvE~~~ | +17.400408635 |

* Skipped 2 transaction on ETH->USDC, USDC-SOL for each of the triangle trade.

## Run the project
The purpose of releasing this project is not for running it on your own. 
And here we provide some hints on building and running the project.

### Building
The ORCA-Arb uses Solana web3 api. 

1. Install typescript utilities
2. Compile the dependencies. 
3. Update the user account address defined in `userConsts.js`.
4. Run `orca_sub.js`.

### Contact
0xAlexBai@gmail.com

keybase, discord

### Walkthrough
Let's take a walk.

1. Install node packages `npm install`
1. Tweak the parameters of the bot. Please modify `orca_sub.js`:

    ```
    const markets = ["SOL/USDC", "ETH/USDC", "ETH/SOL"];
    const SLIPPAGE = 0.015;
    const ARB_THRESHOLD = 0.0111;
    const RETRY_AMOUNT = 60;
    const INIT_ROUGH_AMOUNT = 0.2;
    ```
    
    where 
    - `markets` are triangle loop you want to run arbitrage on
    - `SLIPPAGE` is slippage when swapping on Orca
    - `ARB_THRESHOLD` is the threshold on loop gain you want to trigger the arbitrage action.
      Orca takes 0.3% transaction fee and each action consists of 3 swaps, so this must be
      greater than 0.009. And please add some redundancy in case of network latency.
      Each full cycle takes around 30 seconds to confirm. 
      In our later versions this time is shrunk to 10s. 
    - `RETRY_AMOUNT` is times you want to wait until previous transaction is fully confirmed.
    - `INIT_ROUGH_AMOUNT` is used to tell if previous transaction is confirmed. 
        Please enter some amount that is around 80% of trading volume.
        Be aware the bot will trade on all sol that is wrapped in the account. 
        This is just a threshold. 

3. execute the script `node orca_sub.js` and wait for the money being printed.
    - At first the pool info is not fully synchronized. Pleaes wait until 'dirty pool'
      in the log stops.
    - Then the bot will print `SOL => ETH  ... 0.9942491591359662 | Sat Jun 19 2021 12:52:36 GMT+0800 (China Standard Time)`
      when potential arb opportunities occur. And arb action will be triggered
      when loop gain is greater than `ARB_THRESHOLD` and each swap operations will be logged.
      
### Analysis
The price of each pair is sufficiently defined by spl-token balance of a pair of pools.
So there's no guarantee that the prices is *conservative field* defiened on discrete set of each tokens.
A conservative field is a field where linear integral is path-independent, or loop integral equals 0.
In a price defined on a conservative field, a loop of three pairs will equal to 1, 

> e.g. ETH/USDC = 2000, SOL/USDC = 40, then ETH/SOL must be 50
> ETH/USDC^-1 * SOL/USDC * ETH/SOL == 1

As we all know, reality is broken, these prices never sum up neatly.
So we can trade in such triangular pattern to make marginal profit each trade.

In some "good old days" such naive bot can achieve ~10% profit each day in a capacity of 10,000 USD.