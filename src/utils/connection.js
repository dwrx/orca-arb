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
exports.sendTransaction = exports.useSlippageConfig = exports.useConnectionConfig = exports.useSendConnection = exports.useConnection = exports.ConnectionProvider = exports.ENDPOINTS = void 0;
var utils_1 = require("./utils");
var web3_js_1 = require("@solana/web3.js");
var react_1 = require("react");
var ids_1 = require("./ids");
var notifications_1 = require("./notifications");
// var explorerLink_1 = require("../components/explorerLink.js");
var spl_token_registry_1 = require("@solana/spl-token-registry");
var accounts_1 = require("./accounts");
exports.ENDPOINTS = [
    {
        name: "mainnet-beta",
        endpoint: "https://solana-api.projectserum.com/",
        chainID: spl_token_registry_1.ENV.MainnetBeta
    },
    {
        name: "testnet",
        endpoint: web3_js_1.clusterApiUrl("testnet"),
        chainID: spl_token_registry_1.ENV.Testnet
    },
    {
        name: "devnet",
        endpoint: web3_js_1.clusterApiUrl("devnet"),
        chainID: spl_token_registry_1.ENV.Devnet
    },
    {
        name: "localnet",
        endpoint: "http://127.0.0.1:8899",
        chainID: spl_token_registry_1.ENV.Devnet
    },
];
var DEFAULT = exports.ENDPOINTS[0].endpoint;
var DEFAULT_SLIPPAGE = 0.25;
var ConnectionContext = react_1.createContext({
    endpoint: DEFAULT,
    setEndpoint: function () { },
    slippage: DEFAULT_SLIPPAGE,
    setSlippage: function (val) { },
    connection: new web3_js_1.Connection(DEFAULT, "recent"),
    sendConnection: new web3_js_1.Connection(DEFAULT, "recent"),
    env: exports.ENDPOINTS[0].name,
    tokens: [],
    tokenMap: new Map()
});
function ConnectionProvider(_a) {
    var _this = this;
    var _b = _a.children, children = _b === void 0 ? undefined : _b;
    var _c = utils_1.useLocalStorageState("connectionEndpts", exports.ENDPOINTS[0].endpoint), endpoint = _c[0], setEndpoint = _c[1];
    var _d = utils_1.useLocalStorageState("slippage", DEFAULT_SLIPPAGE.toString()), slippage = _d[0], setSlippage = _d[1];
    var connection = react_1.useMemo(function () { return new web3_js_1.Connection(endpoint, "recent"); }, [
        endpoint,
    ]);
    var sendConnection = react_1.useMemo(function () { return new web3_js_1.Connection(endpoint, "recent"); }, [
        endpoint,
    ]);
    var chain = exports.ENDPOINTS.find(function (end) { return end.endpoint === endpoint; }) || exports.ENDPOINTS[0];
    var env = chain.name;
    var _e = react_1.useState([]), tokens = _e[0], setTokens = _e[1];
    var _f = react_1.useState(new Map()), tokenMap = _f[0], setTokenMap = _f[1];
    react_1.useEffect(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var res, list, knownMints, accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new spl_token_registry_1.TokenListProvider().resolve()];
                    case 1:
                        res = _a.sent();
                        list = res
                            .filterByChainId(chain.chainID)
                            .excludeByTag("nft")
                            .getList();
                        knownMints = list.reduce(function (map, item) {
                            map.set(item.address, item);
                            return map;
                        }, new Map());
                        return [4 /*yield*/, accounts_1.getMultipleAccounts(connection, __spreadArray([], knownMints.keys()), 'single')];
                    case 2:
                        accounts = _a.sent();
                        accounts.keys.forEach(function (key, index) {
                            var account = accounts.array[index];
                            if (!account) {
                                knownMints["delete"](accounts.keys[index]);
                                return;
                            }
                            try {
                                accounts_1.cache.addMint(new web3_js_1.PublicKey(key), account);
                            }
                            catch (_a) {
                                // ignore
                            }
                        });
                        setTokenMap(knownMints);
                        setTokens(__spreadArray([], knownMints.values()));
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [chain, connection]);
    ids_1.setProgramIds(env);
    // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
    // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
    // This is a hack to prevent the list from every getting empty
    react_1.useEffect(function () {
        var id = connection.onAccountChange(new web3_js_1.Account().publicKey, function () { });
        return function () {
            connection.removeAccountChangeListener(id);
        };
    }, [connection]);
    react_1.useEffect(function () {
        var id = connection.onSlotChange(function () { return null; });
        return function () {
            connection.removeSlotChangeListener(id);
        };
    }, [connection]);
    react_1.useEffect(function () {
        var id = sendConnection.onAccountChange(new web3_js_1.Account().publicKey, function () { });
        return function () {
            sendConnection.removeAccountChangeListener(id);
        };
    }, [sendConnection]);
    react_1.useEffect(function () {
        var id = sendConnection.onSlotChange(function () { return null; });
        return function () {
            sendConnection.removeSlotChangeListener(id);
        };
    }, [sendConnection]);
    return undefined;
}
exports.ConnectionProvider = ConnectionProvider;
function useConnection() {
    return react_1.useContext(ConnectionContext).connection;
}
exports.useConnection = useConnection;
function useSendConnection() {
    var _a;
    return (_a = react_1.useContext(ConnectionContext)) === null || _a === void 0 ? void 0 : _a.sendConnection;
}
exports.useSendConnection = useSendConnection;
function useConnectionConfig() {
    var context = react_1.useContext(ConnectionContext);
    return {
        endpoint: context.endpoint,
        setEndpoint: context.setEndpoint,
        env: context.env,
        tokens: context.tokens,
        tokenMap: context.tokenMap
    };
}
exports.useConnectionConfig = useConnectionConfig;
function useSlippageConfig() {
    var _a = react_1.useContext(ConnectionContext), slippage = _a.slippage, setSlippage = _a.setSlippage;
    return { slippage: slippage, setSlippage: setSlippage };
}
exports.useSlippageConfig = useSlippageConfig;
var getErrorForTransaction = function (connection, txid) { return __awaiter(void 0, void 0, void 0, function () {
    var tx, errors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // wait for all confirmation before geting transaction
            return [4 /*yield*/, connection.confirmTransaction(txid, "max")];
            case 1:
                // wait for all confirmation before geting transaction
                _a.sent();
                return [4 /*yield*/, connection.getParsedConfirmedTransaction(txid)];
            case 2:
                tx = _a.sent();
                errors = [];
                if ((tx === null || tx === void 0 ? void 0 : tx.meta) && tx.meta.logMessages) {
                    tx.meta.logMessages.forEach(function (log) {
                        var regex = /Error: (.*)/gm;
                        var m;
                        while ((m = regex.exec(log)) !== null) {
                            // This is necessary to avoid infinite loops with zero-width matches
                            if (m.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }
                            if (m.length > 1) {
                                errors.push(m[1]);
                            }
                        }
                    });
                }
                return [2 /*return*/, errors];
        }
    });
}); };
var sendTransaction = function (connection, account, instructions, signers, awaitConfirmation) {
    if (awaitConfirmation === void 0) { awaitConfirmation = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var transaction, _a, rawTransaction, options, txid, status_1, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    transaction = new web3_js_1.Transaction();
                    instructions.forEach(function (instruction) { return transaction.add(instruction); });
                    _a = transaction;
                    return [4 /*yield*/, connection.getRecentBlockhash("max")];
                case 1:
                    _a.recentBlockhash = (_b.sent()).blockhash;
                    transaction.setSigners.apply(transaction, __spreadArray([
                        // fee payied by the wallet owner
                        account.publicKey], signers.map(function (s) { return s.publicKey; })));
                    if (signers.length > 0) {
                        transaction.partialSign.apply(transaction, signers);
                    }
                    return [4 /*yield*/, transaction.sign(account)];
                case 2:
                    transaction = _b.sent();
                    rawTransaction = transaction.serialize();
                    options = {
                        skipPreflight: true,
                        commitment: "singleGossip"
                    };
                    return [4 /*yield*/, connection.sendRawTransaction(rawTransaction, options)];
                case 3:
                    txid = _b.sent();
                    if (!awaitConfirmation) return [3 /*break*/, 6];
                    return [4 /*yield*/, connection.confirmTransaction(txid, options && options.commitment)];
                case 4:
                    status_1 = (_b.sent()).value;
                    if (!(status_1 === null || status_1 === void 0 ? void 0 : status_1.err)) return [3 /*break*/, 6];
                    return [4 /*yield*/, getErrorForTransaction(connection, txid)];
                case 6: return [2 /*return*/, txid];
            }
        });
    });
};
exports.sendTransaction = sendTransaction;
