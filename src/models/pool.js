"use strict";
exports.__esModule = true;
exports.CurveType = exports.DEFAULT_DENOMINATOR = void 0;
exports.DEFAULT_DENOMINATOR = 10000;
var CurveType;
(function (CurveType) {
    CurveType[CurveType["ConstantProduct"] = 0] = "ConstantProduct";
    CurveType[CurveType["ConstantPrice"] = 1] = "ConstantPrice";
    CurveType[CurveType["Stable"] = 2] = "Stable";
    CurveType[CurveType["ConstantProductWithOffset"] = 3] = "ConstantProductWithOffset";
})(CurveType = exports.CurveType || (exports.CurveType = {}));
