"use strict";
exports.__esModule = true;
exports.programIds = exports.setProgramIds = exports.PROGRAM_IDS = exports.ENABLE_FEES_INPUT = exports.SWAP_HOST_FEE_ADDRESS = exports.SWAP_PROGRAM_OWNER_FEE_ADDRESS = exports.WRAPPED_SOL_MINT = void 0;
var web3_js_1 = require("@solana/web3.js");
var models_1 = require("../models");
exports.WRAPPED_SOL_MINT = new web3_js_1.PublicKey("So11111111111111111111111111111111111111112");
var TOKEN_PROGRAM_ID = new web3_js_1.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
var SWAP_PROGRAM_ID;
var SWAP_PROGRAM_LEGACY_IDS;
var SWAP_PROGRAM_LAYOUT;
exports.SWAP_PROGRAM_OWNER_FEE_ADDRESS = new web3_js_1.PublicKey("HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN");
exports.SWAP_HOST_FEE_ADDRESS = process.env.REACT_APP_SWAP_HOST_FEE_ADDRESS
    ? new web3_js_1.PublicKey("" + process.env.REACT_APP_SWAP_HOST_FEE_ADDRESS)
    : exports.SWAP_PROGRAM_OWNER_FEE_ADDRESS;
exports.ENABLE_FEES_INPUT = false;
console.debug("Host address: " + (exports.SWAP_HOST_FEE_ADDRESS === null || exports.SWAP_HOST_FEE_ADDRESS === void 0 ? void 0 : exports.SWAP_HOST_FEE_ADDRESS.toBase58()));
console.debug("Owner address: " + (exports.SWAP_PROGRAM_OWNER_FEE_ADDRESS === null || exports.SWAP_PROGRAM_OWNER_FEE_ADDRESS === void 0 ? void 0 : exports.SWAP_PROGRAM_OWNER_FEE_ADDRESS.toBase58()));
// legacy pools are used to show users contributions in those pools to allow for withdrawals of funds
exports.PROGRAM_IDS = [
    {
        name: "mainnet-beta",
        swap: function () { return ({
            current: {
                pubkey: new web3_js_1.PublicKey("SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8"),
                layout: models_1.TokenSwapLayout
            },
            legacy: [new web3_js_1.PublicKey("9qvG1zUp8xF1Bi4m6UdRNby1BAAuaDrUxSpv4CmRRMjL")]
        }); }
    },
    {
        name: "testnet",
        swap: function () { return ({
            current: {
                pubkey: new web3_js_1.PublicKey("SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8"),
                layout: models_1.TokenSwapLayout
            },
            legacy: []
        }); }
    },
    {
        name: "devnet",
        swap: function () { return ({
            current: {
                pubkey: new web3_js_1.PublicKey("SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8"),
                layout: models_1.TokenSwapLayout
            },
            legacy: []
        }); }
    },
    {
        name: "localnet",
        swap: function () { return ({
            current: {
                pubkey: new web3_js_1.PublicKey("369YmCWHGxznT7GGBhcLZDRcRoGWmGKFWdmtiPy78yj7"),
                layout: models_1.TokenSwapLayout
            },
            legacy: []
        }); }
    },
];
var setProgramIds = function (envName) {
    var instance = exports.PROGRAM_IDS.find(function (env) { return env.name === envName; });
    if (!instance) {
        return;
    }
    var swap = instance.swap();
    SWAP_PROGRAM_ID = swap.current.pubkey;
    SWAP_PROGRAM_LAYOUT = swap.current.layout;
    SWAP_PROGRAM_LEGACY_IDS = swap.legacy;
};
exports.setProgramIds = setProgramIds;
var programIds = function () {
    return {
        token: TOKEN_PROGRAM_ID,
        swap: SWAP_PROGRAM_ID,
        swapLayout: SWAP_PROGRAM_LAYOUT,
        swap_legacy: SWAP_PROGRAM_LEGACY_IDS
    };
};
exports.programIds = programIds;
