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
var assert_1 = require("assert");
var APP = 'http://127.0.0.1:3001/test';
var browser;
var page;
var width = 800;
var height = 600;
describe('API Integration Tests', function () {
    var _this = this;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
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
                    return [2];
            }
        });
    }); });
    after(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, browser.close()];
    }); }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, page.goto(APP)];
    }); }); });
    it('Default options', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _e.sent();
                    _b = (_a = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.cols")];
                case 2:
                    _b.apply(_a, [_e.sent(), 80]);
                    _d = (_c = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.rows")];
                case 3:
                    _d.apply(_c, [_e.sent(), 24]);
                    return [2];
            }
        });
    }); });
    it('Proposed API check', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page, { allowProposedApi: false })];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      try {\n        window.term.markers;\n      } catch (e) {\n        window.throwMessage = e.message;\n      }\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, 'window.throwMessage', 'You must set the allowProposedApi option to true to use proposed API')];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('write', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.write('foo');\n      window.term.write('bar');\n      window.term.write('\u6587');\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'foobar文')];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('write with callback', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.write('foo', () => { window.__x = 'a'; });\n      window.term.write('bar', () => { window.__x += 'b'; });\n      window.term.write('\u6587', () => { window.__x += 'c'; });\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'foobar文')];
                case 3:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.__x", 'abc')];
                case 4:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('write - bytes (UTF8)', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.write(new Uint8Array([102, 111, 111])); // foo\n      window.term.write(new Uint8Array([98, 97, 114])); // bar\n      window.term.write(new Uint8Array([230, 150, 135])); // \u6587\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'foobar文')];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('write - bytes (UTF8) with callback', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.write(new Uint8Array([102, 111, 111]), () => { window.__x = 'A'; }); // foo\n      window.term.write(new Uint8Array([98, 97, 114]), () => { window.__x += 'B'; }); // bar\n      window.term.write(new Uint8Array([230, 150, 135]), () => { window.__x += 'C'; }); // \u6587\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'foobar文')];
                case 3:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.__x", 'ABC')];
                case 4:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('writeln', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.writeln('foo');\n      window.term.writeln('bar');\n      window.term.writeln('\u6587');\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'foo')];
                case 3:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(1).translateToString(true)", 'bar')];
                case 4:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(2).translateToString(true)", '文')];
                case 5:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('writeln with callback', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.writeln('foo', () => { window.__x = '1'; });\n      window.term.writeln('bar', () => { window.__x += '2'; });\n      window.term.writeln('\u6587', () => { window.__x += '3'; });\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'foo')];
                case 3:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(1).translateToString(true)", 'bar')];
                case 4:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(2).translateToString(true)", '文')];
                case 5:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.__x", '123')];
                case 6:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('writeln - bytes (UTF8)', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.writeln(new Uint8Array([102, 111, 111]));\n      window.term.writeln(new Uint8Array([98, 97, 114]));\n      window.term.writeln(new Uint8Array([230, 150, 135]));\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'foo')];
                case 3:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(1).translateToString(true)", 'bar')];
                case 4:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(2).translateToString(true)", '文')];
                case 5:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('paste', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.calls = [];\n      window.term.onData(e => calls.push(e));\n      window.term.paste('foo');\n      window.term.paste('\\r\\nfoo\\nbar\\r');\n      window.term.write('\\x1b[?2004h', () => {\n        window.term.paste('foo');\n      });\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['foo', '\rfoo\rbar\r', '\x1b[200~foo\x1b[201~'])];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    it('clear', function () { return __awaiter(_this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5 })];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("\n      window.term.write('test0');\n      window.parsed = 0;\n      for (let i = 1; i < 10; i++) {\n        window.term.write('\\n\\rtest' + i, () => window.parsed++);\n      }\n    ")];
                case 2:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.parsed", 9)];
                case 3:
                    _a.sent();
                    return [4, page.evaluate("window.term.clear()")];
                case 4:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.length", 5)];
                case 5:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(0).translateToString(true)", 'test9')];
                case 6:
                    _a.sent();
                    i = 1;
                    _a.label = 7;
                case 7:
                    if (!(i < 5)) return [3, 10];
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term.buffer.active.getLine(".concat(i, ").translateToString(true)"), '')];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    i++;
                    return [3, 7];
                case 10: return [2];
            }
        });
    }); });
    describe('options', function () {
        it('getter', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.options.cols")];
                    case 2:
                        _b.apply(_a, [_e.sent(), 80]);
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.options.rows")];
                    case 3:
                        _d.apply(_c, [_e.sent(), 24]);
                        return [2];
                }
            });
        }); });
        it('setter', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _j.sent();
                        _j.label = 2;
                    case 2:
                        _j.trys.push([2, 4, , 5]);
                        return [4, page.evaluate('window.term.options.cols = 40')];
                    case 3:
                        _j.sent();
                        (0, assert_1.fail)();
                        return [3, 5];
                    case 4:
                        _a = _j.sent();
                        return [3, 5];
                    case 5:
                        _j.trys.push([5, 7, , 8]);
                        return [4, page.evaluate('window.term.options.rows = 20')];
                    case 6:
                        _j.sent();
                        (0, assert_1.fail)();
                        return [3, 8];
                    case 7:
                        _b = _j.sent();
                        return [3, 8];
                    case 8: return [4, page.evaluate('window.term.options.scrollback = 1')];
                    case 9:
                        _j.sent();
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.options.scrollback")];
                    case 10:
                        _d.apply(_c, [_j.sent(), 1]);
                        return [4, page.evaluate("\n        window.term.options = {\n          fontSize: 30,\n          fontFamily: 'Arial'\n        };\n      ")];
                    case 11:
                        _j.sent();
                        _f = (_e = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.options.fontSize")];
                    case 12:
                        _f.apply(_e, [_j.sent(), 30]);
                        _h = (_g = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.options.fontFamily")];
                    case 13:
                        _h.apply(_g, [_j.sent(), 'Arial']);
                        return [2];
                }
            });
        }); });
        it('object.keys return the correct number of options', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _c.sent();
                        _b = (_a = chai_1.assert).notEqual;
                        return [4, page.evaluate("Object.keys(window.term.options).length")];
                    case 2:
                        _b.apply(_a, [_c.sent(), 0]);
                        return [2];
                }
            });
        }); });
    });
    describe('renderer', function () {
        it('foreground', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[30m0\\x1b[31m1\\x1b[32m2\\x1b[33m3\\x1b[34m4\\x1b[35m5\\x1b[36m6\\x1b[37m7')];
                    case 2:
                        _c.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "document.querySelectorAll('.xterm-rows > :nth-child(1) > *').length", 9)];
                    case 3:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("\n        [\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(1)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(2)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(3)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(4)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(5)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(6)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(7)').className\n        ]\n      ")];
                    case 4:
                        _b.apply(_a, [_c.sent(), [
                                'xterm-fg-0',
                                'xterm-fg-1',
                                'xterm-fg-2',
                                'xterm-fg-3',
                                'xterm-fg-4',
                                'xterm-fg-5',
                                'xterm-fg-6'
                            ]]);
                        return [2];
                }
            });
        }); });
        it('background', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _c.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[40m0\\x1b[41m1\\x1b[42m2\\x1b[43m3\\x1b[44m4\\x1b[45m5\\x1b[46m6\\x1b[47m7')];
                    case 2:
                        _c.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "document.querySelectorAll('.xterm-rows > :nth-child(1) > *').length", 9)];
                    case 3:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("\n        [\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(1)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(2)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(3)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(4)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(5)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(6)').className,\n          document.querySelector('.xterm-rows > :nth-child(1) > :nth-child(7)').className\n        ]\n      ")];
                    case 4:
                        _b.apply(_a, [_c.sent(), [
                                'xterm-bg-0',
                                'xterm-bg-1',
                                'xterm-bg-2',
                                'xterm-bg-3',
                                'xterm-bg-4',
                                'xterm-bg-5',
                                'xterm-bg-6'
                            ]]);
                        return [2];
                }
            });
        }); });
    });
    it('selection', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5, cols: 5 })];
                case 1:
                    _2.sent();
                    return [4, (0, TestUtils_1.writeSync)(page, "\\n\\nfoo\\n\\n\\rbar\\n\\n\\rbaz")];
                case 2:
                    _2.sent();
                    _b = (_a = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.hasSelection()")];
                case 3:
                    _b.apply(_a, [_2.sent(), false]);
                    _d = (_c = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.getSelection()")];
                case 4:
                    _d.apply(_c, [_2.sent(), '']);
                    _f = (_e = chai_1.assert).deepEqual;
                    return [4, page.evaluate("window.term.getSelectionPosition()")];
                case 5:
                    _f.apply(_e, [_2.sent(), undefined]);
                    return [4, page.evaluate("window.term.selectAll()")];
                case 6:
                    _2.sent();
                    _h = (_g = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.hasSelection()")];
                case 7:
                    _h.apply(_g, [_2.sent(), true]);
                    if (!(process.platform === 'win32')) return [3, 9];
                    _k = (_j = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.getSelection()")];
                case 8:
                    _k.apply(_j, [_2.sent(), '\r\n\r\nfoo\r\n\r\nbar\r\n\r\nbaz']);
                    return [3, 11];
                case 9:
                    _m = (_l = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.getSelection()")];
                case 10:
                    _m.apply(_l, [_2.sent(), '\n\nfoo\n\nbar\n\nbaz']);
                    _2.label = 11;
                case 11:
                    _p = (_o = chai_1.assert).deepEqual;
                    return [4, page.evaluate("window.term.getSelectionPosition()")];
                case 12:
                    _p.apply(_o, [_2.sent(), { start: { x: 0, y: 0 }, end: { x: 5, y: 6 } }]);
                    return [4, page.evaluate("window.term.clearSelection()")];
                case 13:
                    _2.sent();
                    _r = (_q = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.hasSelection()")];
                case 14:
                    _r.apply(_q, [_2.sent(), false]);
                    _t = (_s = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.getSelection()")];
                case 15:
                    _t.apply(_s, [_2.sent(), '']);
                    _v = (_u = chai_1.assert).deepEqual;
                    return [4, page.evaluate("window.term.getSelectionPosition()")];
                case 16:
                    _v.apply(_u, [_2.sent(), undefined]);
                    return [4, page.evaluate("window.term.select(1, 2, 2)")];
                case 17:
                    _2.sent();
                    _x = (_w = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.hasSelection()")];
                case 18:
                    _x.apply(_w, [_2.sent(), true]);
                    _z = (_y = chai_1.assert).equal;
                    return [4, page.evaluate("window.term.getSelection()")];
                case 19:
                    _z.apply(_y, [_2.sent(), 'oo']);
                    _1 = (_0 = chai_1.assert).deepEqual;
                    return [4, page.evaluate("window.term.getSelectionPosition()")];
                case 20:
                    _1.apply(_0, [_2.sent(), { start: { x: 1, y: 2 }, end: { x: 3, y: 2 } }]);
                    return [2];
            }
        });
    }); });
    it('focus, blur', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _g.sent();
                    _b = (_a = chai_1.assert).equal;
                    return [4, page.evaluate("document.activeElement.className")];
                case 2:
                    _b.apply(_a, [_g.sent(), '']);
                    return [4, page.evaluate("window.term.focus()")];
                case 3:
                    _g.sent();
                    _d = (_c = chai_1.assert).equal;
                    return [4, page.evaluate("document.activeElement.className")];
                case 4:
                    _d.apply(_c, [_g.sent(), 'xterm-helper-textarea']);
                    return [4, page.evaluate("window.term.blur()")];
                case 5:
                    _g.sent();
                    _f = (_e = chai_1.assert).equal;
                    return [4, page.evaluate("document.activeElement.className")];
                case 6:
                    _f.apply(_e, [_g.sent(), '']);
                    return [2];
            }
        });
    }); });
    describe('loadAddon', function () {
        it('constructor', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page, { cols: 5 })];
                    case 1:
                        _c.sent();
                        return [4, page.evaluate("\n        window.cols = 0;\n        window.term.loadAddon({\n          activate: (t) => window.cols = t.cols,\n          dispose: () => {}\n        });\n      ")];
                    case 2:
                        _c.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.cols")];
                    case 3:
                        _b.apply(_a, [_c.sent(), 5]);
                        return [2];
                }
            });
        }); });
        it('dispose (addon)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, page.evaluate("\n        window.disposeCalled = false\n        window.addon = {\n          activate: () => {},\n          dispose: () => window.disposeCalled = true\n        };\n        window.term.loadAddon(window.addon);\n      ")];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.disposeCalled")];
                    case 3:
                        _b.apply(_a, [_e.sent(), false]);
                        return [4, page.evaluate("window.addon.dispose()")];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.disposeCalled")];
                    case 5:
                        _d.apply(_c, [_e.sent(), true]);
                        return [2];
                }
            });
        }); });
        it('dispose (terminal)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, page.evaluate("\n        window.disposeCalled = false\n        window.term.loadAddon({\n          activate: () => {},\n          dispose: () => window.disposeCalled = true\n        });\n      ")];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.disposeCalled")];
                    case 3:
                        _b.apply(_a, [_e.sent(), false]);
                        return [4, page.evaluate("window.term.dispose()")];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.disposeCalled")];
                    case 5:
                        _d.apply(_c, [_e.sent(), true]);
                        return [2];
                }
            });
        }); });
    });
    describe('Events', function () {
        it('onCursorMove', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate("\n        window.callCount = 0;\n        window.term.onCursorMove(e => window.callCount++);\n        window.term.write('foo');\n      ")];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.callCount", 1)];
                    case 3:
                        _a.sent();
                        return [4, page.evaluate("window.term.write('bar')")];
                    case 4:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.callCount", 2)];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('onData', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _c.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.term.onData(e => calls.push(e));\n      ")];
                    case 2:
                        _c.sent();
                        return [4, page.type('.xterm-helper-textarea', 'foo')];
                    case 3:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window.calls")];
                    case 4:
                        _b.apply(_a, [_c.sent(), ['f', 'o', 'o']]);
                        return [2];
                }
            });
        }); });
        it('onKey', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _c.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.term.onKey(e => calls.push(e.key));\n      ")];
                    case 2:
                        _c.sent();
                        return [4, page.type('.xterm-helper-textarea', 'foo')];
                    case 3:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepEqual;
                        return [4, page.evaluate("window.calls")];
                    case 4:
                        _b.apply(_a, [_c.sent(), ['f', 'o', 'o']]);
                        return [2];
                }
            });
        }); });
        it('onLineFeed', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate("\n        window.callCount = 0;\n        window.term.onLineFeed(() => callCount++);\n        window.term.writeln('foo');\n      ")];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.callCount", 1)];
                    case 3:
                        _a.sent();
                        return [4, page.evaluate("window.term.writeln('bar')")];
                    case 4:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.callCount", 2)];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('onScroll', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5 })];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.term.onScroll(e => window.calls.push(e));\n        for (let i = 0; i < 4; i++) {\n          window.term.writeln('foo');\n        }\n      ")];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [])];
                    case 3:
                        _a.sent();
                        return [4, page.evaluate("window.term.writeln('bar')")];
                    case 4:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [1])];
                    case 5:
                        _a.sent();
                        return [4, page.evaluate("window.term.writeln('baz')")];
                    case 6:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [1, 2])];
                    case 7:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('onSelectionChange', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate("\n        window.callCount = 0;\n        window.term.onSelectionChange(() => window.callCount++);\n      ")];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.callCount", 0)];
                    case 3:
                        _a.sent();
                        return [4, page.evaluate("window.term.selectAll()")];
                    case 4:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.callCount", 1)];
                    case 5:
                        _a.sent();
                        return [4, page.evaluate("window.term.clearSelection()")];
                    case 6:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.callCount", 2)];
                    case 7:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('onRender', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.retries(3);
                            return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.timeout)(20)];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("\n        window.calls = [];\n        window.term.onRender(e => window.calls.push([e.start, e.end]));\n      ")];
                        case 3:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [])];
                        case 4:
                            _a.sent();
                            return [4, page.evaluate("window.term.write('foo')")];
                        case 5:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [[0, 0]])];
                        case 6:
                            _a.sent();
                            return [4, page.evaluate("window.term.write('bar\\n\\nbaz')")];
                        case 7:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [[0, 0], [0, 2]])];
                        case 8:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('onResize', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, (0, TestUtils_1.timeout)(20)];
                    case 2:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.term.onResize(e => window.calls.push([e.cols, e.rows]));\n      ")];
                    case 3:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [])];
                    case 4:
                        _a.sent();
                        return [4, page.evaluate("window.term.resize(10, 5)")];
                    case 5:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [[10, 5]])];
                    case 6:
                        _a.sent();
                        return [4, page.evaluate("window.term.resize(20, 15)")];
                    case 7:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [[10, 5], [20, 15]])];
                    case 8:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('onTitleChange', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.term.onTitleChange(e => window.calls.push(e));\n      ")];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [])];
                    case 3:
                        _a.sent();
                        return [4, page.evaluate("window.term.write('\\x1b]2;foo\\x9c')")];
                    case 4:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['foo'])];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('onBell', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.term.onBell(() => window.calls.push(true));\n      ")];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [])];
                    case 3:
                        _a.sent();
                        return [4, page.evaluate("window.term.write('\\x07')")];
                    case 4:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [true])];
                    case 5:
                        _a.sent();
                        return [2];
                }
            });
        }); });
    });
    describe('buffer', function () {
        it('cursorX, cursorY', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
            return __generator(this, function (_0) {
                switch (_0.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5, cols: 5 })];
                    case 1:
                        _0.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorX")];
                    case 2:
                        _b.apply(_a, [_0.sent(), 0]);
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorY")];
                    case 3:
                        _d.apply(_c, [_0.sent(), 0]);
                        return [4, (0, TestUtils_1.writeSync)(page, 'foo')];
                    case 4:
                        _0.sent();
                        _f = (_e = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorX")];
                    case 5:
                        _f.apply(_e, [_0.sent(), 3]);
                        _h = (_g = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorY")];
                    case 6:
                        _h.apply(_g, [_0.sent(), 0]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n')];
                    case 7:
                        _0.sent();
                        _k = (_j = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorX")];
                    case 8:
                        _k.apply(_j, [_0.sent(), 3]);
                        _m = (_l = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorY")];
                    case 9:
                        _m.apply(_l, [_0.sent(), 1]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\r')];
                    case 10:
                        _0.sent();
                        _p = (_o = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorX")];
                    case 11:
                        _p.apply(_o, [_0.sent(), 0]);
                        _r = (_q = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorY")];
                    case 12:
                        _r.apply(_q, [_0.sent(), 1]);
                        return [4, (0, TestUtils_1.writeSync)(page, 'abcde')];
                    case 13:
                        _0.sent();
                        _t = (_s = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorX")];
                    case 14:
                        _t.apply(_s, [_0.sent(), 5]);
                        _v = (_u = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorY")];
                    case 15:
                        _v.apply(_u, [_0.sent(), 1]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n\\r\\n\\n\\n\\n\\n')];
                    case 16:
                        _0.sent();
                        _x = (_w = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorX")];
                    case 17:
                        _x.apply(_w, [_0.sent(), 0]);
                        _z = (_y = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.cursorY")];
                    case 18:
                        _z.apply(_y, [_0.sent(), 4]);
                        return [2];
                }
            });
        }); });
        it('viewportY', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5 })];
                    case 1:
                        _o.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.viewportY")];
                    case 2:
                        _b.apply(_a, [_o.sent(), 0]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                    case 3:
                        _o.sent();
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.viewportY")];
                    case 4:
                        _d.apply(_c, [_o.sent(), 0]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n')];
                    case 5:
                        _o.sent();
                        _f = (_e = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.viewportY")];
                    case 6:
                        _f.apply(_e, [_o.sent(), 1]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                    case 7:
                        _o.sent();
                        _h = (_g = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.viewportY")];
                    case 8:
                        _h.apply(_g, [_o.sent(), 5]);
                        return [4, page.evaluate("window.term.scrollLines(-1)")];
                    case 9:
                        _o.sent();
                        _k = (_j = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.viewportY")];
                    case 10:
                        _k.apply(_j, [_o.sent(), 4]);
                        return [4, page.evaluate("window.term.scrollToTop()")];
                    case 11:
                        _o.sent();
                        _m = (_l = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.viewportY")];
                    case 12:
                        _m.apply(_l, [_o.sent(), 0]);
                        return [2];
                }
            });
        }); });
        it('baseY', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5 })];
                    case 1:
                        _o.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.baseY")];
                    case 2:
                        _b.apply(_a, [_o.sent(), 0]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                    case 3:
                        _o.sent();
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.baseY")];
                    case 4:
                        _d.apply(_c, [_o.sent(), 0]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n')];
                    case 5:
                        _o.sent();
                        _f = (_e = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.baseY")];
                    case 6:
                        _f.apply(_e, [_o.sent(), 1]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                    case 7:
                        _o.sent();
                        _h = (_g = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.baseY")];
                    case 8:
                        _h.apply(_g, [_o.sent(), 5]);
                        return [4, page.evaluate("window.term.scrollLines(-1)")];
                    case 9:
                        _o.sent();
                        _k = (_j = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.baseY")];
                    case 10:
                        _k.apply(_j, [_o.sent(), 5]);
                        return [4, page.evaluate("window.term.scrollToTop()")];
                    case 11:
                        _o.sent();
                        _m = (_l = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.baseY")];
                    case 12:
                        _m.apply(_l, [_o.sent(), 5]);
                        return [2];
                }
            });
        }); });
        it('length', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5 })];
                    case 1:
                        _j.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.length")];
                    case 2:
                        _b.apply(_a, [_j.sent(), 5]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                    case 3:
                        _j.sent();
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.length")];
                    case 4:
                        _d.apply(_c, [_j.sent(), 5]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n')];
                    case 5:
                        _j.sent();
                        _f = (_e = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.length")];
                    case 6:
                        _f.apply(_e, [_j.sent(), 6]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                    case 7:
                        _j.sent();
                        _h = (_g = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.length")];
                    case 8:
                        _h.apply(_g, [_j.sent(), 10]);
                        return [2];
                }
            });
        }); });
        describe('getLine', function () {
            it('invalid index', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page, { rows: 5 })];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(-1)")];
                        case 2:
                            _b.apply(_a, [_e.sent(), undefined]);
                            _d = (_c = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(5)")];
                        case 3:
                            _d.apply(_c, [_e.sent(), undefined]);
                            return [2];
                    }
                });
            }); });
            it('isWrapped', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    switch (_o.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page, { cols: 5 })];
                        case 1:
                            _o.sent();
                            _b = (_a = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).isWrapped")];
                        case 2:
                            _b.apply(_a, [_o.sent(), false]);
                            _d = (_c = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(1).isWrapped")];
                        case 3:
                            _d.apply(_c, [_o.sent(), false]);
                            return [4, (0, TestUtils_1.writeSync)(page, 'abcde')];
                        case 4:
                            _o.sent();
                            _f = (_e = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).isWrapped")];
                        case 5:
                            _f.apply(_e, [_o.sent(), false]);
                            _h = (_g = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(1).isWrapped")];
                        case 6:
                            _h.apply(_g, [_o.sent(), false]);
                            return [4, (0, TestUtils_1.writeSync)(page, 'f')];
                        case 7:
                            _o.sent();
                            _k = (_j = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).isWrapped")];
                        case 8:
                            _k.apply(_j, [_o.sent(), false]);
                            _m = (_l = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(1).isWrapped")];
                        case 9:
                            _m.apply(_l, [_o.sent(), true]);
                            return [2];
                    }
                });
            }); });
            it('translateToString', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                return __generator(this, function (_u) {
                    switch (_u.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page, { cols: 5 })];
                        case 1:
                            _u.sent();
                            _b = (_a = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString()")];
                        case 2:
                            _b.apply(_a, [_u.sent(), '     ']);
                            _d = (_c = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString(true)")];
                        case 3:
                            _d.apply(_c, [_u.sent(), '']);
                            return [4, (0, TestUtils_1.writeSync)(page, 'foo')];
                        case 4:
                            _u.sent();
                            _f = (_e = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString()")];
                        case 5:
                            _f.apply(_e, [_u.sent(), 'foo  ']);
                            _h = (_g = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString(true)")];
                        case 6:
                            _h.apply(_g, [_u.sent(), 'foo']);
                            return [4, (0, TestUtils_1.writeSync)(page, 'bar')];
                        case 7:
                            _u.sent();
                            _k = (_j = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString()")];
                        case 8:
                            _k.apply(_j, [_u.sent(), 'fooba']);
                            _m = (_l = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString(true)")];
                        case 9:
                            _m.apply(_l, [_u.sent(), 'fooba']);
                            _p = (_o = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(1).translateToString(true)")];
                        case 10:
                            _p.apply(_o, [_u.sent(), 'r']);
                            _r = (_q = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString(false, 1)")];
                        case 11:
                            _r.apply(_q, [_u.sent(), 'ooba']);
                            _t = (_s = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString(false, 1, 3)")];
                        case 12:
                            _t.apply(_s, [_u.sent(), 'oo']);
                            return [2];
                    }
                });
            }); });
            it('getCell', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
                return __generator(this, function (_w) {
                    switch (_w.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page, { cols: 5 })];
                        case 1:
                            _w.sent();
                            _b = (_a = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(-1)")];
                        case 2:
                            _b.apply(_a, [_w.sent(), undefined]);
                            _d = (_c = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(5)")];
                        case 3:
                            _d.apply(_c, [_w.sent(), undefined]);
                            _f = (_e = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(0).getChars()")];
                        case 4:
                            _f.apply(_e, [_w.sent(), '']);
                            _h = (_g = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(0).getWidth()")];
                        case 5:
                            _h.apply(_g, [_w.sent(), 1]);
                            return [4, (0, TestUtils_1.writeSync)(page, 'a文')];
                        case 6:
                            _w.sent();
                            _k = (_j = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(0).getChars()")];
                        case 7:
                            _k.apply(_j, [_w.sent(), 'a']);
                            _m = (_l = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(0).getWidth()")];
                        case 8:
                            _m.apply(_l, [_w.sent(), 1]);
                            _p = (_o = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(1).getChars()")];
                        case 9:
                            _p.apply(_o, [_w.sent(), '文']);
                            _r = (_q = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(1).getWidth()")];
                        case 10:
                            _r.apply(_q, [_w.sent(), 2]);
                            _t = (_s = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(2).getChars()")];
                        case 11:
                            _t.apply(_s, [_w.sent(), '']);
                            _v = (_u = chai_1.assert).equal;
                            return [4, page.evaluate("window.term.buffer.active.getLine(0).getCell(2).getWidth()")];
                        case 12:
                            _v.apply(_u, [_w.sent(), 0]);
                            return [2];
                    }
                });
            }); });
            it('clearMarkers', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page, { cols: 5 })];
                        case 1:
                            _c.sent();
                            return [4, page.evaluate("\n          window.disposeStack = [];\n          ")];
                        case 2:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                        case 3:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                        case 4:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                        case 5:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\\n\\n\\n\\n')];
                        case 6:
                            _c.sent();
                            return [4, page.evaluate("window.term.registerMarker(1)")];
                        case 7:
                            _c.sent();
                            return [4, page.evaluate("window.term.registerMarker(2)")];
                        case 8:
                            _c.sent();
                            return [4, page.evaluate("window.term.scrollLines(10)")];
                        case 9:
                            _c.sent();
                            return [4, page.evaluate("window.term.registerMarker(3)")];
                        case 10:
                            _c.sent();
                            return [4, page.evaluate("window.term.registerMarker(4)")];
                        case 11:
                            _c.sent();
                            return [4, page.evaluate("\n          for (let i = 0; i < window.term.markers.length; ++i) {\n              const marker = window.term.markers[i];\n              marker.onDispose(() => window.disposeStack.push(marker));\n          }")];
                        case 12:
                            _c.sent();
                            return [4, page.evaluate("window.term.clear()")];
                        case 13:
                            _c.sent();
                            _b = (_a = chai_1.assert).equal;
                            return [4, page.evaluate("window.disposeStack.length")];
                        case 14:
                            _b.apply(_a, [_c.sent(), 4]);
                            return [2];
                    }
                });
            }); });
        });
        it('active, normal, alternate', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
            return __generator(this, function (_14) {
                switch (_14.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page, { cols: 5 })];
                    case 1:
                        _14.sent();
                        _b = (_a = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.type")];
                    case 2:
                        _b.apply(_a, [_14.sent(), 'normal']);
                        _d = (_c = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.normal.type")];
                    case 3:
                        _d.apply(_c, [_14.sent(), 'normal']);
                        _f = (_e = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.alternate.type")];
                    case 4:
                        _f.apply(_e, [_14.sent(), 'alternate']);
                        return [4, (0, TestUtils_1.writeSync)(page, 'norm ')];
                    case 5:
                        _14.sent();
                        _h = (_g = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString()")];
                    case 6:
                        _h.apply(_g, [_14.sent(), 'norm ']);
                        _k = (_j = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.normal.getLine(0).translateToString()")];
                    case 7:
                        _k.apply(_j, [_14.sent(), 'norm ']);
                        _m = (_l = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.alternate.getLine(0)")];
                    case 8:
                        _m.apply(_l, [_14.sent(), undefined]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?47h\\r')];
                    case 9:
                        _14.sent();
                        _p = (_o = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.type")];
                    case 10:
                        _p.apply(_o, [_14.sent(), 'alternate']);
                        _r = (_q = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.normal.type")];
                    case 11:
                        _r.apply(_q, [_14.sent(), 'normal']);
                        _t = (_s = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.alternate.type")];
                    case 12:
                        _t.apply(_s, [_14.sent(), 'alternate']);
                        _v = (_u = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString()")];
                    case 13:
                        _v.apply(_u, [_14.sent(), '     ']);
                        return [4, (0, TestUtils_1.writeSync)(page, 'alt  ')];
                    case 14:
                        _14.sent();
                        _x = (_w = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString()")];
                    case 15:
                        _x.apply(_w, [_14.sent(), 'alt  ']);
                        _z = (_y = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.normal.getLine(0).translateToString()")];
                    case 16:
                        _z.apply(_y, [_14.sent(), 'norm ']);
                        _1 = (_0 = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.alternate.getLine(0).translateToString()")];
                    case 17:
                        _1.apply(_0, [_14.sent(), 'alt  ']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?47l\\r')];
                    case 18:
                        _14.sent();
                        _3 = (_2 = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.type")];
                    case 19:
                        _3.apply(_2, [_14.sent(), 'normal']);
                        _5 = (_4 = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.normal.type")];
                    case 20:
                        _5.apply(_4, [_14.sent(), 'normal']);
                        _7 = (_6 = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.alternate.type")];
                    case 21:
                        _7.apply(_6, [_14.sent(), 'alternate']);
                        _9 = (_8 = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.active.getLine(0).translateToString()")];
                    case 22:
                        _9.apply(_8, [_14.sent(), 'norm ']);
                        _11 = (_10 = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.normal.getLine(0).translateToString()")];
                    case 23:
                        _11.apply(_10, [_14.sent(), 'norm ']);
                        _13 = (_12 = chai_1.assert).equal;
                        return [4, page.evaluate("window.term.buffer.alternate.getLine(0)")];
                    case 24:
                        _13.apply(_12, [_14.sent(), undefined]);
                        return [2];
                }
            });
        }); });
    });
    describe('modes', function () {
        it('defaults', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _c.sent();
                        _b = (_a = chai_1.assert).deepStrictEqual;
                        return [4, page.evaluate("window.term.modes")];
                    case 2:
                        _b.apply(_a, [_c.sent(), {
                                applicationCursorKeysMode: false,
                                applicationKeypadMode: false,
                                bracketedPasteMode: false,
                                insertMode: false,
                                mouseTrackingMode: 'none',
                                originMode: false,
                                reverseWraparoundMode: false,
                                sendFocusMode: false,
                                wraparoundMode: true
                            }]);
                        return [2];
                }
            });
        }); });
        it('applicationCursorKeysMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.applicationCursorKeysMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.applicationCursorKeysMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
        it('applicationKeypadMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?66h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.applicationKeypadMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?66l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.applicationKeypadMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
        it('bracketedPasteMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?2004h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.bracketedPasteMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?2004l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.bracketedPasteMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
        it('insertMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[4h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.insertMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[4l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.insertMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
        it('mouseTrackingMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _s.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?9h')];
                    case 2:
                        _s.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 3:
                        _b.apply(_a, [_s.sent(), 'x10']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?9l')];
                    case 4:
                        _s.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 5:
                        _d.apply(_c, [_s.sent(), 'none']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1000h')];
                    case 6:
                        _s.sent();
                        _f = (_e = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 7:
                        _f.apply(_e, [_s.sent(), 'vt200']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1000l')];
                    case 8:
                        _s.sent();
                        _h = (_g = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 9:
                        _h.apply(_g, [_s.sent(), 'none']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1002h')];
                    case 10:
                        _s.sent();
                        _k = (_j = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 11:
                        _k.apply(_j, [_s.sent(), 'drag']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1002l')];
                    case 12:
                        _s.sent();
                        _m = (_l = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 13:
                        _m.apply(_l, [_s.sent(), 'none']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1003h')];
                    case 14:
                        _s.sent();
                        _p = (_o = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 15:
                        _p.apply(_o, [_s.sent(), 'any']);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1003l')];
                    case 16:
                        _s.sent();
                        _r = (_q = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.mouseTrackingMode")];
                    case 17:
                        _r.apply(_q, [_s.sent(), 'none']);
                        return [2];
                }
            });
        }); });
        it('originMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?6h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.originMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?6l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.originMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
        it('reverseWraparoundMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?45h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.reverseWraparoundMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?45l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.reverseWraparoundMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
        it('sendFocusMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1004h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.sendFocusMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?1004l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.sendFocusMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
        it('wraparoundMode', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _e.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?7h')];
                    case 2:
                        _e.sent();
                        _b = (_a = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.wraparoundMode")];
                    case 3:
                        _b.apply(_a, [_e.sent(), true]);
                        return [4, (0, TestUtils_1.writeSync)(page, '\\x1b[?7l')];
                    case 4:
                        _e.sent();
                        _d = (_c = chai_1.assert).strictEqual;
                        return [4, page.evaluate("window.term.modes.wraparoundMode")];
                    case 5:
                        _d.apply(_c, [_e.sent(), false]);
                        return [2];
                }
            });
        }); });
    });
    it('dispose', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, page.evaluate("\n      window.term = new Terminal();\n      window.term.dispose();\n    ")];
                case 1:
                    _c.sent();
                    _b = (_a = chai_1.assert).equal;
                    return [4, page.evaluate("window.term._core._isDisposed")];
                case 2:
                    _b.apply(_a, [_c.sent(), true]);
                    return [2];
            }
        });
    }); });
    it('dispose (opened)', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                case 1:
                    _c.sent();
                    return [4, page.evaluate("window.term.dispose()")];
                case 2:
                    _c.sent();
                    _b = (_a = chai_1.assert).equal;
                    return [4, page.evaluate("window.term._core._isDisposed")];
                case 3:
                    _b.apply(_a, [_c.sent(), true]);
                    return [2];
            }
        });
    }); });
    it('render when visible after hidden', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.evaluate("document.querySelector('#terminal-container').style.display='none'")];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("window.term = new Terminal()")];
                case 2:
                    _a.sent();
                    return [4, page.evaluate("window.term.open(document.querySelector('#terminal-container'))")];
                case 3:
                    _a.sent();
                    return [4, page.evaluate("document.querySelector('#terminal-container').style.display=''")];
                case 4:
                    _a.sent();
                    return [4, (0, TestUtils_1.pollFor)(page, "window.term._core._renderService.dimensions.css.cell.width > 0", true)];
                case 5:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    describe('registerDecoration', function () {
        describe('bufferDecorations', function () {
            it('should register decorations and render them when terminal open is called', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 1:
                            _a.sent();
                            return [4, page.evaluate("window.marker1 = window.term.registerMarker(1)")];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("window.marker2 = window.term.registerMarker(2)")];
                        case 3:
                            _a.sent();
                            return [4, page.evaluate("window.term.registerDecoration({ marker: window.marker1 })")];
                        case 4:
                            _a.sent();
                            return [4, page.evaluate("window.term.registerDecoration({ marker: window.marker2 })")];
                        case 5:
                            _a.sent();
                            return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, "document.querySelectorAll('.xterm-screen .xterm-decoration').length", 2)];
                        case 7:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            it('should return undefined when the marker has already been disposed of', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 1:
                            _a.sent();
                            return [4, page.evaluate("window.marker = window.term.registerMarker(1)")];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("window.marker.dispose()")];
                        case 3:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, "window.decoration = window.term.registerDecoration({ marker: window.marker });", undefined)];
                        case 4:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            it('should throw when a negative x offset is provided', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 1:
                            _a.sent();
                            return [4, page.evaluate("window.marker = window.term.registerMarker(1)")];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("\n        try {\n          window.decoration = window.term.registerDecoration({ marker: window.marker, x: -2 });\n        } catch (e) {\n          window.throwMessage = e.message;\n        }\n      ")];
                        case 3:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, 'window.throwMessage', 'This API only accepts positive integers')];
                        case 4:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        describe('overviewRulerDecorations', function () {
            it('should not add an overview ruler when width is not set', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 1:
                            _a.sent();
                            return [4, page.evaluate("window.marker1 = window.term.registerMarker(1)")];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("window.marker2 = window.term.registerMarker(2)")];
                        case 3:
                            _a.sent();
                            return [4, page.evaluate("window.term.registerDecoration({ marker: window.marker1, overviewRulerOptions: { color: 'red', position: 'full' } })")];
                        case 4:
                            _a.sent();
                            return [4, page.evaluate("window.term.registerDecoration({ marker: window.marker2, overviewRulerOptions: { color: 'blue', position: 'full' } })")];
                        case 5:
                            _a.sent();
                            return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, "document.querySelectorAll('.xterm-decoration-overview-ruler').length", 0)];
                        case 7:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            it('should add an overview ruler when width is set', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, (0, TestUtils_1.openTerminal)(page, { overviewRulerWidth: 15 })];
                        case 1:
                            _a.sent();
                            return [4, page.evaluate("window.marker1 = window.term.registerMarker(1)")];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("window.marker2 = window.term.registerMarker(2)")];
                        case 3:
                            _a.sent();
                            return [4, page.evaluate("window.term.registerDecoration({ marker: window.marker1, overviewRulerOptions: { color: 'red', position: 'full' } })")];
                        case 4:
                            _a.sent();
                            return [4, page.evaluate("window.term.registerDecoration({ marker: window.marker2, overviewRulerOptions: { color: 'blue', position: 'full' } })")];
                        case 5:
                            _a.sent();
                            return [4, (0, TestUtils_1.openTerminal)(page)];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, "document.querySelectorAll('.xterm-decoration-overview-ruler').length", 1)];
                        case 7:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
    });
    describe('registerLinkProvider', function () {
        it('should fire provideLinks when hovering cells', function () { return __awaiter(_this, void 0, void 0, function () {
            var dims;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate('window.term.focus()')];
                    case 2:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.disposable = window.term.registerLinkProvider({\n          provideLinks: (position, cb) => {\n            calls.push(position);\n            cb(undefined);\n          }\n        });\n      ")];
                    case 3:
                        _a.sent();
                        return [4, getDimensions()];
                    case 4:
                        dims = _a.sent();
                        return [4, moveMouseCell(page, dims, 1, 1)];
                    case 5:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 2, 2)];
                    case 6:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 10, 4)];
                    case 7:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", [1, 2, 4])];
                    case 8:
                        _a.sent();
                        return [4, page.evaluate("window.disposable.dispose()")];
                    case 9:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('should fire hover and leave events on the link', function () { return __awaiter(_this, void 0, void 0, function () {
            var dims;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate('window.term.focus()')];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, 'foo bar baz')];
                    case 3:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "document.querySelector('.xterm-rows').textContent", 'foo bar baz ')];
                    case 4:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.disposable = window.term.registerLinkProvider({\n          provideLinks: (position, cb) => {\n            window.calls.push('provide ' + position);\n            if (position === 1) {\n              window.calls.push('match');\n              cb([{\n                range: { start: { x: 5, y: 1 }, end: { x: 7, y: 1 } },\n                text: 'bar',\n                activate: () => window.calls.push('activate'),\n                hover: () => window.calls.push('hover'),\n                leave: () => window.calls.push('leave')\n              }]);\n            }\n          }\n        });\n      ")];
                    case 5:
                        _a.sent();
                        return [4, getDimensions()];
                    case 6:
                        dims = _a.sent();
                        return [4, moveMouseCell(page, dims, 5, 1)];
                    case 7:
                        _a.sent();
                        return [4, (0, TestUtils_1.timeout)(100)];
                    case 8:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 4, 1)];
                    case 9:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'match', 'hover', 'leave'])];
                    case 10:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 7, 1)];
                    case 11:
                        _a.sent();
                        return [4, (0, TestUtils_1.timeout)(100)];
                    case 12:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 8, 1)];
                    case 13:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'match', 'hover', 'leave', 'hover', 'leave'])];
                    case 14:
                        _a.sent();
                        return [4, page.evaluate("window.disposable.dispose()")];
                    case 15:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('should work fine when hover and leave callbacks are not provided', function () { return __awaiter(_this, void 0, void 0, function () {
            var dims;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate('window.term.focus()')];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, 'foo bar baz')];
                    case 3:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "document.querySelector('.xterm-rows').textContent", 'foo bar baz ')];
                    case 4:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.disposable = window.term.registerLinkProvider({\n          provideLinks: (position, cb) => {\n            window.calls.push('provide ' + position);\n            if (position === 1) {\n              window.calls.push('match 1');\n              cb([{\n                range: { start: { x: 5, y: 1 }, end: { x: 7, y: 1 } },\n                text: 'bar',\n                activate: () => window.calls.push('activate')\n              }]);\n            } else if (position === 2) {\n              window.calls.push('match 2');\n              cb([{\n                range: { start: { x: 5, y: 2 }, end: { x: 7, y: 2 } },\n                text: 'bar',\n                activate: () => window.calls.push('activate')\n              }]);\n            }\n          }\n        });\n      ")];
                    case 5:
                        _a.sent();
                        return [4, getDimensions()];
                    case 6:
                        dims = _a.sent();
                        return [4, moveMouseCell(page, dims, 5, 1)];
                    case 7:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'match 1'])];
                    case 8:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 4, 2)];
                    case 9:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'match 1', 'provide 2', 'match 2'])];
                    case 10:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 7, 1)];
                    case 11:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'match 1', 'provide 2', 'match 2', 'provide 1', 'match 1'])];
                    case 12:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 6, 2)];
                    case 13:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'match 1', 'provide 2', 'match 2', 'provide 1', 'match 1', 'provide 2', 'match 2'])];
                    case 14:
                        _a.sent();
                        return [4, page.evaluate("window.disposable.dispose()")];
                    case 15:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('should fire activate events when clicking the link', function () { return __awaiter(_this, void 0, void 0, function () {
            var dims;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate('window.term.focus()')];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, 'a b c')];
                    case 3:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "document.querySelector('.xterm-rows').textContent", 'a b c ')];
                    case 4:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.disposable = window.term.registerLinkProvider({\n          provideLinks: (y, cb) => {\n            window.calls.push('provide ' + y);\n            cb([{\n              range: { start: { x: 1, y }, end: { x: 80, y } },\n              text: window.term.buffer.active.getLine(y - 1).translateToString(),\n              activate: (_, text) => window.calls.push('activate ' + y),\n              hover: () => window.calls.push('hover ' + y),\n              leave: () => window.calls.push('leave ' + y)\n            }]);\n          }\n        });\n      ")];
                    case 5:
                        _a.sent();
                        return [4, getDimensions()];
                    case 6:
                        dims = _a.sent();
                        return [4, moveMouseCell(page, dims, 3, 1)];
                    case 7:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1'])];
                    case 8:
                        _a.sent();
                        return [4, page.mouse.down()];
                    case 9:
                        _a.sent();
                        return [4, page.mouse.up()];
                    case 10:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1', 'activate 1'])];
                    case 11:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 1, 2)];
                    case 12:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1', 'activate 1', 'leave 1', 'provide 2', 'hover 2'])];
                    case 13:
                        _a.sent();
                        return [4, page.mouse.down()];
                    case 14:
                        _a.sent();
                        return [4, page.mouse.up()];
                    case 15:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1', 'activate 1', 'leave 1', 'provide 2', 'hover 2', 'activate 2'])];
                    case 16:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 5, 1)];
                    case 17:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1', 'activate 1', 'leave 1', 'provide 2', 'hover 2', 'activate 2', 'leave 2', 'provide 1', 'hover 1'])];
                    case 18:
                        _a.sent();
                        return [4, page.mouse.down()];
                    case 19:
                        _a.sent();
                        return [4, page.mouse.up()];
                    case 20:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1', 'activate 1', 'leave 1', 'provide 2', 'hover 2', 'activate 2', 'leave 2', 'provide 1', 'hover 1', 'activate 1'])];
                    case 21:
                        _a.sent();
                        return [4, page.evaluate("window.disposable.dispose()")];
                    case 22:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('should work when multiple links are provided on the same line', function () { return __awaiter(_this, void 0, void 0, function () {
            var dims;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate('window.term.focus()')];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, 'foo bar baz')];
                    case 3:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "document.querySelector('.xterm-rows').textContent", 'foo bar baz ')];
                    case 4:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.disposable = window.term.registerLinkProvider({\n          provideLinks: (position, cb) => {\n            window.calls.push('provide ' + position);\n            if (position === 1) {\n              cb([{\n                range: { start: { x: 1, y: 1 }, end: { x: 3, y: 1 } },\n                text: '',\n                activate: () => window.calls.push('activate'),\n                hover: () => window.calls.push('hover 1-3'),\n                leave: () => window.calls.push('leave 1-3')\n              }, {\n                range: { start: { x: 5, y: 1 }, end: { x: 7, y: 1 } },\n                text: '',\n                activate: () => window.calls.push('activate'),\n                hover: () => window.calls.push('hover 5-7'),\n                leave: () => window.calls.push('leave 5-7')\n              }, {\n                range: { start: { x: 9, y: 1 }, end: { x: 11, y: 1 } },\n                text: '',\n                activate: () => window.calls.push('activate'),\n                hover: () => window.calls.push('hover 9-11'),\n                leave: () => window.calls.push('leave 9-11')\n              }]);\n            }\n          }\n        });\n      ")];
                    case 5:
                        _a.sent();
                        return [4, getDimensions()];
                    case 6:
                        dims = _a.sent();
                        return [4, moveMouseCell(page, dims, 2, 1)];
                    case 7:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3'])];
                    case 8:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 6, 1)];
                    case 9:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3', 'leave 1-3', 'hover 5-7'])];
                    case 10:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 6, 2)];
                    case 11:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3', 'leave 1-3', 'hover 5-7', 'leave 5-7', 'provide 2'])];
                    case 12:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 10, 1)];
                    case 13:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3', 'leave 1-3', 'hover 5-7', 'leave 5-7', 'provide 2', 'provide 1', 'hover 9-11'])];
                    case 14:
                        _a.sent();
                        return [4, page.evaluate("window.disposable.dispose()")];
                    case 15:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('should dispose links when hovering away', function () { return __awaiter(_this, void 0, void 0, function () {
            var dims;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 1:
                        _a.sent();
                        return [4, page.evaluate('window.term.focus()')];
                    case 2:
                        _a.sent();
                        return [4, (0, TestUtils_1.writeSync)(page, 'foo bar baz')];
                    case 3:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "document.querySelector('.xterm-rows').textContent", 'foo bar baz ')];
                    case 4:
                        _a.sent();
                        return [4, page.evaluate("\n        window.calls = [];\n        window.disposable = window.term.registerLinkProvider({\n          provideLinks: (position, cb) => {\n            window.calls.push('provide ' + position);\n            if (position === 1) {\n              cb([{\n                range: { start: { x: 1, y: 1 }, end: { x: 3, y: 1 } },\n                text: '',\n                activate: () => window.calls.push('activate'),\n                dispose: () => window.calls.push('dispose 1-3'),\n                hover: () => window.calls.push('hover 1-3'),\n                leave: () => window.calls.push('leave 1-3')\n              }, {\n                range: { start: { x: 5, y: 1 }, end: { x: 7, y: 1 } },\n                text: '',\n                activate: () => window.calls.push('activate'),\n                dispose: () => window.calls.push('dispose 5-7'),\n                hover: () => window.calls.push('hover 5-7'),\n                leave: () => window.calls.push('leave 5-7')\n              }, {\n                range: { start: { x: 9, y: 1 }, end: { x: 11, y: 1 } },\n                text: '',\n                activate: () => window.calls.push('activate'),\n                dispose: () => window.calls.push('dispose 9-11'),\n                hover: () => window.calls.push('hover 9-11'),\n                leave: () => window.calls.push('leave 9-11')\n              }]);\n            }\n          }\n        });\n      ")];
                    case 5:
                        _a.sent();
                        return [4, getDimensions()];
                    case 6:
                        dims = _a.sent();
                        return [4, moveMouseCell(page, dims, 2, 1)];
                    case 7:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3'])];
                    case 8:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 6, 1)];
                    case 9:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3', 'leave 1-3', 'hover 5-7'])];
                    case 10:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 6, 2)];
                    case 11:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3', 'leave 1-3', 'hover 5-7', 'leave 5-7', 'dispose 1-3', 'dispose 5-7', 'dispose 9-11', 'provide 2'])];
                    case 12:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 10, 1)];
                    case 13:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3', 'leave 1-3', 'hover 5-7', 'leave 5-7', 'dispose 1-3', 'dispose 5-7', 'dispose 9-11', 'provide 2', 'provide 1', 'hover 9-11'])];
                    case 14:
                        _a.sent();
                        return [4, moveMouseCell(page, dims, 10, 2)];
                    case 15:
                        _a.sent();
                        return [4, (0, TestUtils_1.pollFor)(page, "window.calls", ['provide 1', 'hover 1-3', 'leave 1-3', 'hover 5-7', 'leave 5-7', 'dispose 1-3', 'dispose 5-7', 'dispose 9-11', 'provide 2', 'provide 1', 'hover 9-11', 'leave 9-11', 'dispose 1-3', 'dispose 5-7', 'dispose 9-11', 'provide 2'])];
                    case 16:
                        _a.sent();
                        return [4, page.evaluate("window.disposable.dispose()")];
                    case 17:
                        _a.sent();
                        return [2];
                }
            });
        }); });
    });
});
function getDimensions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.evaluate("\n    (function() {\n      const rect = document.querySelector('.xterm-rows').getBoundingClientRect();\n      return {\n        top: rect.top,\n        left: rect.left,\n        renderDimensions: window.term._core._renderService.dimensions\n      };\n    })();\n  ")];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
function getCellCoordinates(dimensions, col, row) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, {
                    x: dimensions.left + dimensions.renderDimensions.device.cell.width * (col - 0.5),
                    y: dimensions.top + dimensions.renderDimensions.device.cell.height * (row - 0.5)
                }];
        });
    });
}
function moveMouseCell(page, dimensions, col, row) {
    return __awaiter(this, void 0, void 0, function () {
        var coords;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getCellCoordinates(dimensions, col, row)];
                case 1:
                    coords = _a.sent();
                    return [4, page.mouse.move(coords.x, coords.y)];
                case 2:
                    _a.sent();
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=Terminal.api.js.map