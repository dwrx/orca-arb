"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.swapInstruction = exports.withdrawExactOneInstruction = exports.withdrawInstruction = exports.depositExactOneInstruction = exports.depositInstruction = exports.createInitSwapInstruction = exports.TokenSwapLayout = exports.TokenSwapLayoutV1 = exports.TokenSwapLayoutLegacyV0 = exports.uint64 = exports.publicKey = exports.TokenSwap = void 0;
var spl_token_swap_1 = require("@solana/spl-token-swap");
var web3_js_1 = require("@solana/web3.js");
var BufferLayout = require("buffer-layout");
var pool_1 = require("./pool");
var spl_token_swap_2 = require("@solana/spl-token-swap");
__createBinding(exports, spl_token_swap_2, "TokenSwap");
/**
 * Layout for a public key
 */
var publicKey = function (property) {
    if (property === void 0) { property = "publicKey"; }
    return BufferLayout.blob(32, property);
};
exports.publicKey = publicKey;
/**
 * Layout for a 64bit unsigned value
 */
var uint64 = function (property) {
    if (property === void 0) { property = "uint64"; }
    return BufferLayout.blob(8, property);
};
exports.uint64 = uint64;
var FEE_LAYOUT = BufferLayout.struct([
    BufferLayout.nu64("tradeFeeNumerator"),
    BufferLayout.nu64("tradeFeeDenominator"),
    BufferLayout.nu64("ownerTradeFeeNumerator"),
    BufferLayout.nu64("ownerTradeFeeDenominator"),
    BufferLayout.nu64("ownerWithdrawFeeNumerator"),
    BufferLayout.nu64("ownerWithdrawFeeDenominator"),
    BufferLayout.nu64("hostFeeNumerator"),
    BufferLayout.nu64("hostFeeDenominator"),
], "fees");
exports.TokenSwapLayoutLegacyV0 = BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    BufferLayout.u8("nonce"),
    exports.publicKey("tokenAccountA"),
    exports.publicKey("tokenAccountB"),
    exports.publicKey("tokenPool"),
    exports.uint64("feesNumerator"),
    exports.uint64("feesDenominator"),
]);
exports.TokenSwapLayoutV1 = BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    BufferLayout.u8("nonce"),
    exports.publicKey("tokenProgramId"),
    exports.publicKey("tokenAccountA"),
    exports.publicKey("tokenAccountB"),
    exports.publicKey("tokenPool"),
    exports.publicKey("mintA"),
    exports.publicKey("mintB"),
    exports.publicKey("feeAccount"),
    BufferLayout.u8("curveType"),
    exports.uint64("tradeFeeNumerator"),
    exports.uint64("tradeFeeDenominator"),
    exports.uint64("ownerTradeFeeNumerator"),
    exports.uint64("ownerTradeFeeDenominator"),
    exports.uint64("ownerWithdrawFeeNumerator"),
    exports.uint64("ownerWithdrawFeeDenominator"),
    BufferLayout.blob(16, "padding"),
]);
var CURVE_NODE = BufferLayout.union(BufferLayout.u8(), BufferLayout.blob(32), "curve");
CURVE_NODE.addVariant(0, BufferLayout.struct([]), "constantProduct");
CURVE_NODE.addVariant(1, BufferLayout.struct([BufferLayout.nu64("token_b_price")]), "constantPrice");
CURVE_NODE.addVariant(2, BufferLayout.struct([]), "stable");
CURVE_NODE.addVariant(3, BufferLayout.struct([BufferLayout.nu64("token_b_offset")]), "offset");
exports.TokenSwapLayout = BufferLayout.struct([
    BufferLayout.u8("version"),
    BufferLayout.u8("isInitialized"),
    BufferLayout.u8("nonce"),
    exports.publicKey("tokenProgramId"),
    exports.publicKey("tokenAccountA"),
    exports.publicKey("tokenAccountB"),
    exports.publicKey("tokenPool"),
    exports.publicKey("mintA"),
    exports.publicKey("mintB"),
    exports.publicKey("feeAccount"),
    FEE_LAYOUT,
    CURVE_NODE,
]);

