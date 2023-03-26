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
var TestUtils_1 = require("./TestUtils");
var APP = 'http://127.0.0.1:3001/test';
var browser;
var page;
var width = 800;
var height = 600;
describe('CharWidth Integration Tests', function () {
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
                        return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5, cols: 30 })];
                    case 6:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    after(function () {
        browser.close();
    });
    describe('getStringCellWidth', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, page.evaluate("window.term.reset()")];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('ASCII chars', function () {
            return __awaiter(this, void 0, void 0, function () {
                var input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input = 'This is just ASCII text.#';
                            return [4, page.evaluate("window.term.write('".concat(input, "')"))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return sumWidths(0, 1, '#'); }, 25)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('combining chars', function () {
            return __awaiter(this, void 0, void 0, function () {
                var input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input = 'e\u0301e\u0301e\u0301e\u0301e\u0301e\u0301e\u0301e\u0301e\u0301#';
                            return [4, page.evaluate("window.term.write('".concat(input, "')"))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return sumWidths(0, 1, '#'); }, 10)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('surrogate chars', function () {
            return __awaiter(this, void 0, void 0, function () {
                var input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input = '𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞𝄞#';
                            return [4, page.evaluate("window.term.write('".concat(input, "')"))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return sumWidths(0, 1, '#'); }, 28)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('surrogate combining chars', function () {
            return __awaiter(this, void 0, void 0, function () {
                var input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input = '𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301𓂀\u0301#';
                            return [4, page.evaluate("window.term.write('".concat(input, "')"))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return sumWidths(0, 1, '#'); }, 12)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('fullwidth chars', function () {
            return __awaiter(this, void 0, void 0, function () {
                var input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input = '１２３４５６７８９０#';
                            return [4, page.evaluate("window.term.write('".concat(input, "')"))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return sumWidths(0, 1, '#'); }, 21)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('fullwidth chars offset 1', function () {
            return __awaiter(this, void 0, void 0, function () {
                var input;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            input = 'a１２３４５６７８９０#';
                            return [4, page.evaluate("window.term.write('".concat(input, "')"))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return sumWidths(0, 1, '#'); }, 22)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
    });
});
function sumWidths(start, end, sentinel) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.evaluate("\n    (function() {\n      window.result = 0;\n      const buffer = window.term.buffer.active;\n      for (let i = ".concat(start, "; i < ").concat(end, "; i++) {\n        const line = buffer.getLine(i);\n        let j = 0;\n        while (true) {\n          const cell = line.getCell(j++);\n          if (!cell) {\n            break;\n          }\n          window.result += cell.getWidth();\n          if (cell.getChars() === '").concat(sentinel, "') {\n            return;\n          }\n        }\n      }\n    })();\n  "))];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("window.result")];
                case 2: return [2, _a.sent()];
            }
        });
    });
}
//# sourceMappingURL=CharWidth.api.js.map