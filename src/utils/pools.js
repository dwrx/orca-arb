"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.calculateDependentAmount = exports.PoolOperation = exports.useOwnedPools = exports.usePoolForBasket = exports.usePools = exports.addLiquidity = exports.swap = exports.removeExactOneLiquidity = exports.removeLiquidity = exports.isLatest = exports.SERUM_FEE = exports.LIQUIDITY_PROVIDER_FEE = void 0;
var web3_js_1 = require("@solana/web3.js");
var connection_1 = require("./connection");
var react_1 = require("react");
var spl_token_1 = require("@solana/spl-token");
var notifications_1 = require("./notifications");
var accounts_1 = require("./accounts");
var ids_1 = require("./ids");
var models_1 = require("./../models");
var LIQUIDITY_TOKEN_PRECISION = 8;
exports.LIQUIDITY_PROVIDER_FEE = 0.003;
exports.SERUM_FEE = 0.0005;
var isLatest = function (swap) {
    return swap.data.length === models_1.TokenSwapLayout.span;
};
exports.isLatest = isLatest;
var removeLiquidity = function (connection, wallet, liquidityAmount, account, pool) { return __awaiter(void 0, void 0, void 0, function () {
    var minAmount0, minAmount1, poolMint, accountA, accountB, authority, signers, instructions, cleanupInstructions, accountRentExempt, toAccounts, _a, isLatestSwap, transferAuthority, deleteAccount, tx;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!pool) {
                    throw new Error("Pool is required");
                }
                notifications_1.notify({
                    message: "Removing Liquidity...",
                    description: "Please review transactions to approve.",
                    type: "warn"
                });
                minAmount0 = 0;
                minAmount1 = 0;
                return [4 /*yield*/, accounts_1.cache.queryMint(connection, pool.pubkeys.mint)];
            case 1:
                poolMint = _b.sent();
                return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[0])];
            case 2:
                accountA = _b.sent();
                return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[1])];
            case 3:
                accountB = _b.sent();
                if (!poolMint.mintAuthority) {
                    throw new Error("Mint doesnt have authority");
                }
                authority = poolMint.mintAuthority;
                signers = [];
                instructions = [];
                cleanupInstructions = [];
                return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span)];
            case 4:
                accountRentExempt = _b.sent();
                return [4 /*yield*/, findOrCreateAccountByMint(wallet.publicKey, wallet.publicKey, instructions, cleanupInstructions, accountRentExempt, accountA.info.mint, signers)];
            case 5:
                _a = [
                    _b.sent()
                ];
                return [4 /*yield*/, findOrCreateAccountByMint(wallet.publicKey, wallet.publicKey, instructions, cleanupInstructions, accountRentExempt, accountB.info.mint, signers)];
            case 6:
                toAccounts = _a.concat([
                    _b.sent()
                ]);
                isLatestSwap = exports.isLatest(pool.raw.account);
                transferAuthority = approveAmount(instructions, cleanupInstructions, account.pubkey, wallet.publicKey, liquidityAmount, isLatestSwap ? undefined : authority);
                if (isLatestSwap) {
                    signers.push(transferAuthority);
                }
                // withdraw
                instructions.push(models_1.withdrawInstruction(pool.pubkeys.account, authority, transferAuthority.publicKey, pool.pubkeys.mint, pool.pubkeys.feeAccount, account.pubkey, pool.pubkeys.holdingAccounts[0], pool.pubkeys.holdingAccounts[1], toAccounts[0], toAccounts[1], pool.pubkeys.program, ids_1.programIds().token, liquidityAmount, minAmount0, minAmount1, isLatestSwap));
                deleteAccount = liquidityAmount === account.info.amount.toNumber();
                if (deleteAccount) {
                    instructions.push(spl_token_1.Token.createCloseAccountInstruction(ids_1.programIds().token, account.pubkey, authority, wallet.publicKey, []));
                }
                return [4 /*yield*/, connection_1.sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)];
            case 7:
                tx = _b.sent();
                if (deleteAccount) {
                    accounts_1.cache.deleteAccount(account.pubkey);
                }
                notifications_1.notify({
                    message: "Liquidity Returned. Thank you for your support.",
                    type: "success",
                    description: "Transaction - " + tx
                });
                return [2 /*return*/, [
                        accountA.info.mint.equals(ids_1.WRAPPED_SOL_MINT)
                            ? wallet.publicKey
                            : toAccounts[0],
                        accountB.info.mint.equals(ids_1.WRAPPED_SOL_MINT)
                            ? wallet.publicKey
                            : toAccounts[1],
                    ]];
        }
    });
}); };
exports.removeLiquidity = removeLiquidity;
var removeExactOneLiquidity = function (connection, wallet, account, liquidityAmount, tokenAmount, tokenMint, pool) { return __awaiter(void 0, void 0, void 0, function () {
    var liquidityMaxAmount, poolMint, accountA, accountB, tokenMatchAccount, authority, signers, instructions, cleanupInstructions, accountRentExempt, toAccount, isLatestSwap, transferAuthority, tx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!pool) {
                    throw new Error("Pool is required");
                }
                notifications_1.notify({
                    message: "Removing Liquidity...",
                    description: "Please review transactions to approve.",
                    type: "warn"
                });
                liquidityMaxAmount = liquidityAmount * (1 + SLIPPAGE);
                return [4 /*yield*/, accounts_1.cache.queryMint(connection, pool.pubkeys.mint)];
            case 1:
                poolMint = _a.sent();
                return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[0])];
            case 2:
                accountA = _a.sent();
                return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[1])];
            case 3:
                accountB = _a.sent();
                if (!poolMint.mintAuthority) {
                    throw new Error("Mint doesnt have authority");
                }
                tokenMatchAccount = tokenMint === pool.pubkeys.holdingMints[0].toBase58() ? accountA : accountB;
                authority = poolMint.mintAuthority;
                signers = [];
                instructions = [];
                cleanupInstructions = [];
                return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span)];
            case 4:
                accountRentExempt = _a.sent();
                return [4 /*yield*/, findOrCreateAccountByMint(wallet.publicKey, wallet.publicKey, instructions, cleanupInstructions, accountRentExempt, tokenMatchAccount.info.mint, signers)];
            case 5:
                toAccount = _a.sent();
                isLatestSwap = exports.isLatest(pool.raw.account);
                transferAuthority = approveAmount(instructions, cleanupInstructions, account.pubkey, wallet.publicKey, account.info.amount.toNumber(), // liquidityAmount <- need math tuning
                isLatestSwap ? undefined : authority);
                if (isLatestSwap) {
                    signers.push(transferAuthority);
                }
                // withdraw exact one
                instructions.push(models_1.withdrawExactOneInstruction(pool.pubkeys.account, authority, transferAuthority.publicKey, pool.pubkeys.mint, account.pubkey, pool.pubkeys.holdingAccounts[0], pool.pubkeys.holdingAccounts[1], toAccount, pool.pubkeys.feeAccount, pool.pubkeys.program, ids_1.programIds().token, tokenAmount, liquidityMaxAmount, isLatestSwap));
                return [4 /*yield*/, connection_1.sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)];
            case 6:
                tx = _a.sent();
                notifications_1.notify({
                    message: "Liquidity Returned. Thank you for your support.",
                    type: "success",
                    description: "Transaction - " + tx
                });
                return [2 /*return*/, tokenMatchAccount.info.mint.equals(ids_1.WRAPPED_SOL_MINT)
                        ? wallet.publicKey
                        : toAccount];
        }
    });
}); };
exports.removeExactOneLiquidity = removeExactOneLiquidity;
var swap = function (connection, wallet, components, SLIPPAGE, pool) { return __awaiter(void 0, void 0, void 0, function () {
    var amountIn, minAmountOut, holdingA, holdingB, poolMint, authority, instructions, cleanupInstructions, signers, accountRentExempt, fromAccount, toAccount, isLatestSwap, transferAuthority, hostFeeAccount, tx;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!pool || !components[0].account) {
                    notifications_1.notify({
                        type: "error",
                        message: "Pool doesn't exsist.",
                        description: "Swap trade cancelled"
                    });
                    return [2 /*return*/];
                }
                amountIn = components[0].amount;
                minAmountOut = components[1].amount * (1 - SLIPPAGE);
                holdingA = ((_a = pool.pubkeys.holdingMints[0]) === null || _a === void 0 ? void 0 : _a.toBase58()) ===
                    components[0].account.info.mint.toBase58()
                    ? pool.pubkeys.holdingAccounts[0]
                    : pool.pubkeys.holdingAccounts[1];
                holdingB = holdingA === pool.pubkeys.holdingAccounts[0]
                    ? pool.pubkeys.holdingAccounts[1]
                    : pool.pubkeys.holdingAccounts[0];
                return [4 /*yield*/, accounts_1.cache.queryMint(connection, pool.pubkeys.mint)];
            case 1:
                poolMint = _b.sent();
                if (!poolMint.mintAuthority || !pool.pubkeys.feeAccount) {
                    throw new Error("Mint doesnt have authority");
                }
                authority = poolMint.mintAuthority;
                instructions = [];
                cleanupInstructions = [];
                signers = [];
                return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span)];
            case 2:
                accountRentExempt = _b.sent();
                fromAccount = getWrappedAccount(instructions, cleanupInstructions, components[0].account, wallet.publicKey, amountIn + accountRentExempt, signers);
                toAccount = findOrCreateAccountByMint(wallet.publicKey, wallet.publicKey, instructions, cleanupInstructions, accountRentExempt, new web3_js_1.PublicKey(components[1].mintAddress), signers);
                isLatestSwap = exports.isLatest(pool.raw.account);
                transferAuthority = approveAmount(instructions, cleanupInstructions, fromAccount, wallet.publicKey, amountIn, isLatestSwap ? undefined : authority);
                if (isLatestSwap) {
                    signers.push(transferAuthority);
                }
                hostFeeAccount = ids_1.SWAP_HOST_FEE_ADDRESS
                    ? findOrCreateAccountByMint(wallet.publicKey, ids_1.SWAP_HOST_FEE_ADDRESS, instructions, cleanupInstructions, accountRentExempt, pool.pubkeys.mint, signers)
                    : undefined;
                // swap
                instructions.push(models_1.swapInstruction(pool.pubkeys.account, authority, transferAuthority.publicKey, fromAccount, holdingA, holdingB, toAccount, pool.pubkeys.mint, pool.pubkeys.feeAccount, pool.pubkeys.program, ids_1.programIds().token, amountIn, minAmountOut, hostFeeAccount, isLatestSwap));
                return [4 /*yield*/, connection_1.sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)];
            case 3:
                tx = _b.sent();
                notifications_1.notify({
                    message: "Trade executed.",
                    type: "success",
                    description: "Transaction - " + tx
                });
                return [2 /*return*/];
        }
    });
}); };
exports.swap = swap;
var addLiquidity = function (connection, wallet, components, slippage, pool, options, depositType) {
    if (depositType === void 0) { depositType = "both"; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(depositType === "one" && pool)) return [3 /*break*/, 2];
                    return [4 /*yield*/, _addLiquidityExactOneExistingPool(pool, components[0], connection, wallet)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    if (!!pool) return [3 /*break*/, 4];
                    if (!options) {
                        throw new Error("Options are required to create new pool.");
                    }
                    return [4 /*yield*/, _addLiquidityNewPool(wallet, connection, components, options)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, _addLiquidityExistingPool(pool, components, connection, wallet)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.addLiquidity = addLiquidity;
var getHoldings = function (connection, accounts) {
    return accounts.map(function (acc) {
        return accounts_1.cache.queryAccount(connection, new web3_js_1.PublicKey(acc));
    });
};
var toPoolInfo = function (item, program) {
    var mint = new web3_js_1.PublicKey(item.data.tokenPool);
    return {
        pubkeys: {
            account: item.pubkey,
            program: program,
            mint: mint,
            holdingMints: [],
            holdingAccounts: [item.data.tokenAccountA, item.data.tokenAccountB].map(function (a) { return new web3_js_1.PublicKey(a); })
        },
        legacy: false,
        raw: item
    };
};
var usePools = function () {
    var connection = connection_1.useConnection();
    var _a = react_1.useState([]), pools = _a[0], setPools = _a[1];
    // initial query
    react_1.useEffect(function () {
        setPools([]);
        var queryPools = function (swapId, isLegacy) {
            if (isLegacy === void 0) { isLegacy = false; }
            return __awaiter(void 0, void 0, void 0, function () {
                var poolsArray, toQuery;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            poolsArray = [];
                            return [4 /*yield*/, connection.getProgramAccounts(swapId)];
                        case 1:
                            (_a.sent())
                                .filter(function (item) {
                                return item.account.data.length === models_1.TokenSwapLayout.span ||
                                    item.account.data.length === models_1.TokenSwapLayoutV1.span ||
                                    item.account.data.length === models_1.TokenSwapLayoutLegacyV0.span;
                            })
                                .map(function (item) {
                                var result = {
                                    data: undefined,
                                    account: item.account,
                                    pubkey: item.pubkey,
                                    init: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/];
                                    }); }); }
                                };
                                var layout = item.account.data.length === models_1.TokenSwapLayout.span
                                    ? models_1.TokenSwapLayout
                                    : item.account.data.length === models_1.TokenSwapLayoutV1.span
                                        ? models_1.TokenSwapLayoutV1
                                        : models_1.TokenSwapLayoutLegacyV0;
                                // handling of legacy layout can be removed soon...
                                if (layout === models_1.TokenSwapLayoutLegacyV0) {
                                    result.data = layout.decode(item.account.data);
                                    var pool_1 = toPoolInfo(result, swapId);
                                    pool_1.legacy = isLegacy;
                                    poolsArray.push(pool_1);
                                    result.init = function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var holdings, err_1;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 2, , 3]);
                                                    return [4 /*yield*/, Promise.all(getHoldings(connection, [
                                                            result.data.tokenAccountA,
                                                            result.data.tokenAccountB,
                                                        ]))];
                                                case 1:
                                                    holdings = _a.sent();
                                                    pool_1.pubkeys.holdingMints = [
                                                        holdings[0].info.mint,
                                                        holdings[1].info.mint,
                                                    ];
                                                    return [3 /*break*/, 3];
                                                case 2:
                                                    err_1 = _a.sent();
                                                    console.log(err_1);
                                                    return [3 /*break*/, 3];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                }
                                else {
                                    result.data = layout.decode(item.account.data);
                                    var pool = toPoolInfo(result, swapId);
                                    pool.legacy = isLegacy;
                                    pool.pubkeys.feeAccount = new web3_js_1.PublicKey(result.data.feeAccount);
                                    pool.pubkeys.holdingMints = [
                                        new web3_js_1.PublicKey(result.data.mintA),
                                        new web3_js_1.PublicKey(result.data.mintB),
                                    ];
                                    poolsArray.push(pool);
                                }
                                return result;
                            });
                            toQuery = __spreadArray([], poolsArray
                                .map(function (p) {
                                var _a;
                                return __spreadArray(__spreadArray(__spreadArray([], p.pubkeys.holdingAccounts.map(function (h) { return h.toBase58(); })), p.pubkeys.holdingMints.map(function (h) { return h.toBase58(); })), [
                                    (_a = p.pubkeys.feeAccount) === null || _a === void 0 ? void 0 : _a.toBase58(),
                                    p.pubkeys.mint.toBase58(),
                                ]).filter(function (p) { return p; });
                            })
                                .flat()
                                .filter(function (acc) { return accounts_1.cache.get(acc) === undefined; })
                                .reduce(function (acc, item) {
                                acc.add(item);
                                return acc;
                            }, new Set())
                                .keys()).sort();
                            // This will pre-cache all accounts used by pools
                            // All those accounts are updated whenever there is a change
                            return [4 /*yield*/, accounts_1.getMultipleAccounts(connection, toQuery, "single").then(function (_a) {
                                    var keys = _a.keys, array = _a.array;
                                    return array.map(function (obj, index) {
                                        if (!obj) {
                                            return undefined;
                                        }
                                        var pubKey = new web3_js_1.PublicKey(keys[index]);
                                        if (obj.data.length === spl_token_1.AccountLayout.span) {
                                            return accounts_1.cache.addAccount(pubKey, obj);
                                        }
                                        else if (obj.data.length === spl_token_1.MintLayout.span) {
                                            if (!accounts_1.cache.getMint(pubKey)) {
                                                return accounts_1.cache.addMint(pubKey, obj);
                                            }
                                        }
                                        return obj;
                                    }).filter(function (a) { return !!a; });
                                })];
                        case 2:
                            // This will pre-cache all accounts used by pools
                            // All those accounts are updated whenever there is a change
                            _a.sent();
                            return [2 /*return*/, poolsArray];
                    }
                });
            });
        };
        Promise.all(__spreadArray([
            queryPools(ids_1.programIds().swap)
        ], ids_1.programIds().swap_legacy.map(function (leg) { return queryPools(leg, true); }))).then(function (all) {
            setPools(all.flat());
        });
    }, [connection]);
    react_1.useEffect(function () {
        var subID = connection.onProgramAccountChange(ids_1.programIds().swap, function (info) { return __awaiter(void 0, void 0, void 0, function () {
            var id, account, updated, index_1, filtered, pool;
            return __generator(this, function (_a) {
                id = info.accountId;
                if (info.accountInfo.data.length === ids_1.programIds().swapLayout.span) {
                    account = info.accountInfo;
                    updated = {
                        data: ids_1.programIds().swapLayout.decode(account.data),
                        account: account,
                        pubkey: new web3_js_1.PublicKey(id)
                    };
                    index_1 = pools &&
                        pools.findIndex(function (p) { return p.pubkeys.account.toBase58() === id; });
                    if (index_1 && index_1 >= 0 && pools) {
                        filtered = pools.filter(function (p, i) { return i !== index_1; });
                        setPools(__spreadArray(__spreadArray([], filtered), [toPoolInfo(updated, ids_1.programIds().swap)]));
                    }
                    else {
                        pool = toPoolInfo(updated, ids_1.programIds().swap);
                        pool.pubkeys.feeAccount = new web3_js_1.PublicKey(updated.data.feeAccount);
                        pool.pubkeys.holdingMints = [
                            new web3_js_1.PublicKey(updated.data.mintA),
                            new web3_js_1.PublicKey(updated.data.mintB),
                        ];
                        setPools(__spreadArray(__spreadArray([], pools), [pool]));
                    }
                }
                return [2 /*return*/];
            });
        }); }, "singleGossip");
        return function () {
            connection.removeProgramAccountChangeListener(subID);
        };
    }, [connection, pools]);
    return { pools: pools };
};
exports.usePools = usePools;
var usePoolForBasket = function (mints) {
    var connection = connection_1.useConnection();
    var pools = accounts_1.useCachedPool().pools;
    var _a = react_1.useState(), pool = _a[0], setPool = _a[1];
    var sortedMints = react_1.useMemo(function () { return __spreadArray([], mints).sort(); }, __spreadArray([], mints)); // eslint-disable-line
    react_1.useEffect(function () {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var matchingPool, poolQuantities, i, p, _a, account0, account1, amount, sorted, bestPool;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // reset pool during query
                        setPool(undefined);
                        matchingPool = pools
                            .filter(function (p) { return !p.legacy; })
                            .filter(function (p) {
                            return p.pubkeys.holdingMints
                                .map(function (a) { return a.toBase58(); })
                                .sort()
                                .every(function (address, i) { return address === sortedMints[i]; });
                        });
                        poolQuantities = {};
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < matchingPool.length)) return [3 /*break*/, 4];
                        p = matchingPool[i];
                        return [4 /*yield*/, Promise.all([
                                accounts_1.cache.queryAccount(connection, p.pubkeys.holdingAccounts[0]),
                                accounts_1.cache.queryAccount(connection, p.pubkeys.holdingAccounts[1]),
                            ])];
                    case 2:
                        _a = _b.sent(), account0 = _a[0], account1 = _a[1];
                        amount = (account0.info.amount.toNumber() || 0) +
                            (account1.info.amount.toNumber() || 0);
                        if (amount > 0) {
                            poolQuantities[i.toString()] = amount;
                        }
                        _b.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (Object.keys(poolQuantities).length > 0) {
                            sorted = Object.entries(poolQuantities).sort(function (_a, _b) {
                                var pool0Idx = _a[0], amount0 = _a[1];
                                var pool1Idx = _b[0], amount1 = _b[1];
                                return amount0 > amount1 ? -1 : 1;
                            });
                            bestPool = matchingPool[parseInt(sorted[0][0])];
                            setPool(bestPool);
                            return [2 /*return*/];
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [connection, sortedMints, pools]);
    return pool;
};
exports.usePoolForBasket = usePoolForBasket;
var useOwnedPools = function (legacy) {
    if (legacy === void 0) { legacy = false; }
    var pools = accounts_1.useCachedPool(legacy).pools;
    var userAccounts = accounts_1.useUserAccounts().userAccounts;
    var ownedPools = react_1.useMemo(function () {
        var map = userAccounts.reduce(function (acc, item) {
            var key = item.info.mint.toBase58();
            acc.set(key, __spreadArray(__spreadArray([], (acc.get(key) || [])), [item]));
            return acc;
        }, new Map());
        return pools
            .filter(function (p) { return map.has(p.pubkeys.mint.toBase58()) && p.legacy === legacy; })
            .map(function (item) {
            var _a, _b;
            var feeAccount = (_a = item.pubkeys.feeAccount) === null || _a === void 0 ? void 0 : _a.toBase58();
            return (_b = map.get(item.pubkeys.mint.toBase58())) === null || _b === void 0 ? void 0 : _b.map(function (a) {
                return {
                    account: a,
                    isFeeAccount: feeAccount === a.pubkey.toBase58(),
                    pool: item
                };
            });
        })
            .flat();
    }, [pools, userAccounts, legacy]);
    return ownedPools;
};
exports.useOwnedPools = useOwnedPools;
// Allow for this much price movement in the pool before adding liquidity to the pool aborts
var SLIPPAGE = 0.005;
function _addLiquidityExistingPool(pool, components, connection, wallet) {
    return __awaiter(this, void 0, void 0, function () {
        var poolMint, accountA, accountB, reserve0, reserve1, fromA, fromB, supply, authority, amount0, amount1, liquidity, instructions, cleanupInstructions, signers, accountRentExempt, fromKeyA, fromKeyB, toAccount, isLatestSwap, transferAuthority, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notifications_1.notify({
                        message: "Adding Liquidity...",
                        description: "Please review transactions to approve.",
                        type: "warn"
                    });
                    return [4 /*yield*/, accounts_1.cache.queryMint(connection, pool.pubkeys.mint)];
                case 1:
                    poolMint = _a.sent();
                    if (!poolMint.mintAuthority) {
                        throw new Error("Mint doesnt have authority");
                    }
                    if (!pool.pubkeys.feeAccount) {
                        throw new Error("Invald fee account");
                    }
                    return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[0])];
                case 2:
                    accountA = _a.sent();
                    return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[1])];
                case 3:
                    accountB = _a.sent();
                    reserve0 = accountA.info.amount.toNumber();
                    reserve1 = accountB.info.amount.toNumber();
                    fromA = accountA.info.mint.toBase58() === components[0].mintAddress
                        ? components[0]
                        : components[1];
                    fromB = fromA === components[0] ? components[1] : components[0];
                    if (!fromA.account || !fromB.account) {
                        throw new Error("Missing account info.");
                    }
                    supply = poolMint.supply.toNumber();
                    authority = poolMint.mintAuthority;
                    amount0 = fromA.amount;
                    amount1 = fromB.amount;
                    liquidity = Math.min((amount0 * (1 - SLIPPAGE) * supply) / reserve0, (amount1 * (1 - SLIPPAGE) * supply) / reserve1);
                    instructions = [];
                    cleanupInstructions = [];
                    signers = [];
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span)];
                case 4:
                    accountRentExempt = _a.sent();
                    fromKeyA = getWrappedAccount(instructions, cleanupInstructions, fromA.account, wallet.publicKey, amount0 + accountRentExempt, signers);
                    fromKeyB = getWrappedAccount(instructions, cleanupInstructions, fromB.account, wallet.publicKey, amount1 + accountRentExempt, signers);
                    toAccount = findOrCreateAccountByMint(wallet.publicKey, wallet.publicKey, instructions, [], accountRentExempt, pool.pubkeys.mint, signers, new Set([pool.pubkeys.feeAccount.toBase58()]));
                    isLatestSwap = exports.isLatest(pool.raw.account);
                    transferAuthority = approveAmount(instructions, cleanupInstructions, fromKeyA, wallet.publicKey, amount0, isLatestSwap ? undefined : authority);
                    if (isLatestSwap) {
                        signers.push(transferAuthority);
                    }
                    approveAmount(instructions, cleanupInstructions, fromKeyB, wallet.publicKey, amount1, isLatestSwap ? transferAuthority.publicKey : authority);
                    // deposit
                    instructions.push(models_1.depositInstruction(pool.pubkeys.account, authority, transferAuthority.publicKey, fromKeyA, fromKeyB, pool.pubkeys.holdingAccounts[0], pool.pubkeys.holdingAccounts[1], pool.pubkeys.mint, toAccount, pool.pubkeys.program, ids_1.programIds().token, liquidity, amount0, amount1, isLatestSwap));
                    return [4 /*yield*/, connection_1.sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)];
                case 5:
                    tx = _a.sent();
                    notifications_1.notify({
                        message: "Pool Funded. Happy trading.",
                        type: "success",
                        description: "Transaction - " + tx
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function _addLiquidityExactOneExistingPool(pool, component, connection, wallet) {
    return __awaiter(this, void 0, void 0, function () {
        var poolMint, accountA, accountB, from, reserve, supply, authority, amount, _liquidityTokenTempMath, liquidityToken, instructions, cleanupInstructions, signers, accountRentExempt, fromKey, toAccount, isLatestSwap, transferAuthority, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notifications_1.notify({
                        message: "Adding Liquidity...",
                        description: "Please review transactions to approve.",
                        type: "warn"
                    });
                    return [4 /*yield*/, accounts_1.cache.queryMint(connection, pool.pubkeys.mint)];
                case 1:
                    poolMint = _a.sent();
                    if (!poolMint.mintAuthority) {
                        throw new Error("Mint doesnt have authority");
                    }
                    if (!pool.pubkeys.feeAccount) {
                        throw new Error("Invald fee account");
                    }
                    return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[0])];
                case 2:
                    accountA = _a.sent();
                    return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[1])];
                case 3:
                    accountB = _a.sent();
                    from = component;
                    if (!from.account) {
                        throw new Error("Missing account info.");
                    }
                    reserve = accountA.info.mint.toBase58() === from.mintAddress
                        ? accountA.info.amount.toNumber()
                        : accountB.info.amount.toNumber();
                    supply = poolMint.supply.toNumber();
                    authority = poolMint.mintAuthority;
                    amount = from.amount;
                    _liquidityTokenTempMath = (amount * (1 - SLIPPAGE) * supply) / reserve;
                    liquidityToken = 0;
                    instructions = [];
                    cleanupInstructions = [];
                    signers = [];
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span)];
                case 4:
                    accountRentExempt = _a.sent();
                    fromKey = getWrappedAccount(instructions, cleanupInstructions, from.account, wallet.publicKey, amount + accountRentExempt, signers);
                    toAccount = findOrCreateAccountByMint(wallet.publicKey, wallet.publicKey, instructions, [], accountRentExempt, pool.pubkeys.mint, signers, new Set([pool.pubkeys.feeAccount.toBase58()]));
                    isLatestSwap = exports.isLatest(pool.raw.account);
                    transferAuthority = approveAmount(instructions, cleanupInstructions, fromKey, wallet.publicKey, amount, isLatestSwap ? undefined : authority);
                    if (isLatestSwap) {
                        signers.push(transferAuthority);
                    }
                    // deposit
                    instructions.push(models_1.depositExactOneInstruction(pool.pubkeys.account, authority, transferAuthority.publicKey, fromKey, pool.pubkeys.holdingAccounts[0], pool.pubkeys.holdingAccounts[1], pool.pubkeys.mint, toAccount, pool.pubkeys.program, ids_1.programIds().token, amount, liquidityToken, isLatestSwap));
                    return [4 /*yield*/, connection_1.sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), signers)];
                case 5:
                    tx = _a.sent();
                    notifications_1.notify({
                        message: "Pool Funded. Happy trading.",
                        type: "success",
                        description: "Transaction - " + tx
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function findOrCreateAccountByMint(payer, owner, instructions, cleanupInstructions, accountRentExempt, mint, // use to identify same type
signers, excluded) {
    var accountToFind = mint.toBase58();
    var account = accounts_1.getCachedAccount(function (acc) {
        return acc.info.mint.toBase58() === accountToFind &&
            acc.info.owner.toBase58() === owner.toBase58() &&
            (excluded === undefined || !excluded.has(acc.pubkey.toBase58()));
    });
    var isWrappedSol = accountToFind === ids_1.WRAPPED_SOL_MINT.toBase58();
    var toAccount;
    if (account && !isWrappedSol) {
        toAccount = account.pubkey;
    }
    else {
        // creating depositor pool account
        var newToAccount = createSplAccount(instructions, payer, accountRentExempt, mint, owner, spl_token_1.AccountLayout.span);
        toAccount = newToAccount.publicKey;
        signers.push(newToAccount);
        if (isWrappedSol) {
            cleanupInstructions.push(spl_token_1.Token.createCloseAccountInstruction(ids_1.programIds().token, toAccount, payer, payer, []));
        }
    }
    return toAccount;
}
function estimateProceedsFromInput(inputQuantityInPool, proceedsQuantityInPool, inputAmount) {
    return ((proceedsQuantityInPool * inputAmount) / (inputQuantityInPool + inputAmount));
}
function estimateInputFromProceeds(inputQuantityInPool, proceedsQuantityInPool, proceedsAmount) {
    if (proceedsAmount >= proceedsQuantityInPool) {
        return "Not possible";
    }
    return ((inputQuantityInPool * proceedsAmount) /
        (proceedsQuantityInPool - proceedsAmount));
}
var PoolOperation;
(function (PoolOperation) {
    PoolOperation[PoolOperation["Add"] = 0] = "Add";
    PoolOperation[PoolOperation["SwapGivenInput"] = 1] = "SwapGivenInput";
    PoolOperation[PoolOperation["SwapGivenProceeds"] = 2] = "SwapGivenProceeds";
})(PoolOperation = exports.PoolOperation || (exports.PoolOperation = {}));
function calculateDependentAmount(connection, independent, amount, pool, op) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function () {
        var poolMint, accountA, amountA, accountB, amountB, offsetAmount, offsetCurve, mintA, mintB, isFirstIndependent, depPrecision, indPrecision, indAdjustedAmount, indBasketQuantity, depBasketQuantity, depAdjustedAmount, constantPrice;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, accounts_1.cache.queryMint(connection, pool.pubkeys.mint)];
                case 1:
                    poolMint = _g.sent();
                    return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[0])];
                case 2:
                    accountA = _g.sent();
                    amountA = accountA.info.amount.toNumber();
                    return [4 /*yield*/, accounts_1.cache.queryAccount(connection, pool.pubkeys.holdingAccounts[1])];
                case 3:
                    accountB = _g.sent();
                    amountB = accountB.info.amount.toNumber();
                    if (!poolMint.mintAuthority) {
                        throw new Error("Mint doesnt have authority");
                    }
                    if (poolMint.supply.eqn(0)) {
                        return [2 /*return*/];
                    }
                    offsetAmount = 0;
                    offsetCurve = (_c = (_b = (_a = pool.raw) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.curve) === null || _c === void 0 ? void 0 : _c.offset;
                    if (offsetCurve) {
                        offsetAmount = offsetCurve.token_b_offset;
                        amountB = amountB + offsetAmount;
                    }
                    return [4 /*yield*/, accounts_1.cache.queryMint(connection, accountA.info.mint)];
                case 4:
                    mintA = _g.sent();
                    return [4 /*yield*/, accounts_1.cache.queryMint(connection, accountB.info.mint)];
                case 5:
                    mintB = _g.sent();
                    if (!mintA || !mintB) {
                        return [2 /*return*/];
                    }
                    isFirstIndependent = accountA.info.mint.toBase58() === independent;
                    depPrecision = Math.pow(10, isFirstIndependent ? mintB.decimals : mintA.decimals);
                    indPrecision = Math.pow(10, isFirstIndependent ? mintA.decimals : mintB.decimals);
                    indAdjustedAmount = amount * indPrecision;
                    indBasketQuantity = isFirstIndependent ? amountA : amountB;
                    depBasketQuantity = isFirstIndependent ? amountB : amountA;
                    constantPrice = (_f = (_e = (_d = pool.raw) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.curve) === null || _f === void 0 ? void 0 : _f.constantPrice;
                    if (constantPrice) {
                        if (isFirstIndependent) {
                            depAdjustedAmount = (amount * depPrecision) / constantPrice.token_b_price;
                        }
                        else {
                            depAdjustedAmount = (amount * depPrecision) * constantPrice.token_b_price;
                        }
                    }
                    else {
                        switch (+op) {
                            case PoolOperation.Add:
                                depAdjustedAmount =
                                    (depBasketQuantity / indBasketQuantity) * indAdjustedAmount;
                                break;
                            case PoolOperation.SwapGivenProceeds:
                                depAdjustedAmount = estimateInputFromProceeds(depBasketQuantity, indBasketQuantity, indAdjustedAmount);
                                break;
                            case PoolOperation.SwapGivenInput:
                                depAdjustedAmount = estimateProceedsFromInput(indBasketQuantity, depBasketQuantity, indAdjustedAmount);
                                break;
                        }
                    }
                    if (typeof depAdjustedAmount === "string") {
                        return [2 /*return*/, depAdjustedAmount];
                    }
                    if (depAdjustedAmount === undefined) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, depAdjustedAmount / depPrecision];
            }
        });
    });
}
exports.calculateDependentAmount = calculateDependentAmount;
// TODO: add ui to customize curve type
function _addLiquidityNewPool(wallet, connection, components, options) {
    return __awaiter(this, void 0, void 0, function () {
        var instructions, cleanupInstructions, liquidityTokenMint, _a, _b, _c, _d, tokenSwapAccount, _e, authority, nonce, accountRentExempt, holdingAccounts, signers, depositorAccount, feeAccount, tx, _f, _g, _h, _j;
        var _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    notifications_1.notify({
                        message: "Creating new pool...",
                        description: "Please review transactions to approve.",
                        type: "warn"
                    });
                    if (components.some(function (c) { return !c.account; })) {
                        notifications_1.notify({
                            message: "You need to have balance for all legs in the basket...",
                            description: "Please review inputs.",
                            type: "error"
                        });
                        return [2 /*return*/];
                    }
                    instructions = [];
                    cleanupInstructions = [];
                    liquidityTokenMint = new web3_js_1.Account();
                    // Create account for pool liquidity token
                    _b = (_a = instructions).push;
                    _d = (_c = web3_js_1.SystemProgram).createAccount;
                    _k = {
                        fromPubkey: wallet.publicKey,
                        newAccountPubkey: liquidityTokenMint.publicKey
                    };
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.MintLayout.span)];
                case 1:
                    // Create account for pool liquidity token
                    _b.apply(_a, [_d.apply(_c, [(_k.lamports = _m.sent(),
                                _k.space = spl_token_1.MintLayout.span,
                                _k.programId = ids_1.programIds().token,
                                _k)])]);
                    tokenSwapAccount = new web3_js_1.Account();
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([tokenSwapAccount.publicKey.toBuffer()], ids_1.programIds().swap)];
                case 2:
                    _e = _m.sent(), authority = _e[0], nonce = _e[1];
                    // create mint for pool liquidity token
                    instructions.push(spl_token_1.Token.createInitMintInstruction(ids_1.programIds().token, liquidityTokenMint.publicKey, LIQUIDITY_TOKEN_PRECISION, 
                    // pass control of liquidity mint to swap program
                    authority, 
                    // swap program can freeze liquidity token mint
                    null));
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span)];
                case 3:
                    accountRentExempt = _m.sent();
                    holdingAccounts = [];
                    signers = [];
                    components.forEach(function (leg) {
                        if (!leg.account) {
                            return;
                        }
                        var mintPublicKey = leg.account.info.mint;
                        // component account to store tokens I of N in liquidity poll
                        holdingAccounts.push(createSplAccount(instructions, wallet.publicKey, accountRentExempt, mintPublicKey, authority, spl_token_1.AccountLayout.span));
                    });
                    depositorAccount = createSplAccount(instructions, wallet.publicKey, accountRentExempt, liquidityTokenMint.publicKey, wallet.publicKey, spl_token_1.AccountLayout.span);
                    feeAccount = createSplAccount(instructions, wallet.publicKey, accountRentExempt, liquidityTokenMint.publicKey, ids_1.SWAP_PROGRAM_OWNER_FEE_ADDRESS || wallet.publicKey, spl_token_1.AccountLayout.span);
                    return [4 /*yield*/, connection_1.sendTransaction(connection, wallet, instructions, __spreadArray(__spreadArray([
                            liquidityTokenMint,
                            depositorAccount,
                            feeAccount
                        ], holdingAccounts), signers))];
                case 4:
                    tx = _m.sent();
                    notifications_1.notify({
                        message: "Accounts created",
                        description: "Transaction " + tx,
                        type: "success"
                    });
                    notifications_1.notify({
                        message: "Adding Liquidity...",
                        description: "Please review transactions to approve.",
                        type: "warn"
                    });
                    signers = [];
                    instructions = [];
                    cleanupInstructions = [];
                    _g = (_f = instructions).push;
                    _j = (_h = web3_js_1.SystemProgram).createAccount;
                    _l = {
                        fromPubkey: wallet.publicKey,
                        newAccountPubkey: tokenSwapAccount.publicKey
                    };
                    return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(ids_1.programIds().swapLayout.span)];
                case 5:
                    _g.apply(_f, [_j.apply(_h, [(_l.lamports = _m.sent(),
                                _l.space = ids_1.programIds().swapLayout.span,
                                _l.programId = ids_1.programIds().swap,
                                _l)])]);
                    components.forEach(function (leg, i) {
                        if (!leg.account) {
                            return;
                        }
                        // create temporary account for wrapped sol to perform transfer
                        var from = getWrappedAccount(instructions, cleanupInstructions, leg.account, wallet.publicKey, leg.amount + accountRentExempt, signers);
                        instructions.push(spl_token_1.Token.createTransferInstruction(ids_1.programIds().token, from, holdingAccounts[i].publicKey, wallet.publicKey, [], leg.amount));
                    });
                    instructions.push(models_1.createInitSwapInstruction(tokenSwapAccount, authority, holdingAccounts[0].publicKey, holdingAccounts[1].publicKey, liquidityTokenMint.publicKey, feeAccount.publicKey, depositorAccount.publicKey, ids_1.programIds().token, ids_1.programIds().swap, nonce, options, ids_1.programIds().swapLayout === models_1.TokenSwapLayout));
                    return [4 /*yield*/, connection_1.sendTransaction(connection, wallet, instructions.concat(cleanupInstructions), __spreadArray([tokenSwapAccount], signers))];
                case 6:
                    // All instructions didn't fit in single transaction
                    // initialize and provide inital liquidity to swap in 2nd (this prevents loss of funds)
                    tx = _m.sent();
                    notifications_1.notify({
                        message: "Pool Funded. Happy trading.",
                        type: "success",
                        description: "Transaction - " + tx
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function approveAmount(instructions, cleanupInstructions, account, owner, amount, 
// if delegate is not passed ephemeral transfer authority is used
delegate) {
    var tokenProgram = ids_1.programIds().token;
    var transferAuthority = new web3_js_1.Account();
    instructions.push(spl_token_1.Token.createApproveInstruction(tokenProgram, account, delegate !== null && delegate !== void 0 ? delegate : transferAuthority.publicKey, owner, [], amount));
    cleanupInstructions.push(spl_token_1.Token.createRevokeInstruction(tokenProgram, account, owner, []));
    return transferAuthority;
}
function getWrappedAccount(instructions, cleanupInstructions, toCheck, payer, amount, signers) {
    if (!toCheck.info.isNative) {
        return toCheck.pubkey;
    }
    var account = new web3_js_1.Account();
    instructions.push(web3_js_1.SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: account.publicKey,
        lamports: amount,
        space: spl_token_1.AccountLayout.span,
        programId: ids_1.programIds().token
    }));
    instructions.push(spl_token_1.Token.createInitAccountInstruction(ids_1.programIds().token, ids_1.WRAPPED_SOL_MINT, account.publicKey, payer));
    cleanupInstructions.push(spl_token_1.Token.createCloseAccountInstruction(ids_1.programIds().token, account.publicKey, payer, payer, []));
    signers.push(account);
    return account.publicKey;
}
function createSplAccount(instructions, payer, accountRentExempt, mint, owner, space) {
    var account = new web3_js_1.Account();
    instructions.push(web3_js_1.SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: account.publicKey,
        lamports: accountRentExempt,
        space: space,
        programId: ids_1.programIds().token
    }));
    instructions.push(spl_token_1.Token.createInitAccountInstruction(ids_1.programIds().token, mint, account.publicKey, owner));
    return account;
}