var createInitSwapInstruction = function (tokenSwapAccount, authority, tokenAccountA, tokenAccountB, tokenPool, feeAccount, destinationAccount, tokenProgramId, swapProgramId, nonce, config, isLatest) {
    var keys = [
        { pubkey: tokenSwapAccount.publicKey, isSigner: false, isWritable: true },
        { pubkey: authority, isSigner: false, isWritable: false },
        { pubkey: tokenAccountA, isSigner: false, isWritable: false },
        { pubkey: tokenAccountB, isSigner: false, isWritable: false },
        { pubkey: tokenPool, isSigner: false, isWritable: true },
        { pubkey: feeAccount, isSigner: false, isWritable: false },
        { pubkey: destinationAccount, isSigner: false, isWritable: true },
        { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    ];
    var data = Buffer.alloc(1024);
    if (isLatest) {
        var fields = [
            BufferLayout.u8("instruction"),
            BufferLayout.u8("nonce"),
            BufferLayout.nu64("tradeFeeNumerator"),
            BufferLayout.nu64("tradeFeeDenominator"),
            BufferLayout.nu64("ownerTradeFeeNumerator"),
            BufferLayout.nu64("ownerTradeFeeDenominator"),
            BufferLayout.nu64("ownerWithdrawFeeNumerator"),
            BufferLayout.nu64("ownerWithdrawFeeDenominator"),
            BufferLayout.nu64("hostFeeNumerator"),
            BufferLayout.nu64("hostFeeDenominator"),
            BufferLayout.u8("curveType"),
        ];
        if (config.curveType === pool_1.CurveType.ConstantProductWithOffset) {
            fields.push(BufferLayout.nu64("token_b_offset"));
            fields.push(BufferLayout.blob(24, "padding"));
        }
        else if (config.curveType === pool_1.CurveType.ConstantPrice) {
            fields.push(BufferLayout.nu64("token_b_price"));
            fields.push(BufferLayout.blob(24, "padding"));
        }
        else {
            fields.push(BufferLayout.blob(32, "padding"));
        }
        var commandDataLayout = BufferLayout.struct(fields);
        var fees = config.fees, rest = __rest(config, ["fees"]);
        var encodeLength = commandDataLayout.encode(__assign(__assign({ instruction: 0, // InitializeSwap instruction
            nonce: nonce }, fees), rest), data);
        data = data.slice(0, encodeLength);
    }
    else {
        var commandDataLayout = BufferLayout.struct([
            BufferLayout.u8("instruction"),
            BufferLayout.u8("nonce"),
            BufferLayout.u8("curveType"),
            BufferLayout.nu64("tradeFeeNumerator"),
            BufferLayout.nu64("tradeFeeDenominator"),
            BufferLayout.nu64("ownerTradeFeeNumerator"),
            BufferLayout.nu64("ownerTradeFeeDenominator"),
            BufferLayout.nu64("ownerWithdrawFeeNumerator"),
            BufferLayout.nu64("ownerWithdrawFeeDenominator"),
            BufferLayout.blob(16, "padding"),
        ]);
        var encodeLength = commandDataLayout.encode({
            instruction: 0,
            nonce: nonce,
            curveType: config.curveType,
            tradeFeeNumerator: config.fees.tradeFeeNumerator,
            tradeFeeDenominator: config.fees.tradeFeeDenominator,
            ownerTradeFeeNumerator: config.fees.ownerTradeFeeNumerator,
            ownerTradeFeeDenominator: config.fees.ownerTradeFeeDenominator,
            ownerWithdrawFeeNumerator: config.fees.ownerWithdrawFeeNumerator,
            ownerWithdrawFeeDenominator: config.fees.ownerWithdrawFeeDenominator
        }, data);
        data = data.slice(0, encodeLength);
    }
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: swapProgramId,
        data: data
    });
};
exports.createInitSwapInstruction = createInitSwapInstruction;
var depositInstruction = function (tokenSwap, authority, transferAuthority, sourceA, sourceB, intoA, intoB, poolToken, poolAccount, swapProgramId, tokenProgramId, poolTokenAmount, maximumTokenA, maximumTokenB, isLatest) {
    var dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        exports.uint64("poolTokenAmount"),
        exports.uint64("maximumTokenA"),
        exports.uint64("maximumTokenB"),
    ]);
    var data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 2,
        poolTokenAmount: new spl_token_swap_1.Numberu64(poolTokenAmount).toBuffer(),
        maximumTokenA: new spl_token_swap_1.Numberu64(maximumTokenA).toBuffer(),
        maximumTokenB: new spl_token_swap_1.Numberu64(maximumTokenB).toBuffer()
    }, data);
    var keys = isLatest
        ? [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: transferAuthority, isSigner: true, isWritable: false },
            { pubkey: sourceA, isSigner: false, isWritable: true },
            { pubkey: sourceB, isSigner: false, isWritable: true },
            { pubkey: intoA, isSigner: false, isWritable: true },
            { pubkey: intoB, isSigner: false, isWritable: true },
            { pubkey: poolToken, isSigner: false, isWritable: true },
            { pubkey: poolAccount, isSigner: false, isWritable: true },
            { pubkey: tokenProgramId, isSigner: false, isWritable: false },
        ]
        : [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: sourceA, isSigner: false, isWritable: true },
            { pubkey: sourceB, isSigner: false, isWritable: true },
            { pubkey: intoA, isSigner: false, isWritable: true },
            { pubkey: intoB, isSigner: false, isWritable: true },
            { pubkey: poolToken, isSigner: false, isWritable: true },
            { pubkey: poolAccount, isSigner: false, isWritable: true },
            { pubkey: tokenProgramId, isSigner: false, isWritable: false },
        ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: swapProgramId,
        data: data
    });
};
exports.depositInstruction = depositInstruction;
var depositExactOneInstruction = function (tokenSwap, authority, transferAuthority, source, intoA, intoB, poolToken, poolAccount, swapProgramId, tokenProgramId, sourceTokenAmount, minimumPoolTokenAmount, isLatest) {
    var dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        exports.uint64("sourceTokenAmount"),
        exports.uint64("minimumPoolTokenAmount"),
    ]);
    var data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 4,
        sourceTokenAmount: new spl_token_swap_1.Numberu64(sourceTokenAmount).toBuffer(),
        minimumPoolTokenAmount: new spl_token_swap_1.Numberu64(minimumPoolTokenAmount).toBuffer()
    }, data);
    var keys = isLatest
        ? [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: transferAuthority, isSigner: true, isWritable: false },
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: intoA, isSigner: false, isWritable: true },
            { pubkey: intoB, isSigner: false, isWritable: true },
            { pubkey: poolToken, isSigner: false, isWritable: true },
            { pubkey: poolAccount, isSigner: false, isWritable: true },
            { pubkey: tokenProgramId, isSigner: false, isWritable: false },
        ]
        : [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: intoA, isSigner: false, isWritable: true },
            { pubkey: intoB, isSigner: false, isWritable: true },
            { pubkey: poolToken, isSigner: false, isWritable: true },
            { pubkey: poolAccount, isSigner: false, isWritable: true },
            { pubkey: tokenProgramId, isSigner: false, isWritable: false },
        ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: swapProgramId,
        data: data
    });
};
exports.depositExactOneInstruction = depositExactOneInstruction;
var withdrawInstruction = function (tokenSwap, authority, transferAuthority, poolMint, feeAccount, sourcePoolAccount, fromA, fromB, userAccountA, userAccountB, swapProgramId, tokenProgramId, poolTokenAmount, minimumTokenA, minimumTokenB, isLatest) {
    var dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        exports.uint64("poolTokenAmount"),
        exports.uint64("minimumTokenA"),
        exports.uint64("minimumTokenB"),
    ]);
    var data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 3,
        poolTokenAmount: new spl_token_swap_1.Numberu64(poolTokenAmount).toBuffer(),
        minimumTokenA: new spl_token_swap_1.Numberu64(minimumTokenA).toBuffer(),
        minimumTokenB: new spl_token_swap_1.Numberu64(minimumTokenB).toBuffer()
    }, data);
    var keys = isLatest
        ? [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: transferAuthority, isSigner: true, isWritable: false },
            { pubkey: poolMint, isSigner: false, isWritable: true },
            { pubkey: sourcePoolAccount, isSigner: false, isWritable: true },
            { pubkey: fromA, isSigner: false, isWritable: true },
            { pubkey: fromB, isSigner: false, isWritable: true },
            { pubkey: userAccountA, isSigner: false, isWritable: true },
            { pubkey: userAccountB, isSigner: false, isWritable: true },
        ]
        : [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: poolMint, isSigner: false, isWritable: true },
            { pubkey: sourcePoolAccount, isSigner: false, isWritable: true },
            { pubkey: fromA, isSigner: false, isWritable: true },
            { pubkey: fromB, isSigner: false, isWritable: true },
            { pubkey: userAccountA, isSigner: false, isWritable: true },
            { pubkey: userAccountB, isSigner: false, isWritable: true },
        ];
    if (feeAccount) {
        keys.push({ pubkey: feeAccount, isSigner: false, isWritable: true });
    }
    keys.push({ pubkey: tokenProgramId, isSigner: false, isWritable: false });
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: swapProgramId,
        data: data
    });
};
exports.withdrawInstruction = withdrawInstruction;
var withdrawExactOneInstruction = function (tokenSwap, authority, transferAuthority, poolMint, sourcePoolAccount, fromA, fromB, userAccount, feeAccount, swapProgramId, tokenProgramId, sourceTokenAmount, maximumTokenAmount, isLatest) {
    var dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        exports.uint64("sourceTokenAmount"),
        exports.uint64("maximumTokenAmount"),
    ]);
    var data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 5,
        sourceTokenAmount: new spl_token_swap_1.Numberu64(sourceTokenAmount).toBuffer(),
        maximumTokenAmount: new spl_token_swap_1.Numberu64(maximumTokenAmount).toBuffer()
    }, data);
    var keys = isLatest
        ? [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: transferAuthority, isSigner: true, isWritable: false },
            { pubkey: poolMint, isSigner: false, isWritable: true },
            { pubkey: sourcePoolAccount, isSigner: false, isWritable: true },
            { pubkey: fromA, isSigner: false, isWritable: true },
            { pubkey: fromB, isSigner: false, isWritable: true },
            { pubkey: userAccount, isSigner: false, isWritable: true },
        ]
        : [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: poolMint, isSigner: false, isWritable: true },
            { pubkey: sourcePoolAccount, isSigner: false, isWritable: true },
            { pubkey: fromA, isSigner: false, isWritable: true },
            { pubkey: fromB, isSigner: false, isWritable: true },
            { pubkey: userAccount, isSigner: false, isWritable: true },
        ];
    if (feeAccount) {
        keys.push({ pubkey: feeAccount, isSigner: false, isWritable: true });
    }
    keys.push({ pubkey: tokenProgramId, isSigner: false, isWritable: false });
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: swapProgramId,
        data: data
    });
};
exports.withdrawExactOneInstruction = withdrawExactOneInstruction;
var swapInstruction = function (tokenSwap, authority, transferAuthority, userSource, poolSource, poolDestination, userDestination, poolMint, feeAccount, swapProgramId, tokenProgramId, amountIn, minimumAmountOut, programOwner, isLatest) {
    var dataLayout = BufferLayout.struct([
        BufferLayout.u8("instruction"),
        exports.uint64("amountIn"),
        exports.uint64("minimumAmountOut"),
    ]);
    var keys = isLatest
        ? [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: transferAuthority, isSigner: true, isWritable: false },
            { pubkey: userSource, isSigner: false, isWritable: true },
            { pubkey: poolSource, isSigner: false, isWritable: true },
            { pubkey: poolDestination, isSigner: false, isWritable: true },
            { pubkey: userDestination, isSigner: false, isWritable: true },
            { pubkey: poolMint, isSigner: false, isWritable: true },
            { pubkey: feeAccount, isSigner: false, isWritable: true },
            { pubkey: tokenProgramId, isSigner: false, isWritable: false },
        ]
        : [
            { pubkey: tokenSwap, isSigner: false, isWritable: false },
            { pubkey: authority, isSigner: false, isWritable: false },
            { pubkey: userSource, isSigner: false, isWritable: true },
            { pubkey: poolSource, isSigner: false, isWritable: true },
            { pubkey: poolDestination, isSigner: false, isWritable: true },
            { pubkey: userDestination, isSigner: false, isWritable: true },
            { pubkey: poolMint, isSigner: false, isWritable: true },
            { pubkey: feeAccount, isSigner: false, isWritable: true },
            { pubkey: tokenProgramId, isSigner: false, isWritable: false },
        ];
    // optional depending on the build of token-swap program
    if (programOwner) {
        keys.push({ pubkey: programOwner, isSigner: false, isWritable: true });
    }
    var data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 1,
        amountIn: new spl_token_swap_1.Numberu64(amountIn).toBuffer(),
        minimumAmountOut: new spl_token_swap_1.Numberu64(minimumAmountOut).toBuffer()
    }, data);
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: swapProgramId,
        data: data
    });
};
exports.swapInstruction = swapInstruction;


