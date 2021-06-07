"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.colorWarning = exports.formatShortDate = exports.formatPriceNumber = exports.formatPct = exports.formatNumber = exports.formatUSD = exports.formatTokenAmount = exports.convert = exports.chunks = exports.STABLE_COINS = exports.isKnownMint = exports.getPoolName = exports.getTokenIcon = exports.getTokenName = exports.shortenAddress = exports.useLocalStorageState = void 0;
var bn_js_1 = require("bn.js");
var react_1 = require("react");
function useLocalStorageState(key, defaultState) {
    var _a = react_1.useState(function () {
        // NOTE: Not sure if this is ok
        var storedState = localStorage.getItem(key);
        if (storedState) {
            return JSON.parse(storedState);
        }
        return defaultState;
    }), state = _a[0], setState = _a[1];
    var setLocalStorageState = react_1.useCallback(function (newState) {
        var changed = state !== newState;
        if (!changed) {
            return;
        }
        setState(newState);
        if (newState === null) {
            localStorage.removeItem(key);
        }
        else {
            localStorage.setItem(key, JSON.stringify(newState));
        }
    }, [state, key]);
    return [state, setLocalStorageState];
}
exports.useLocalStorageState = useLocalStorageState;
// shorten the checksummed version of the input address to have 4 characters at start and end
function shortenAddress(address, chars) {
    if (chars === void 0) { chars = 4; }
    return address.slice(0, chars) + "..." + address.slice(-chars);
}
exports.shortenAddress = shortenAddress;
function getTokenName(map, mintAddress, shorten, length) {
    var _a;
    if (shorten === void 0) { shorten = true; }
    if (length === void 0) { length = 5; }
    var knownSymbol = (_a = map.get(mintAddress)) === null || _a === void 0 ? void 0 : _a.symbol;
    if (knownSymbol) {
        return knownSymbol;
    }
    return shorten ? mintAddress.substring(0, length) + "..." : mintAddress;
}
exports.getTokenName = getTokenName;
function getTokenIcon(map, mintAddress) {
    var _a;
    return (_a = map.get(mintAddress)) === null || _a === void 0 ? void 0 : _a.logoURI;
}
exports.getTokenIcon = getTokenIcon;
function getPoolName(map, pool, shorten) {
    if (shorten === void 0) { shorten = true; }
    var sorted = pool.pubkeys.holdingMints.map(function (a) { return a.toBase58(); }).sort();
    return sorted.map(function (item) { return getTokenName(map, item, shorten); }).join("/");
}
exports.getPoolName = getPoolName;
function isKnownMint(map, mintAddress) {
    return !!map.get(mintAddress);
}
exports.isKnownMint = isKnownMint;
exports.STABLE_COINS = new Set(["USDC", "wUSDC", "USDT", "wUSDT", "WUSDT"]);
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map(function (_, index) { return array.slice(index * size, (index + 1) * size); });
}
exports.chunks = chunks;
function convert(account, mint, rate) {
    if (rate === void 0) { rate = 1.0; }
    if (!account) {
        return 0;
    }
    var amount = typeof account === "number" ? new bn_js_1["default"](account) : account.info.amount;
    var precision = new bn_js_1["default"](10).pow(new bn_js_1["default"]((mint === null || mint === void 0 ? void 0 : mint.decimals) || 0));
    // avoid overflowing 53 bit numbers on calling toNumber()
    var div = amount.div(precision).toNumber();
    var rem = amount.mod(precision).toNumber() / precision.toNumber();
    var result = (div + rem) * rate;
    return result;
}
exports.convert = convert;
var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
var abbreviateNumber = function (number, precision) {
    var tier = (Math.log10(number) / 3) | 0;
    var scaled = number;
    var suffix = SI_SYMBOL[tier];
    if (tier !== 0) {
        var scale = Math.pow(10, tier * 3);
        scaled = number / scale;
    }
    return scaled.toFixed(precision) + suffix;
};
var format = function (val, precision, abbr) {
    return abbr ? abbreviateNumber(val, precision) : val.toFixed(precision);
};
function formatTokenAmount(account, mint, rate, prefix, suffix, precision, abbr) {
    if (rate === void 0) { rate = 1.0; }
    if (prefix === void 0) { prefix = ""; }
    if (suffix === void 0) { suffix = ""; }
    if (precision === void 0) { precision = 6; }
    if (abbr === void 0) { abbr = false; }
    if (!account) {
        return "";
    }
    return "" + [prefix] + format(convert(account, mint, rate), precision, abbr) + suffix;
}
exports.formatTokenAmount = formatTokenAmount;
exports.formatUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});
exports.formatNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
exports.formatPct = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
exports.formatPriceNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
});
exports.formatShortDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short"
});
// returns a Color from a 4 color array, green to red, depending on the index
// of the closer (up) checkpoint number from the value
var colorWarning = function (value, valueCheckpoints) {
    if (value === void 0) { value = 0; }
    if (valueCheckpoints === void 0) { valueCheckpoints = [1, 3, 5, 100]; }
    var defaultIndex = 1;
    var colorCodes = ["#27ae60", "inherit", "#f3841e", "#ff3945"];
    if (value > valueCheckpoints[valueCheckpoints.length - 1]) {
        return colorCodes[defaultIndex];
    }
    var closest = __spreadArray([], valueCheckpoints).sort(function (a, b) {
        var first = a - value < 0 ? Number.POSITIVE_INFINITY : a - value;
        var second = b - value < 0 ? Number.POSITIVE_INFINITY : b - value;
        if (first < second) {
            return -1;
        }
        else if (first > second) {
            return 1;
        }
        return 0;
    })[0];
    var index = valueCheckpoints.indexOf(closest);
    if (index !== -1) {
        return colorCodes[index];
    }
    return colorCodes[defaultIndex];
};
exports.colorWarning = colorWarning;
