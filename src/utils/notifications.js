"use strict";
exports.__esModule = true;
exports.notify = void 0;
var react_1 = require("react");
var antd_1 = require("antd");
// import Link from '../components/Link';
function notify(_a) {
    var _b = _a.message, message = _b === void 0 ? "" : _b, _c = _a.description, description = _c === void 0 ? undefined : _c, _d = _a.txid, txid = _d === void 0 ? "" : _d, _e = _a.type, type = _e === void 0 ? "info" : _e, _f = _a.placement, placement = _f === void 0 ? "bottomLeft" : _f;
    if (txid) {

    }
    antd_1.notification[type]({
    });
}
exports.notify = notify;
