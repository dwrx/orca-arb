const programIds = {
    "tokenSwap":"DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1",
    "token":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
}

const pools = {
    "SOL/USDC":{
        "account":"6fTRDD7sYxCN7oyoSQaN1AWC3P2m8A6gVZzGrpej9DvL",
        "authority":"B52XRdfTsh8iUGbGEBJLHyDMjhaTW8cAFCmpASGJtnNK",
        "nonce":253,
        "poolTokenMint":"ECFcUGwHHMaZynAQpqRHkYeTBnS5GnPWZywM8aggcs3A",
        "tokenAccountA":"FdiTt7XQ94fGkgorywN1GuXqQzmURHCDgYtUutWRcy4q",
        "tokenAccountB":"7VcwKUtdKnvcgNhZt5BQHsbPrXLxhdVomsgrr7k2N5P5",
        "feeAccount":"4pdzKqAGd1WbXn1L4UpY4r58irTfjFYMYNudBrqbQaYJ",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"SOL",
        "tokenBName":"USDC",
        "curveType":"ConstantProduct"
    },
    "USDC/USDT":{
        "account":"8KZjKCNTshjwapD4TjWQonXBdi1Jm4Eks5rgrViK9UCx",
        "authority":"6Aj1GVxoCiEhhYTk9rNySg2QTgvtqSzR119KynihWH3D",
        "nonce":253,
        "poolTokenMint":"3H5XKkE9uVvxsdrFeN4BLLGCmohiQN6aZJVVcJiXQ4WC",
        "tokenAccountA":"EDukSdAegSUtKsGi6wdKTpaBuYK9ZcVj9Uz1f39ffdgi",
        "tokenAccountB":"9oaFyrMCwxKE6kBQRP5v9Jo5Uh39Y5p2fFaqGtcxnjYr",
        "feeAccount":"EDuiPgd4PuCXe9h2YieMbH7uUMeB4pgeWnP5hfcPvxu3",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"USDC",
        "tokenBName":"USDT",
        "curveType":"ConstantProduct"
    },
    "USDC/USDT-SRM":{
        "account":"3oRPcFaRHvv9pPR6nRasigVDkm3k9kTjdfjxUpgLV5Pq",
        "authority":"EtzgYTqnL1cUcXUJ8sm1P2VsaV9rGx4Q6YL64MB4SxEJ",
        "nonce":253,
        "poolTokenMint":"8qNqTaKKbdZuzQPWWXy5wNVkJh54ex8zvvnEnTFkrKMP",
        "tokenAccountA":"5d8G5r5xqTpQWVWbEeM93jE52ZXXrgQe8MkznX5BVRsV",
        "tokenAccountB":"EvbbFpEwh142yj8GZbp2FAjiSNhr32eaVJ6d1ia8r9jr",
        "feeAccount":"9ZjnwbeTQwc4XQZsG2saqfyfyMxL2ypUsNteSRqtQkAg",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"USDC",
        "tokenBName":"USDT-SRM",
        "curveType":"ConstantProduct",
        "deprecated":true
    },
    "ETH/USDC":{
        "account":"DY8qBwVGLeLJSrWib7L16mL7oB4HNAQ2f9yiYWKof54v",
        "authority":"82oSibpDKnPZ2Yk1vn6McjCsQQbKfBkGeEh5FsqeVrtU",
        "nonce":255,
        "poolTokenMint":"7TYb32qkwYosUQfUspU45cou7Bb3nefJocVMFX2mEGTT",
        "tokenAccountA":"8eUUP3t9nkXPub8X6aW2a2gzi82pUFqefwkSY8rCcVxg",
        "tokenAccountB":"2tNEBoEuqJ1pPmA1fpitDnowgUQZXvCT6W3fui67AFfV",
        "feeAccount":"AcMaBVt6S43JQXKnEDqdicxYofb5Cj1UgFWF9AsurTp6",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"ETH",
        "tokenBName":"USDC",
        "curveType":"ConstantProduct"
    },
    "ETH/USDT-SRM":{
        "account":"GTy6wKTohJUNyL2DPozFqQnmW132oAemPQejXmCQusSR",
        "authority":"2XKMznkLjgGCdiAS5YVByuJqu5YMewV8njg3Gzqs8g2H",
        "nonce":254,
        "poolTokenMint":"EhBAmhkgEsMa8McFB5bpqZaRpZvGBBJ4jN59T5xToPdG",
        "tokenAccountA":"oDTyfGTFaJFBQcrYR59CkTjodtVyG6m43u4fmNjAySc",
        "tokenAccountB":"5iDQpmXA53Pum9h7BLbper8f2zrjp4CbMUDKPTR3ADki",
        "feeAccount":"92GnLXanYHr2hbdynqtfLYDRQLmqqV6WEMmECEnkTUWj",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"ETH",
        "tokenBName":"USDT-SRM",
        "curveType":"ConstantProduct",
        "deprecated":true
    },
    "BTC/ETH":{
        "account":"Fz6yRGsNiXK7hVu4D2zvbwNXW8FQvyJ5edacs3piR1P7",
        "authority":"FjRVqnmAJgzjSy2J7MtuQbbWZL3xhZUMqmS2exuy4dXF",
        "nonce":255,
        "poolTokenMint":"8pFwdcuXM7pvHdEGHLZbUR8nNsjj133iUXWG6CgdRHk2",
        "tokenAccountA":"81w3VGbnszMKpUwh9EzAF9LpRzkKxc5XYCW64fuYk1jH",
        "tokenAccountB":"6r14WvGMaR1xGMnaU8JKeuDK38RvUNxJfoXtycUKtC7Z",
        "feeAccount":"56FGbSsbZiP2teQhTxRQGwwVSorB2LhEGdLrtUQPfFpb",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"BTC",
        "tokenBName":"ETH",
        "curveType":"ConstantProduct"
    },
    "ETH/SOL":{
        "account":"4vWJYxLx9F7WPQeeYzg9cxhDeaPjwruZXCffaSknWFxy",
        "authority":"Hmjv9wvRctYXHRaX7dTdHB4MsFk4mZgKQrqrgQJXNXii",
        "nonce":252,
        "poolTokenMint":"7bb88DAnQY7LSoWEuqezCcbk4vutQbuRqgJMqpX8h6dL",
        "tokenAccountA":"FidGus13X2HPzd3cuBEFSq32UcBQkF68niwvP6bM4fs2",
        "tokenAccountB":"5x1amFuGMfUVzy49Y4Pc3HyCVD2usjLaofnzB3d8h7rv",
        "feeAccount":"CYGRBB4qAYzSqdnvVaXvyZLg5j7YNVcuqM6gdD2MMUi1",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"ETH",
        "tokenBName":"SOL",
        "curveType":"ConstantProduct"
    },
    "RAY/SOL":{
        "account":"4c8jpn6sLMrZHMYNq6idFfMdLBWEqn1r1wFNtgsPqTwE",
        "authority":"6nL4UZVRkn34Mxb7DGU91U86zhtF2PTX72Ncs64sUFx",
        "nonce":252,
        "poolTokenMint":"GWEmABT4rD3sGhyghv9rKbfdiaFe5uMHeJqr6hhu3XvA",
        "tokenAccountA":"HxuUQPpqkxzYPYQqM6XkVVVw2UQt4m3eMYzYQFJZjuvG",
        "tokenAccountB":"B6whMxirSzzNcSeJ1G4HDFTRKjPFcWovCL53uxG7LexB",
        "feeAccount":"3uUNB1KSwyF6YDuiQiRbFnnDW4Q625SQJk7LuoxQA8Pw",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"RAY",
        "tokenBName":"SOL",
        "curveType":"ConstantProduct"
    },
    "SOL/USDT":{
        "account":"4bS6bkBdJ4B1Bt4ft3oGF8La7eKpCqz8xnu1AMpMxWSP",
        "authority":"EAvLj3zW236pUSSSzwjL18QuPpkTxkWaVSR5GdX7yiNa",
        "nonce":255,
        "poolTokenMint":"BmZNYGt7aApGTUUxAQUYsW64cMbb6P7uniokCWaptj4D",
        "tokenAccountA":"BBDQmitNga99M9QsBRnyos9uWPumNbWLC1mfbReJi45C",
        "tokenAccountB":"8xepSs1iXsSw8QrCS1rpZk8KY3fMwUZqDT4dmzDa2trX",
        "feeAccount":"HR2rWgcU6SNCWxJDozDu6qCgSSvUoKCynbhQPGRNqpCG",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"SOL",
        "tokenBName":"USDT",
        "curveType":"ConstantProduct"
    },
    "SOL/USDT-SRM":{
        "account":"2Qqh2DS448qZMwhA8o5jBnSQF54uPPFHUJZULErA1or1",
        "authority":"EWEZg2BgcWhG9P8dcRg8rSUnGii1rjgZoeuyi8iV3c4Z",
        "nonce":255,
        "poolTokenMint":"E4cthfUFaDd4x5t1vbeBNBHm7isqhM8kapthPzPJz1M2",
        "tokenAccountA":"Bm2Sj68iAWhmxmQfSLfPzbvDQsd9MAAiCrbDwA7KQ5Va",
        "tokenAccountB":"DdcQxiv9d8JuQMYmerWDgxsciASqHxkEpymqVSkizZpc",
        "feeAccount":"GS6F9UV9TLcEW74LFCt3Fj5Lpvnfexngvj1VbAF5qUNv",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"SOL",
        "tokenBName":"USDT-SRM",
        "curveType":"ConstantProduct",
        "deprecated":true
    },
    "SOL/SRM":{
        "account":"C4k1gxs9NnPhSWUbtEpnptYiduy2ZWX237gGD22N8QeC",
        "authority":"DefFEGVX72TsLGGCAQAVmLbWL2zhBomNqKzLCdHZARH9",
        "nonce":255,
        "poolTokenMint":"6ojPekCSQimAjDjaMApLvh3jF6wnZeNEVRVVoGNzEXvV",
        "tokenAccountA":"PWoAhT9FTgUY6TftarQePDaDssDTw1z22g6oa7LkDWH",
        "tokenAccountB":"CrW8moTKrBbyneB4xJ3cL3KnU1cWLrZhyfHxDBdHRtTz",
        "feeAccount":"C69yUpJnvYrpv3Zm8To89CfqXMWYCbB9gEzyD259qFcn",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"SOL",
        "tokenBName":"SRM",
        "curveType":"ConstantProduct"
    },
    "FTT/SOL":{
        "account":"G8Dd2ExLEvPkXMtiyeo7AM3W3Z6ueg5bpWQ4D4Raf6jo",
        "authority":"8V8ytMis7wSZ4eDCuPqhU2Qc6q4AW4wi9yLYce6yzQyS",
        "nonce":255,
        "poolTokenMint":"YJRknE9oPhUMtq1VvhjVzG5WnRsjQtLsWg3nbaAwCQ5",
        "tokenAccountA":"ESg4rHAiaEoUN7JxJdZZ1DdDRQruohn6qPksxUi89VTb",
        "tokenAccountB":"7y5rSEbUJ76cVhnK6aTbr7hvFJsVed45qSmke5Ypii5X",
        "feeAccount":"22LsJpdsErwqAWipxaqhpgfaBDcHAWSyZjmzdzLR5gtW",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"FTT",
        "tokenBName":"SOL",
        "curveType":"ConstantProduct"
    },
    "KIN/SOL":{
        "account":"7fAzYcD19gBD222pK3v7USX1URu1r6ThAGLR265DADjh",
        "authority":"7WKXXMHzwQiaaE97ZFLWo3w4W4oDZAkQ85oPWdcRpJrR",
        "nonce":255,
        "poolTokenMint":"C9PKvetJPrrPD53PR2aR8NYtVZzucCRkHYzcFXbZXEqu",
        "tokenAccountA":"25yytj8QKLUVZfW4vbvsahirYDzyUJ9TTxNxUCFkfiTW",
        "tokenAccountB":"FbiCMvyFZ53xSJpfr6KvGwvCARCRq6QTcxM2QZRFwdsg",
        "feeAccount":"FRpJtRSe12ZAwo162ignfSxx7u952vMA3UA4RZxUi41H",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"KIN",
        "tokenBName":"SOL",
        "curveType":"ConstantProduct"
    },
    "ROPE/SOL":{
        "account":"4kMBJ8x85BgyYKi4t7ZSCh4gHK8U5QWjARzGuMCPiaeu",
        "authority":"9WJtMexXKvBXHGZ2iEicatDkQ5fKHKJk83cvggikwA8m",
        "nonce":253,
        "poolTokenMint":"6SfhBAmuaGf9p3WAxeHJYCWMABnYUMrdzNdK5Stvvj4k",
        "tokenAccountA":"6ZTB5R1mru5gUG9uzos3YpRWSZuwPrVc4JCYWMZLXTek",
        "tokenAccountB":"5Y3usvmD5PDMuvYhwNSoFkydsc3pmrCJ5XgMBAdgxMCC",
        "feeAccount":"G8UGvutb4ALWwskVzn8cb4J7oRdng5oVkbtWn22ehP5m",
        "feeNumerator":30,
        "feeDenominator":10000,
        "ownerTradeFeeNumerator":0,
        "ownerTradeFeeDenominator":0,
        "ownerWithdrawFeeNumerator":0,
        "ownerWithdrawFeeDenominator":0,
        "hostFeeNumerator":0,
        "hostFeeDenominator":0,
        "tokenAName":"ROPE",
        "tokenBName":"SOL",
        "curveType":"ConstantProduct"
    }
}

