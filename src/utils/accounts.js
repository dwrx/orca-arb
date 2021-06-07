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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.useAccountByMint = exports.useSelectedAccount = exports.useCachedPool = exports.useAccount = exports.useUserAccounts = exports.useMint = exports.getMultipleAccounts = exports.useNativeAccount = exports.AccountsProvider = exports.getCachedAccount = exports.cache = exports.keyToAccountParser = exports.GenericAccountParser = exports.TokenAccountParser = exports.MintParser = void 0;
var react_1 = require("react");
// var connection_1 = require("./connection");
// var wallet_1 = require("../context/wallet");
var web3_js_1 = require("@solana/web3.js");
var ids_1 = require("./ids");
var spl_token_1 = require("@solana/spl-token");
var pools_1 = require("./pools");
// var notifications_1 = require("./notifications");
var utils_1 = require("./utils");
var eventEmitter_1 = require("./eventEmitter");
var AccountsContext = react_1.createContext(null);
var accountEmitter = new eventEmitter_1.EventEmitter();
var pendingMintCalls = new Map();
var mintCache = new Map();
var pendingAccountCalls = new Map();
var accountsCache = new Map();
var pendingCalls = new Map();
var genericCache = new Map();
var getAccountInfo = function (connection, pubKey) { return __awaiter(void 0, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connection.getAccountInfo(pubKey)];
            case 1:
                info = _a.sent();
                if (info === null) {
                    throw new Error("Failed to find account");
                }
                return [2 /*return*/, tokenAccountFactory(pubKey, info)];
        }
    });
}); };
var getMintInfo = function (connection, pubKey) { return __awaiter(void 0, void 0, void 0, function () {
    var info, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connection.getAccountInfo(pubKey)];
            case 1:
                info = _a.sent();
                if (info === null) {
                    throw new Error("Failed to find mint account");
                }
                data = Buffer.from(info.data);
                return [2 /*return*/, deserializeMint(data)];
        }
    });
}); };
var MintParser = function (pubKey, info) {
    var buffer = Buffer.from(info.data);
    var data = deserializeMint(buffer);
    var details = {
        pubkey: pubKey,
        account: __assign({}, info),
        info: data
    };
    return details;
};
exports.MintParser = MintParser;
exports.TokenAccountParser = tokenAccountFactory;
var GenericAccountParser = function (pubKey, info) {
    var buffer = Buffer.from(info.data);
    var details = {
        pubkey: pubKey,
        account: __assign({}, info),
        info: buffer
    };
    return details;
};
exports.GenericAccountParser = GenericAccountParser;
exports.keyToAccountParser = new Map();
exports.cache = {
    query: function (connection, pubKey, parser) { return __awaiter(void 0, void 0, void 0, function () {
        var id, address, account, query;
        return __generator(this, function (_a) {
            if (typeof pubKey === "string") {
                id = new web3_js_1.PublicKey(pubKey);
            }
            else {
                id = pubKey;
            }
            address = id.toBase58();
            account = genericCache.get(address);
            if (account) {
                return [2 /*return*/, account];
            }
            query = pendingCalls.get(address);
            if (query) {
                return [2 /*return*/, query];
            }
            query = connection.getAccountInfo(id).then(function (data) {
                if (!data) {
                    throw new Error("Account not found");
                }
                return exports.cache.add(id, data, parser);
            });
            pendingCalls.set(address, query);
            return [2 /*return*/, query];
        });
    }); },
    add: function (id, obj, parser) {
        var address = id.toBase58();
        var deserialize = parser ? parser : exports.keyToAccountParser.get(address);
        if (!deserialize) {
            throw new Error("Deserializer needs to be registered or passed as a parameter");
        }
        exports.cache.registerParser(id, deserialize);
        pendingCalls["delete"](address);
        var account = deserialize(id, obj);
        genericCache.set(address, account);
        return account;
    },
    get: function (pubKey) {
        var key;
        if (typeof pubKey !== "string") {
            key = pubKey.toBase58();
        }
        else {
            key = pubKey;
        }
        return genericCache.get(key);
    },
    registerParser: function (pubkey, parser) {
        exports.keyToAccountParser.set(pubkey.toBase58(), parser);
    },
    queryAccount: function (connection, pubKey) { return __awaiter(void 0, void 0, void 0, function () {
        var id, address, account, query;
        return __generator(this, function (_a) {
            if (typeof pubKey === "string") {
                id = new web3_js_1.PublicKey(pubKey);
            }
            else {
                id = pubKey;
            }
            address = id.toBase58();
            account = accountsCache.get(address);
            if (account) {
                return [2 /*return*/, account];
            }
            query = pendingAccountCalls.get(address);
            if (query) {
                return [2 /*return*/, query];
            }
            query = getAccountInfo(connection, id).then(function (data) {
                pendingAccountCalls["delete"](address);
                accountsCache.set(address, data);
                return data;
            });
            pendingAccountCalls.set(address, query);
            return [2 /*return*/, query];
        });
    }); },
    addAccount: function (pubKey, obj) {
        var account = tokenAccountFactory(pubKey, obj);
        accountsCache.set(account.pubkey.toBase58(), account);
        return account;
    },
    deleteAccount: function (pubkey) {
        var id = pubkey === null || pubkey === void 0 ? void 0 : pubkey.toBase58();
        accountsCache["delete"](id);
        accountEmitter.raiseAccountUpdated(id);
    },
    getAccount: function (pubKey) {
        var key;
        if (typeof pubKey !== "string") {
            key = pubKey.toBase58();
        }
        else {
            key = pubKey;
        }
        return accountsCache.get(key);
    },
    queryMint: function (connection, pubKey) { return __awaiter(void 0, void 0, void 0, function () {
        var id, address, mint, query;
        return __generator(this, function (_a) {
            if (typeof pubKey === "string") {
                id = new web3_js_1.PublicKey(pubKey);
            }
            else {
                id = pubKey;
            }
            address = id.toBase58();
            mint = mintCache.get(address);
            if (mint) {
                return [2 /*return*/, mint];
            }
            query = pendingMintCalls.get(address);
            if (query) {
                return [2 /*return*/, query];
            }
            query = getMintInfo(connection, id).then(function (data) {
                pendingAccountCalls["delete"](address);
                mintCache.set(address, data);
                return data;
            });
            pendingAccountCalls.set(address, query);
            return [2 /*return*/, query];
        });
    }); },
    getMint: function (pubKey) {
        if (!pubKey) {
            return;
        }
        var key;
        if (typeof pubKey !== "string") {
            key = pubKey.toBase58();
        }
        else {
            key = pubKey;
        }
        return mintCache.get(key);
    },
    addMint: function (pubKey, obj) {
        var mint = deserializeMint(obj.data);
        var id = pubKey.toBase58();
        mintCache.set(id, mint);
        return mint;
    }
};
var getCachedAccount = function (predicate) {
    for (var _i = 0, _a = accountsCache.values(); _i < _a.length; _i++) {
        var account = _a[_i];
        if (predicate(account)) {
            return account;
        }
    }
};
exports.getCachedAccount = getCachedAccount;
function tokenAccountFactory(pubKey, info) {
    var buffer = Buffer.from(info.data);
    var data = deserializeAccount(buffer);
    var details = {
        pubkey: pubKey,
        account: __assign({}, info),
        info: data
    };
    return details;
}
function wrapNativeAccount(pubkey, account) {
    if (!account) {
        return undefined;
    }
    return {
        pubkey: pubkey,
        account: account,
        info: {
            mint: ids_1.WRAPPED_SOL_MINT,
            owner: pubkey,
            amount: new spl_token_1.u64(account.lamports),
            delegate: null,
            delegatedAmount: new spl_token_1.u64(0),
            isInitialized: true,
            isFrozen: false,
            isNative: true,
            rentExemptReserve: null,
            closeAuthority: null
        }
    };
}
// var UseNativeAccount = function () {
//     var connection = connection_1.useConnection();
//     var wallet = wallet_1.useWallet().wallet;
//     var _a = react_1.useState(), nativeAccount = _a[0], setNativeAccount = _a[1];
//     react_1.useEffect(function () {
//         if (!connection || !(wallet === null || wallet === void 0 ? void 0 : wallet.publicKey)) {
//             return;
//         }
//         connection.getAccountInfo(wallet.publicKey).then(function (acc) {
//             if (acc) {
//                 setNativeAccount(acc);
//             }
//         });
//         connection.onAccountChange(wallet.publicKey, function (acc) {
//             if (acc) {
//                 setNativeAccount(acc);
//             }
//         });
//     }, [setNativeAccount, wallet, wallet === null || wallet === void 0 ? void 0 : wallet.publicKey, connection]);
//     react_1.useEffect(function () {
//         if (!(wallet === null || wallet === void 0 ? void 0 : wallet.publicKey)) {
//             return;
//         }
//         var account = wrapNativeAccount(wallet === null || wallet === void 0 ? void 0 : wallet.publicKey, nativeAccount);
//         if (!account) {
//             return;
//         }
//         accountsCache.set(account.pubkey.toBase58(), account);
//     }, [wallet === null || wallet === void 0 ? void 0 : wallet.publicKey, nativeAccount]);
//     return { nativeAccount: nativeAccount };
// };
// var PRECACHED_OWNERS = new Set();
// var precacheUserTokenAccounts = function (connection, owner) { return __awaiter(void 0, void 0, void 0, function () {
//     var accounts;
//     return __generator(this, function (_a) {
//         switch (_a.label) {
//             case 0:
//                 if (!owner) {
//                     return [2 /*return*/];
//                 }
//                 // used for filtering account updates over websocket
//                 PRECACHED_OWNERS.add(owner.toBase58());
//                 return [4 /*yield*/, connection.getTokenAccountsByOwner(owner, {
//                         programId: ids_1.programIds().token
//                     })];
//             case 1:
//                 accounts = _a.sent();
//                 accounts.value
//                     .map(function (info) {
//                     var data = deserializeAccount(info.account.data);
//                     // TODO: move to web3.js for decoding on the client side... maybe with callback
//                     var details = {
//                         pubkey: info.pubkey,
//                         account: __assign({}, info.account),
//                         info: data
//                     };
//                     return details;
//                 })
//                     .forEach(function (acc) {
//                     accountsCache.set(acc.pubkey.toBase58(), acc);
//                 });
//                 return [2 /*return*/];
//         }
//     });
// }); };
// function AccountsProvider(_a) {
//     var _this = this;
//     var _b = _a.children, children = _b === void 0 ? null : _b;
//     var connection = connection_1.useConnection();
//     var _c = wallet_1.useWallet(), wallet = _c.wallet, connected = _c.connected;
//     var _d = react_1.useState([]), tokenAccounts = _d[0], setTokenAccounts = _d[1];
//     var _e = react_1.useState([]), userAccounts = _e[0], setUserAccounts = _e[1];
//     var nativeAccount = UseNativeAccount().nativeAccount;
//     var pools = pools_1.usePools().pools;
//     var publicKey = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey;
//     var selectUserAccounts = react_1.useCallback(function () {
//         return __spreadArray([], accountsCache.values()).filter(function (a) { return a.info.owner.toBase58() === (publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58()); });
//     }, [publicKey]);
//     react_1.useEffect(function () {
//         setUserAccounts(__spreadArray([wrapNativeAccount(publicKey, nativeAccount)], tokenAccounts).filter(function (a) { return a !== undefined; }));
//     }, [nativeAccount, publicKey, tokenAccounts]);
//     react_1.useEffect(function () {
//         if (!connection || !publicKey) {
//             setTokenAccounts([]);
//         }
//         else {
//             // cache host accounts to avoid query during swap
//             precacheUserTokenAccounts(connection, ids_1.SWAP_HOST_FEE_ADDRESS);
//             precacheUserTokenAccounts(connection, publicKey).then(function () { return __awaiter(_this, void 0, void 0, function () {
//                 var accounts, mints, response;
//                 return __generator(this, function (_a) {
//                     switch (_a.label) {
//                         case 0:
//                             accounts = selectUserAccounts();
//                             mints = __spreadArray([], new Set(accounts.map(function (a) { return a.info.mint.toBase58(); })
//                                 .filter(function (a) { return exports.cache.getMint(a) === undefined; }))).sort();
//                             return [4 /*yield*/, exports.getMultipleAccounts(connection, mints, 'single')];
//                         case 1:
//                             response = _a.sent();
//                             response.keys.forEach(function (key, index) {
//                                 if (response.array[index]) {
//                                     try {
//                                         exports.cache.addMint(new web3_js_1.PublicKey(key), response.array[index]);
//                                     }
//                                     catch (_a) {
//                                         debugger;
//                                     }
//                                 }
//                             });
//                             setTokenAccounts(accounts);
//                             return [2 /*return*/];
//                     }
//                 });
//             }); });
//             var dispose_1 = accountEmitter.onAccount(function () {
//                 setTokenAccounts(selectUserAccounts());
//             });
//             // This can return different types of accounts: token-account, mint, multisig
//             // TODO: web3.js expose ability to filter. discuss filter syntax
//             var tokenSubID_1 = connection.onProgramAccountChange(ids_1.programIds().token, function (info) {
//                 var id = typeof info.accountId === 'string' ? info.accountId : info.accountId.toBase58();
//                 // TODO: do we need a better way to identify layout (maybe a enum identifing type?)
//                 if (info.accountInfo.data.length === spl_token_1.AccountLayout.span) {
//                     var data = deserializeAccount(info.accountInfo.data);
//                     // TODO: move to web3.js for decoding on the client side... maybe with callback
//                     var details = {
//                         pubkey: new web3_js_1.PublicKey(id),
//                         account: __assign({}, info.accountInfo),
//                         info: data
//                     };
//                     if (PRECACHED_OWNERS.has(details.info.owner.toBase58()) ||
//                         accountsCache.has(id)) {
//                         accountsCache.set(id, details);
//                         accountEmitter.raiseAccountUpdated(id);
//                     }
//                 }
//                 else if (info.accountInfo.data.length === spl_token_1.MintLayout.span) {
//                     if (mintCache.has(id)) {
//                         var data = Buffer.from(info.accountInfo.data);
//                         var mint = deserializeMint(data);
//                         mintCache.set(id, mint);
//                     }
//                     accountEmitter.raiseAccountUpdated(id);
//                 }
//                 if (genericCache.has(id)) {
//                     exports.cache.add(new web3_js_1.PublicKey(id), info.accountInfo);
//                 }
//             }, "singleGossip");
//             return function () {
//                 connection.removeProgramAccountChangeListener(tokenSubID_1);
//                 dispose_1();
//             };
//         }
//     }, [connection, connected, publicKey, selectUserAccounts]);
//     return undefined;
// }
// exports.AccountsProvider = AccountsProvider;
function useNativeAccount() {
    var context = react_1.useContext(AccountsContext);
    return {
        account: context.nativeAccount
    };
}
exports.useNativeAccount = useNativeAccount;
var getMultipleAccounts = function (connection, keys, commitment) { return __awaiter(void 0, void 0, void 0, function () {
    var result, array;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(utils_1.chunks(keys, 99).map(function (chunk) {
                    return getMultipleAccountsCore(connection, chunk, commitment);
                }))];
            case 1:
                result = _a.sent();
                array = result
                    .map(function (a) {
                    return a.array
                        .map(function (acc) {
                        if (!acc) {
                            return undefined;
                        }
                        var data = acc.data, rest = __rest(acc, ["data"]);
                        var obj = __assign(__assign({}, rest), { data: Buffer.from(data[0], "base64") });
                        return obj;
                    });
                })
                    .flat();
                return [2 /*return*/, { keys: keys, array: array }];
        }
    });
}); };
exports.getMultipleAccounts = getMultipleAccounts;
var getMultipleAccountsCore = function (connection, keys, commitment) { return __awaiter(void 0, void 0, void 0, function () {
    var args, unsafeRes, array;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = connection._buildArgs([keys], commitment, "base64");
                return [4 /*yield*/, connection._rpcRequest("getMultipleAccounts", args)];
            case 1:
                unsafeRes = _a.sent();
                if (unsafeRes.error) {
                    throw new Error("failed to get info about account " + unsafeRes.error.message);
                }
                if (unsafeRes.result.value) {
                    array = unsafeRes.result.value;
                    return [2 /*return*/, { keys: keys, array: array }];
                }
                // TODO: fix
                throw new Error();
        }
    });
}); };
// function useMint(key) {
//     var connection = connection_1.useConnection();
//     var _a = react_1.useState(), mint = _a[0], setMint = _a[1];
//     var id = typeof key === "string" ? key : key === null || key === void 0 ? void 0 : key.toBase58();
//     react_1.useEffect(function () {
//         if (!id) {
//             return;
//         }
//         exports.cache
//             .queryMint(connection, id)
//             .then(setMint)["catch"](function (err) {
//             return notifications_1.notify({
//                 message: err.message,
//                 type: "error"
//             });
//         });
//         var dispose = accountEmitter.onAccount(function (e) {
//             var event = e;
//             if (event.id === id) {
//                 exports.cache.queryMint(connection, id).then(setMint);
//             }
//         });
//         return function () {
//             dispose();
//         };
//     }, [connection, id]);
//     return mint;
// }
// exports.useMint = useMint;
// function useUserAccounts() {
//     var context = react_1.useContext(AccountsContext);
//     return {
//         userAccounts: context.userAccounts
//     };
// }
// exports.useUserAccounts = useUserAccounts;
// function useAccount(pubKey) {
//     var _this = this;
//     var connection = connection_1.useConnection();
//     var _a = react_1.useState(), account = _a[0], setAccount = _a[1];
//     var key = pubKey === null || pubKey === void 0 ? void 0 : pubKey.toBase58();
//     react_1.useEffect(function () {
//         var query = function () { return __awaiter(_this, void 0, void 0, function () {
//             var acc, err_1;
//             return __generator(this, function (_a) {
//                 switch (_a.label) {
//                     case 0:
//                         _a.trys.push([0, 2, , 3]);
//                         if (!key) {
//                             return [2 /*return*/];
//                         }
//                         return [4 /*yield*/, exports.cache.queryAccount(connection, key)["catch"](function (err) {
//                                 return notifications_1.notify({
//                                     message: err.message,
//                                     type: "error"
//                                 });
//                             })];
//                     case 1:
//                         acc = _a.sent();
//                         if (acc) {
//                             setAccount(acc);
//                         }
//                         return [3 /*break*/, 3];
//                     case 2:
//                         err_1 = _a.sent();
//                         console.error(err_1);
//                         return [3 /*break*/, 3];
//                     case 3: return [2 /*return*/];
//                 }
//             });
//         }); };
//         query();
//         var dispose = accountEmitter.onAccount(function (e) {
//             var event = e;
//             if (event.id === key) {
//                 query();
//             }
//         });
//         return function () {
//             dispose();
//         };
//     }, [connection, key]);
//     return account;
// }
// exports.useAccount = useAccount;
function useCachedPool(legacy) {
    if (legacy === void 0) { legacy = false; }
    var context = react_1.useContext(AccountsContext);
    var allPools = context.pools;
    var pools = react_1.useMemo(function () {
        return allPools.filter(function (p) { return p.legacy === legacy; });
    }, [allPools, legacy]);
    return {
        pools: pools
    };
}
exports.useCachedPool = useCachedPool;
var useSelectedAccount = function (account) {
    var userAccounts = useUserAccounts().userAccounts;
    var index = userAccounts.findIndex(function (acc) { return acc.pubkey.toBase58() === account; });
    if (index !== -1) {
        return userAccounts[index];
    }
    return;
};
exports.useSelectedAccount = useSelectedAccount;
var useAccountByMint = function (mint) {
    var userAccounts = useUserAccounts().userAccounts;
    var index = userAccounts.findIndex(function (acc) { return acc.info.mint.toBase58() === mint; });
    if (index !== -1) {
        return userAccounts[index];
    }
    return;
};
exports.useAccountByMint = useAccountByMint;
// TODO: expose in spl package
var deserializeAccount = function (data) {
    var accountInfo = spl_token_1.AccountLayout.decode(data);
    accountInfo.mint = new web3_js_1.PublicKey(accountInfo.mint);
    accountInfo.owner = new web3_js_1.PublicKey(accountInfo.owner);
    accountInfo.amount = spl_token_1.u64.fromBuffer(accountInfo.amount);
    if (accountInfo.delegateOption === 0) {
        accountInfo.delegate = null;
        accountInfo.delegatedAmount = new spl_token_1.u64(0);
    }
    else {
        accountInfo.delegate = new web3_js_1.PublicKey(accountInfo.delegate);
        accountInfo.delegatedAmount = spl_token_1.u64.fromBuffer(accountInfo.delegatedAmount);
    }
    accountInfo.isInitialized = accountInfo.state !== 0;
    accountInfo.isFrozen = accountInfo.state === 2;
    if (accountInfo.isNativeOption === 1) {
        accountInfo.rentExemptReserve = spl_token_1.u64.fromBuffer(accountInfo.isNative);
        accountInfo.isNative = true;
    }
    else {
        accountInfo.rentExemptReserve = null;
        accountInfo.isNative = false;
    }
    if (accountInfo.closeAuthorityOption === 0) {
        accountInfo.closeAuthority = null;
    }
    else {
        accountInfo.closeAuthority = new web3_js_1.PublicKey(accountInfo.closeAuthority);
    }
    return accountInfo;
};
// TODO: expose in spl package
var deserializeMint = function (data) {
    if (data.length !== spl_token_1.MintLayout.span) {
        throw new Error("Not a valid Mint");
    }
    var mintInfo = spl_token_1.MintLayout.decode(data);
    if (mintInfo.mintAuthorityOption === 0) {
        mintInfo.mintAuthority = null;
    }
    else {
        mintInfo.mintAuthority = new web3_js_1.PublicKey(mintInfo.mintAuthority);
    }
    mintInfo.supply = spl_token_1.u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized !== 0;
    if (mintInfo.freezeAuthorityOption === 0) {
        mintInfo.freezeAuthority = null;
    }
    else {
        mintInfo.freezeAuthority = new web3_js_1.PublicKey(mintInfo.freezeAuthority);
    }
    return mintInfo;
};
