"use strict";
exports.__esModule = true;
exports.EventEmitter = exports.MarketUpdateEvent = exports.AccountUpdateEvent = void 0;
var eventemitter3_1 = require("eventemitter3");
var AccountUpdateEvent = /** @class */ (function () {
    function AccountUpdateEvent(id) {
        this.id = id;
    }
    AccountUpdateEvent.type = "AccountUpdate";
    return AccountUpdateEvent;
}());
exports.AccountUpdateEvent = AccountUpdateEvent;
var MarketUpdateEvent = /** @class */ (function () {
    function MarketUpdateEvent(ids) {
        this.ids = ids;
    }
    MarketUpdateEvent.type = "MarketUpdate";
    return MarketUpdateEvent;
}());
exports.MarketUpdateEvent = MarketUpdateEvent;
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.emitter = new eventemitter3_1.EventEmitter();
    }
    EventEmitter.prototype.onMarket = function (callback) {
        var _this = this;
        this.emitter.on(MarketUpdateEvent.type, callback);
        return function () { return _this.emitter.removeListener(MarketUpdateEvent.type, callback); };
    };
    EventEmitter.prototype.onAccount = function (callback) {
        var _this = this;
        this.emitter.on(AccountUpdateEvent.type, callback);
        return function () { return _this.emitter.removeListener(AccountUpdateEvent.type, callback); };
    };
    EventEmitter.prototype.raiseAccountUpdated = function (id) {
        this.emitter.emit(AccountUpdateEvent.type, new AccountUpdateEvent(id));
    };
    EventEmitter.prototype.raiseMarketUpdated = function (ids) {
        this.emitter.emit(MarketUpdateEvent.type, new MarketUpdateEvent(ids));
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