tokens = {
    "SOL": {
        "chainId": 101,
        "address": "So11111111111111111111111111111111111111112",
        "symbol": "SOL",
        "name": "Wrapped SOL",
        "decimals": 9,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png",
        "tags": [],
        "extensions": {
            "website": "https://solana.com/"
        }
    },
    "USDC": {
        "chainId": 101,
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "symbol": "USDC",
        "name": "USD Coin",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        "tags": [
            "stablecoin"
        ],
        "extensions": {
            "website": "https://www.centre.io/"
        }
    },
    "BTC": {
        "chainId": 101,
        "address": "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
        "symbol": "BTC",
        "name": "Wrapped Bitcoin (Sollet)",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/bitcoin/info/logo.png",
        "tags": [
            "wrapped-sollet",
            "ethereum"
        ],
        "extensions": {
            "bridgeContract": "https://etherscan.io/address/0xeae57ce9cc1984f202e15e038b964bb8bdf7229a"
        }
    },
    "ETH": {
        "chainId": 101,
        "address": "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
        "symbol": "ETH",
        "name": "Wrapped Ethereum (Sollet)",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        "tags": [
            "wrapped-sollet",
            "ethereum"
        ],
        "extensions": {
            "bridgeContract": "https://etherscan.io/address/0xeae57ce9cc1984f202e15e038b964bb8bdf7229a"
        }
    },
    "YFI": {
        "chainId": 101,
        "address": "3JSf5tPeuscJGtaCp5giEiDhv51gQ4v3zWg8DGgyLfAB",
        "symbol": "YFI",
        "name": "Wrapped YFI (Sollet)",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png",
        "tags": [
            "wrapped-sollet",
            "ethereum"
        ],
        "extensions": {
            "bridgeContract": "https://etherscan.io/address/0xeae57ce9cc1984f202e15e038b964bb8bdf7229a"
        }
    },
    "LINK": {
        "chainId": 101,
        "address": "CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG",
        "symbol": "LINK",
        "name": "Wrapped Chainlink (Sollet)",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
        "tags": [
            "wrapped-sollet",
            "ethereum"
        ],
        "extensions": {
            "bridgeContract": "https://etherscan.io/address/0xeae57ce9cc1984f202e15e038b964bb8bdf7229a"
        }
    },
    "XRP": {
        "chainId": 101,
        "address": "Ga2AXHpfAF6mv2ekZwcsJFqu7wB4NV331qNH7fW9Nst8",
        "symbol": "XRP",
        "name": "Wrapped XRP (Sollet)",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ripple/info/logo.png",
        "tags": [
            "wrapped-sollet",
            "ethereum"
        ],
        "extensions": {
            "bridgeContract": "https://etherscan.io/address/0xeae57ce9cc1984f202e15e038b964bb8bdf7229a"
        }
    },
    "wUSDT": {
        "chainId": 101,
        "address": "BQcdHdAQW1hczDbBi9hiegXAR7A98Q9jx3X3iBBBDiq4",
        "symbol": "wUSDT",
        "name": "Wrapped USDT (Sollet)",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/solana-labs/explorer/public/tokens/usdt.svg",
        "tags": [
            "stablecoin",
            "wrapped-sollet",
            "ethereum"
        ],
        "extensions": {
            "bridgeContract": "https://etherscan.io/address/0xeae57ce9cc1984f202e15e038b964bb8bdf7229a"
        }
    },
    "SUSHI": {
        "chainId": 101,
        "address": "AR1Mtgh7zAtxuxGd2XPovXPVjcSdY3i4rQYisNadjfKy",
        "symbol": "SUSHI",
        "name": "Wrapped SUSHI (Sollet)",
        "decimals": 6,
        "logoURI": "https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png",
        "tags": [
            "wrapped-sollet",
            "ethereum"
        ],
        "extensions": {
            "website": "https://www.sushi.com",
            "bridgeContract": "https://etherscan.io/address/0xeae57ce9cc1984f202e15e038b964bb8bdf7229a"
        }
    },
}

module.exports = {pools, programIds, tokens};