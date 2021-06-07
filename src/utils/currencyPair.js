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
exports.__esModule = true;
exports.useCurrencyPairState = exports.CurrencyPairProvider = exports.useCurrencyLeg = void 0;
var react_1 = require("react");
var pools_1 = require("./pools");
var accounts_1 = require("./accounts");
var connection_1 = require("./connection");
var models_1 = require("../models");
var utils_1 = require("./utils");
var react_router_dom_1 = require("react-router-dom");
var bs58_1 = require("bs58");
var CurrencyPairContext = react_1["default"].createContext(null);
var convertAmount = function (amount, mint) {
    return parseFloat(amount) * Math.pow(10, (mint === null || mint === void 0 ? void 0 : mint.decimals) || 0);
};
var useCurrencyLeg = function (config, defaultMint) {
    var tokenMap = connection_1.useConnectionConfig().tokenMap;
    var _a = react_1.useState(""), amount = _a[0], setAmount = _a[1];
    var _b = react_1.useState(defaultMint || ""), mintAddress = _b[0], setMintAddress = _b[1];
    var account = accounts_1.useAccountByMint(mintAddress);
    var mint = accounts_1.cache.getMint(mintAddress);
    return react_1.useMemo(function () { return ({
        mintAddress: mintAddress,
        account: account,
        mint: mint,
        amount: amount,
        name: utils_1.getTokenName(tokenMap, mintAddress),
        icon: utils_1.getTokenIcon(tokenMap, mintAddress),
        setAmount: setAmount,
        setMint: setMintAddress,
        convertAmount: function () { return convertAmount(amount, mint); },
        sufficientBalance: function () {
            return account !== undefined &&
                (utils_1.convert(account, mint) >= parseFloat(amount) ||
                    config.curveType === models_1.CurveType.ConstantProductWithOffset);
        }
    }); }, [
        mintAddress,
        account,
        mint,
        amount,
        tokenMap,
        setAmount,
        setMintAddress,
        config,
    ]);
};
exports.useCurrencyLeg = useCurrencyLeg;
function CurrencyPairProvider(_a) {
    var _this = this;
    var _b = _a.children, children = _b === void 0 ? null : _b;
    var connection = connection_1.useConnection();
    var tokens = connection_1.useConnectionConfig().tokens;
    var history = react_router_dom_1.useHistory();
    var location = react_router_dom_1.useLocation();
    var _c = react_1.useState(""), lastTypedAccount = _c[0], setLastTypedAccount = _c[1];
    var _d = react_1.useState(pools_1.PoolOperation.Add), poolOperation = _d[0], setPoolOperation = _d[1];
    var _e = react_1.useState({
        curveType: models_1.CurveType.ConstantProduct,
        fees: {
            tradeFeeNumerator: 25,
            tradeFeeDenominator: models_1.DEFAULT_DENOMINATOR,
            ownerTradeFeeNumerator: 5,
            ownerTradeFeeDenominator: models_1.DEFAULT_DENOMINATOR,
            ownerWithdrawFeeNumerator: 0,
            ownerWithdrawFeeDenominator: 0,
            hostFeeNumerator: 20,
            hostFeeDenominator: 100
        }
    }), options = _e[0], setOptions = _e[1];
    var base = exports.useCurrencyLeg(options);
    var mintAddressA = base.mintAddress;
    var setMintAddressA = base.setMint;
    var amountA = base.amount;
    var setAmountA = base.setAmount;
    var quote = exports.useCurrencyLeg(options);
    var mintAddressB = quote.mintAddress;
    var setMintAddressB = quote.setMint;
    var amountB = quote.amount;
    var setAmountB = quote.setAmount;
    var pool = pools_1.usePoolForBasket([base.mintAddress, quote.mintAddress]);
    react_1.useEffect(function () {
        var _a, _b;
        var base = ((_a = tokens.find(function (t) { return t.address === mintAddressA; })) === null || _a === void 0 ? void 0 : _a.symbol) || mintAddressA;
        var quote = ((_b = tokens.find(function (t) { return t.address === mintAddressB; })) === null || _b === void 0 ? void 0 : _b.symbol) || mintAddressB;
        document.title = "Swap | Serum (" + base + "/" + quote + ")";
    }, [mintAddressA, mintAddressB, tokens, location]);
    // updates browser history on token changes
    react_1.useEffect(function () {
        var _a, _b;
        // set history
        var base = ((_a = tokens.find(function (t) { return t.address === mintAddressA; })) === null || _a === void 0 ? void 0 : _a.symbol) || mintAddressA;
        var quote = ((_b = tokens.find(function (t) { return t.address === mintAddressB; })) === null || _b === void 0 ? void 0 : _b.symbol) || mintAddressB;
        if (base && quote && location.pathname.indexOf("info") < 0) {
            history.push({
                search: "?pair=" + base + "-" + quote
            });
        }
        else {
            if (mintAddressA && mintAddressB) {
                history.push({
                    search: ""
                });
            }
            else {
                return;
            }
        }
    }, [mintAddressA, mintAddressB, tokens, history, location.pathname]);
    // Updates tokens on location change
    react_1.useEffect(function () {
        var _a, _b;
        if (!location.search && mintAddressA && mintAddressB) {
            return;
        }
        var _c = getDefaultTokens(tokens, location.search), defaultBase = _c.defaultBase, defaultQuote = _c.defaultQuote;
        if (!defaultBase || !defaultQuote) {
            return;
        }
        setMintAddressA(((_a = tokens.find(function (t) { return t.symbol === defaultBase; })) === null || _a === void 0 ? void 0 : _a.address) ||
            (isValidAddress(defaultBase) ? defaultBase : "") ||
            "");
        setMintAddressB(((_b = tokens.find(function (t) { return t.symbol === defaultQuote; })) === null || _b === void 0 ? void 0 : _b.address) ||
            (isValidAddress(defaultQuote) ? defaultQuote : "") ||
            "");
        // mintAddressA and mintAddressB are not included here to prevent infinite loop
        // eslint-disable-next-line
    }, [location, location.search, setMintAddressA, setMintAddressB, tokens]);
    var calculateDependent = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var setDependent, amount, independent, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(pool && mintAddressA && mintAddressB)) return [3 /*break*/, 2];
                    setDependent = void 0;
                    amount = void 0;
                    independent = void 0;
                    if (lastTypedAccount === mintAddressA) {
                        independent = mintAddressA;
                        setDependent = setAmountB;
                        amount = parseFloat(amountA);
                    }
                    else {
                        independent = mintAddressB;
                        setDependent = setAmountA;
                        amount = parseFloat(amountB);
                    }
                    return [4 /*yield*/, pools_1.calculateDependentAmount(connection, independent, amount, pool, poolOperation)];
                case 1:
                    result = _a.sent();
                    if (typeof result === "string") {
                        setDependent(result);
                    }
                    else if (result !== undefined && Number.isFinite(result)) {
                        setDependent(result.toFixed(6));
                    }
                    else {
                        setDependent("");
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [
        pool,
        mintAddressA,
        mintAddressB,
        setAmountA,
        setAmountB,
        amountA,
        amountB,
        connection,
        lastTypedAccount,
        poolOperation,
    ]);
    react_1.useEffect(function () {
        calculateDependent();
    }, [amountB, amountA, lastTypedAccount, calculateDependent]);
    return (<CurrencyPairContext.Provider value={{
            A: base,
            B: quote,
            lastTypedAccount: lastTypedAccount,
            setLastTypedAccount: setLastTypedAccount,
            setPoolOperation: setPoolOperation,
            options: options,
            setOptions: setOptions
        }}>
      {children}
    </CurrencyPairContext.Provider>);
}
exports.CurrencyPairProvider = CurrencyPairProvider;
var useCurrencyPairState = function () {
    var context = react_1.useContext(CurrencyPairContext);
    return context;
};
exports.useCurrencyPairState = useCurrencyPairState;
var isValidAddress = function (address) {
    try {
        var decoded = bs58_1["default"].decode(address);
        return decoded.length === 32;
    }
    catch (_a) {
        return false;
    }
};
function getDefaultTokens(tokens, search) {
    var defaultBase = "SOL";
    var defaultQuote = "USDC";
    var nameToToken = tokens.reduce(function (map, item) {
        map.set(item.symbol, item);
        return map;
    }, new Map());
    if (search) {
        var urlParams = new URLSearchParams(search);
        var pair = urlParams.get("pair");
        if (pair) {
            var items = pair.split("-");
            if (items.length > 1) {
                if (nameToToken.has(items[0]) || isValidAddress(items[0])) {
                    defaultBase = items[0];
                }
                if (nameToToken.has(items[1]) || isValidAddress(items[1])) {
                    defaultQuote = items[1];
                }
            }
        }
    }
    return {
        defaultBase: defaultBase,
        defaultQuote: defaultQuote
    };
}
