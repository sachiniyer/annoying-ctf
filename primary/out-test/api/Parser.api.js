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
var chai_1 = require("chai");
var TestUtils_1 = require("./TestUtils");
var APP = 'http://127.0.0.1:3001/test';
var browser;
var page;
var width = 800;
var height = 600;
describe('Parser Integration Tests', function () {
    var _this = this;
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.launchBrowser)()];
                    case 1:
                        browser = _a.sent();
                        return [4, browser.newContext()];
                    case 2: return [4, (_a.sent()).newPage()];
                    case 3:
                        page = _a.sent();
                        return [4, page.setViewportSize({ width: width, height: height })];
                    case 4:
                        _a.sent();
                        return [4, page.goto(APP)];
                    case 5:
                        _a.sent();
                        return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 6:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    after(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, browser.close()];
    }); }); });
    describe('registerCsiHandler', function () {
        it('should call custom CSI handler with js array params', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customCsiHandlerParams = [];\n        const _customCsiHandler = window.term.parser.registerCsiHandler({final: 'm'}, (params, collect) => {\n          window._customCsiHandlerParams.push(params);\n          return false;\n        }, '');\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1b[38;5;123mparams\x1b[38:2::50:100:150msubparams')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customCsiHandlerParams")];
                    case 3:
                        _b.apply(_a, [_c.sent(), [
                                [38, 5, 123],
                                [38, [2, -1, 50, 100, 150]]
                            ]]);
                        return [2];
                }
            });
        }); });
        it('async', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customCsiHandlerCallStack = [];\n        const _customCsiHandlerA = window.term.parser.registerCsiHandler({intermediates:'+', final: 'Z'}, params => {\n          window._customCsiHandlerCallStack.push(['A', params]);\n          return false;\n        });\n        const _customCsiHandlerB = window.term.parser.registerCsiHandler({intermediates:'+', final: 'Z'}, async params => {\n          await new Promise(res => setTimeout(res, 50));\n          window._customCsiHandlerCallStack.push(['B', params]);\n          return false;\n        });\n        const _customCsiHandlerC = window.term.parser.registerCsiHandler({intermediates:'+', final: 'Z'}, params => {\n          window._customCsiHandlerCallStack.push(['C', params]);\n          return false;\n        });\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1b[1;2+Z')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customCsiHandlerCallStack")];
                    case 3:
                        _b.apply(_a, [_c.sent(), [
                                ['C', [1, 2]],
                                ['B', [1, 2]],
                                ['A', [1, 2]]
                            ]]);
                        return [2];
                }
            });
        }); });
    });
    describe('registerDcsHandler', function () {
        it('should respects return value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customDcsHandlerCallStack = [];\n        const _customDcsHandlerA = window.term.parser.registerDcsHandler({intermediates:'+', final: 'p'}, (data, params) => {\n          window._customDcsHandlerCallStack.push(['A', params, data]);\n          return false;\n        });\n        const _customDcsHandlerB = window.term.parser.registerDcsHandler({intermediates:'+', final: 'p'}, (data, params) => {\n          window._customDcsHandlerCallStack.push(['B', params, data]);\n          return true;\n        });\n        const _customDcsHandlerC = window.term.parser.registerDcsHandler({intermediates:'+', final: 'p'}, (data, params) => {\n          window._customDcsHandlerCallStack.push(['C', params, data]);\n          return false;\n        });\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1bP1;2+psome data\x1b\\\\')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customDcsHandlerCallStack")];
                    case 3:
                        _b.apply(_a, [_c.sent(), [
                                ['C', [1, 2], 'some data'],
                                ['B', [1, 2], 'some data']
                            ]]);
                        return [2];
                }
            });
        }); });
        it('async', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customDcsHandlerCallStack = [];\n        const _customDcsHandlerA = window.term.parser.registerDcsHandler({intermediates:'+', final: 'q'}, (data, params) => {\n          window._customDcsHandlerCallStack.push(['A', params, data]);\n          return false;\n        });\n        const _customDcsHandlerB = window.term.parser.registerDcsHandler({intermediates:'+', final: 'q'}, async (data, params) => {\n          await new Promise(res => setTimeout(res, 50));\n          window._customDcsHandlerCallStack.push(['B', params, data]);\n          return false;\n        });\n        const _customDcsHandlerC = window.term.parser.registerDcsHandler({intermediates:'+', final: 'q'}, (data, params) => {\n          window._customDcsHandlerCallStack.push(['C', params, data]);\n          return false;\n        });\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1bP1;2+qsome data\x1b\\\\')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customDcsHandlerCallStack")];
                    case 3:
                        _b.apply(_a, [_c.sent(), [
                                ['C', [1, 2], 'some data'],
                                ['B', [1, 2], 'some data'],
                                ['A', [1, 2], 'some data']
                            ]]);
                        return [2];
                }
            });
        }); });
    });
    describe('registerEscHandler', function () {
        it('should respects return value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customEscHandlerCallStack = [];\n        const _customEscHandlerA = window.term.parser.registerEscHandler({intermediates:'(', final: 'B'}, () => {\n          window._customEscHandlerCallStack.push('A');\n          return false;\n        });\n        const _customEscHandlerB = window.term.parser.registerEscHandler({intermediates:'(', final: 'B'}, () => {\n          window._customEscHandlerCallStack.push('B');\n          return true;\n        });\n        const _customEscHandlerC = window.term.parser.registerEscHandler({intermediates:'(', final: 'B'}, () => {\n          window._customEscHandlerCallStack.push('C');\n          return false;\n        });\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1b(B')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customEscHandlerCallStack")];
                    case 3:
                        _b.apply(_a, [_c.sent(), ['C', 'B']]);
                        return [2];
                }
            });
        }); });
        it('async', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customEscHandlerCallStack = [];\n        const _customEscHandlerA = window.term.parser.registerEscHandler({intermediates:'(', final: 'Z'}, () => {\n          window._customEscHandlerCallStack.push('A');\n          return false;\n        });\n        const _customEscHandlerB = window.term.parser.registerEscHandler({intermediates:'(', final: 'Z'}, async () => {\n          await new Promise(res => setTimeout(res, 50));\n          window._customEscHandlerCallStack.push('B');\n          return false;\n        });\n        const _customEscHandlerC = window.term.parser.registerEscHandler({intermediates:'(', final: 'Z'}, () => {\n          window._customEscHandlerCallStack.push('C');\n          return false;\n        });\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1b(Z')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customEscHandlerCallStack")];
                    case 3:
                        _b.apply(_a, [_c.sent(), ['C', 'B', 'A']]);
                        return [2];
                }
            });
        }); });
    });
    describe('registerOscHandler', function () {
        it('should respects return value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customOscHandlerCallStack = [];\n        const _customOscHandlerA = window.term.parser.registerOscHandler(1234, data => {\n          window._customOscHandlerCallStack.push(['A', data]);\n          return false;\n        });\n        const _customOscHandlerB = window.term.parser.registerOscHandler(1234, data => {\n          window._customOscHandlerCallStack.push(['B', data]);\n          return true;\n        });\n        const _customOscHandlerC = window.term.parser.registerOscHandler(1234, data => {\n          window._customOscHandlerCallStack.push(['C', data]);\n          return false;\n        });\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1b]1234;some data\x07')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customOscHandlerCallStack")];
                    case 3:
                        _b.apply(_a, [_c.sent(), [
                                ['C', 'some data'],
                                ['B', 'some data']
                            ]]);
                        return [2];
                }
            });
        }); });
        it('async', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, page.evaluate("\n        window.term.reset();\n        window._customOscHandlerCallStack = [];\n        const _customOscHandlerA = window.term.parser.registerOscHandler(666, data => {\n          window._customOscHandlerCallStack.push(['A', data]);\n          return false;\n        });\n        const _customOscHandlerB = window.term.parser.registerOscHandler(666, async data => {\n          await new Promise(res => setTimeout(res, 50));\n          window._customOscHandlerCallStack.push(['B', data]);\n          return false;\n        });\n        const _customOscHandlerC = window.term.parser.registerOscHandler(666, data => {\n          window._customOscHandlerCallStack.push(['C', data]);\n          return false;\n        });\n      ")];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\x1b]666;some data\x07')];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window._customOscHandlerCallStack")];
                    case 3:
                        _b.apply(_a, [_c.sent(), [
                                ['C', 'some data'],
                                ['B', 'some data'],
                                ['A', 'some data']
                            ]]);
                        return [2];
                }
            });
        }); });
    });
});
//# sourceMappingURL=Parser.api.js.map