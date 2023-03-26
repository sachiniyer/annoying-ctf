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
var isChromium = false;
describe('InputHandler Integration Tests', function () {
    var _this = this;
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var browserType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browserType = (0, TestUtils_1.getBrowserType)();
                        isChromium = browserType.name() === 'chromium';
                        return [4, (0, TestUtils_1.launchBrowser)()];
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
    after(function () {
        browser.close();
    });
    describe('CSI', function () {
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
        it('ICH: Insert Ps (Blank) Character(s) (default = 1) - CSI Ps @', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('foo\\x1b[3D\\x1b[@\\n\\r')\n        // Explicit\n        window.term.write('bar\\x1b[3D\\x1b[4@')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(2); }, [' foo', '    bar'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CUU: Cursor Up Ps Times (default = 1) - CSI Ps A', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('\\n\\n\\n\\n\u001B[Aa')\n        // Explicit\n        window.term.write('\u001B[2Ab')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(4); }, ['', ' b', '', 'a'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CUD: Cursor Down Ps Times (default = 1) - CSI Ps B', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('\u001B[Ba')\n        // Explicit\n        window.term.write('\u001B[2Bb')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(4); }, ['', 'a', '', ' b'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CUF: Cursor Forward Ps Times (default = 1) - CSI Ps C', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('\u001B[Ca')\n        // Explicit\n        window.term.write('\u001B[2Cb')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(1); }, [' a  b'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CUB: Cursor Backward Ps Times (default = 1) - CSI Ps D', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('foo\u001B[Da')\n        // Explicit\n        window.term.write('\u001B[2Db')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(1); }, ['fba'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CNL: Cursor Next Line Ps Times (default = 1) - CSI Ps E', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('\u001B[Ea')\n        // Explicit\n        window.term.write('\u001B[2Eb')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(4); }, ['', 'a', '', 'b'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CPL: Cursor Preceding Line Ps Times (default = 1) - CSI Ps F', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('\\n\\n\\n\\n\u001B[Fa')\n        // Explicit\n        window.term.write('\u001B[2Fb')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(5); }, ['', 'b', '', 'a', ''])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CHA: Cursor Character Absolute [column] (default = [row,1]) - CSI Ps G', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('foo\u001B[Ga')\n        // Explicit\n        window.term.write('\u001B[10Gb')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(1); }, ['aoo      b'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CUP: Cursor Position [row;column] (default = [1,1]) - CSI Ps ; Ps H', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('foo\u001B[Ha')\n        // Explicit\n        window.term.write('\u001B[3;3Hb')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['aoo', '', '  b'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('CHT: Cursor Forward Tabulation Ps tab stops (default = 1) - CSI Ps I', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('\u001B[Ia')\n        // Explicit\n        window.term.write('\\n\\r\u001B[2Ib')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(2); }, ['        a', '                b'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('ED: Erase in Display, VT100 - CSI Ps J', function () {
            return __awaiter(this, void 0, void 0, function () {
                var fixture;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fixture = 'abc\\n\\rdef\\n\\rghi\x1b[2;2H';
                            return [4, page.evaluate("\n        // Default: Erase Below\n        window.term.resize(5, 5);\n        window.term.write('".concat(fixture, "\u001B[J')\n      "))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['abc', 'd', ''])];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("\n        // 0: Erase Below\n        window.term.reset()\n        window.term.write('".concat(fixture, "\u001B[0J')\n      "))];
                        case 3:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['abc', 'd', ''])];
                        case 4:
                            _a.sent();
                            return [4, page.evaluate("\n        // 1: Erase Above\n        window.term.reset()\n        window.term.write('".concat(fixture, "\u001B[1J')\n      "))];
                        case 5:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['', '  f', 'ghi'])];
                        case 6:
                            _a.sent();
                            return [4, page.evaluate("\n        // 2: Erase Saved Lines (scrollback)\n        window.term.reset()\n        window.term.write('1\\n2\\n3\\n4\\n5".concat(fixture, "\u001B[3J')\n      "))];
                        case 7:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("window.term.buffer.active.length"); }, 5)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(5); }, ['   4', '    5', 'abc', 'def', 'ghi'])];
                        case 9:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('DECSED: Erase in Display, VT220 - CSI ? Ps J', function () {
            return __awaiter(this, void 0, void 0, function () {
                var fixture;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            fixture = 'abc\\n\\rdef\\n\\rghi\x1b[2;2H';
                            return [4, page.evaluate("\n        // Default: Erase Below\n        window.term.resize(5, 5);\n        window.term.write('".concat(fixture, "\u001B[?J')\n      "))];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['abc', 'd', ''])];
                        case 2:
                            _a.sent();
                            return [4, page.evaluate("\n        // 0: Erase Below\n        window.term.reset()\n        window.term.write('".concat(fixture, "\u001B[?0J')\n      "))];
                        case 3:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['abc', 'd', ''])];
                        case 4:
                            _a.sent();
                            return [4, page.evaluate("\n        // 1: Erase Above\n        window.term.reset()\n        window.term.write('".concat(fixture, "\u001B[?1J')\n      "))];
                        case 5:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['', '  f', 'ghi'])];
                        case 6:
                            _a.sent();
                            return [4, page.evaluate("\n        // 2: Erase Saved Lines (scrollback)\n        window.term.reset()\n        window.term.write('1\\n2\\n3\\n4\\n5".concat(fixture, "\u001B[?3J')\n      "))];
                        case 7:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("window.term.buffer.active.length"); }, 5)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(5); }, ['   4', '    5', 'abc', 'def', 'ghi'])];
                        case 9:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('IL: Insert Ps Line(s) (default = 1) - CSI Ps L', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('foo\u001B[La')\n        // Explicit\n        window.term.write('\u001B[2Lb')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(4); }, ['b', '', 'a', 'foo'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('DL: Delete Ps Line(s) (default = 1) - CSI Ps M', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('a\\nb\u001B[1F\u001B[M')\n        // Explicit\n        window.term.write('\u001B[1Ed\\ne\\nf\u001B[2F\u001B[2M')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(5); }, [' b', '  f', '', '', ''])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        it('DCH: Delete Ps Character(s) (default = 1) - CSI Ps P', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n        // Default\n        window.term.write('abc\u001B[1;1H\u001B[P')\n        // Explicit\n        window.term.write('\\n\\rdef\u001B[2;1H\u001B[2P')\n      ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(2); }, ['bc', 'f'])];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        describe('DSR: Device Status Report', function () {
            it('Status Report - CSI 5 n', function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, page.evaluate("\n          window.term.onData(e => window.result = e);\n          window.term.write('\\x1b[5n');\n        ")];
                            case 1:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("window.result"); }, '\x1b[0n')];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            });
            it('Report Cursor Position (CPR) - CSI 6 n', function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, page.evaluate("window.term.write('\\n\\nfoo')")];
                            case 1:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("\n          [window.term.buffer.active.cursorY, window.term.buffer.active.cursorX]\n        "); }, [2, 3])];
                            case 2:
                                _a.sent();
                                return [4, page.evaluate("\n          window.term.onData(e => window.result = e);\n          window.term.write('\\x1b[6n');\n        ")];
                            case 3:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("window.result"); }, '\x1b[3;4R')];
                            case 4:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            });
            it('Report Cursor Position (DECXCPR) - CSI ? 6 n', function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, page.evaluate("window.term.write('\\n\\nfoo')")];
                            case 1:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("\n          [window.term.buffer.active.cursorY, window.term.buffer.active.cursorX]\n        "); }, [2, 3])];
                            case 2:
                                _a.sent();
                                return [4, page.evaluate("\n          window.term.onData(e => window.result = e);\n          window.term.write('\\x1b[?6n');\n        ")];
                            case 3:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("window.result"); }, '\x1b[?3;4R')];
                            case 4:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            });
        });
        describe('SM: Set Mode', function () {
            describe('CSI ? Pm h', function () {
                it('Pm = 1003, Set Use All Motion (any event) Mouse Tracking', function () { return __awaiter(_this, void 0, void 0, function () {
                    var coords, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4, page.evaluate("\n            (function() {\n              const rect = window.term.element.getBoundingClientRect();\n              return { left: rect.left, top: rect.top, bottom: rect.bottom, right: rect.right };\n            })();\n          ")];
                            case 1:
                                coords = _c.sent();
                                return [4, page.mouse.click((coords.left + coords.right) / 2, (coords.top + coords.bottom) / 2)];
                            case 2:
                                _c.sent();
                                return [4, page.mouse.down()];
                            case 3:
                                _c.sent();
                                return [4, page.mouse.move((coords.left + coords.right) / 2, (coords.top + coords.bottom) / 4)];
                            case 4:
                                _c.sent();
                                _b = (_a = chai_1.assert).ok;
                                return [4, page.evaluate("window.term.getSelection().length")];
                            case 5:
                                _b.apply(_a, [(_c.sent()) > 0, 'mouse events are off so there should be a selection']);
                                return [4, page.mouse.up()];
                            case 6:
                                _c.sent();
                                return [4, page.mouse.click((coords.left + coords.right) / 2, (coords.top + coords.bottom) / 2)];
                            case 7:
                                _c.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("window.term.getSelection().length"); }, 0)];
                            case 8:
                                _c.sent();
                                return [4, page.evaluate("window.term.write('\u001B[?1003h')")];
                            case 9:
                                _c.sent();
                                return [4, page.mouse.click((coords.left + coords.right) / 2, (coords.top + coords.bottom) / 2)];
                            case 10:
                                _c.sent();
                                return [4, page.mouse.down()];
                            case 11:
                                _c.sent();
                                return [4, page.mouse.move((coords.left + coords.right) / 2, (coords.top + coords.bottom) / 4)];
                            case 12:
                                _c.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return page.evaluate("window.term.getSelection().length"); }, 0)];
                            case 13:
                                _c.sent();
                                return [4, page.mouse.up()];
                            case 14:
                                _c.sent();
                                return [2];
                        }
                    });
                }); });
                (isChromium ? it : it.skip)('Pm = 2004, Set bracketed paste mode', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, (0, TestUtils_1.pollFor)(page, function () { return simulatePaste('foo'); }, 'foo')];
                                case 1:
                                    _a.sent();
                                    return [4, page.evaluate("window.term.write('\u001B[?2004h')")];
                                case 2:
                                    _a.sent();
                                    return [4, (0, TestUtils_1.pollFor)(page, function () { return simulatePaste('bar'); }, '\x1b[200~bar\x1b[201~')];
                                case 3:
                                    _a.sent();
                                    return [4, page.evaluate("window.term.write('\u001B[?2004l')")];
                                case 4:
                                    _a.sent();
                                    return [4, (0, TestUtils_1.pollFor)(page, function () { return simulatePaste('baz'); }, 'baz')];
                                case 5:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    });
                });
            });
        });
        it('REP: Repeat preceding character, ECMA48 - CSI Ps b', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n          window.term.resize(10, 10);\n          window.term.write('#\u001B[b');\n          window.term.writeln('');\n          window.term.write('#\u001B[0b');\n          window.term.writeln('');\n          window.term.write('#\u001B[1b');\n          window.term.writeln('');\n          window.term.write('#\u001B[5b');\n          ")];
                        case 1:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(4); }, ['##', '##', '##', '######'])];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getCursor(); }, { col: 6, row: 3 })];
                        case 3:
                            _a.sent();
                            return [4, page.evaluate("\n          window.term.reset();\n          window.term.write('\uFFE5\u001B[10b');\n          ")];
                        case 4:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(1); }, ['￥'])];
                        case 5:
                            _a.sent();
                            return [4, page.evaluate("\n          window.term.reset();\n          window.term.write('e\u0301\u001B[5b');\n          ")];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(1); }, ['e\u0301eeeee'])];
                        case 7:
                            _a.sent();
                            return [4, page.evaluate("\n          window.term.reset();\n          window.term.write('#\u001B[15b');\n          ")];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(2); }, ['##########', '######'])];
                        case 9:
                            _a.sent();
                            return [4, page.evaluate("\n          window.term.reset();\n          window.term.write('\u001B[?7l');  // disable wrap around\n          window.term.write('#\u001B[15b');\n          ")];
                        case 10:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(2); }, ['##########', ''])];
                        case 11:
                            _a.sent();
                            return [4, page.evaluate("\n          window.term.reset();\n          window.term.write('\u001B[?7h');  // re-enable wrap around\n          window.term.write('#\\n\u001B[3b');\n          window.term.write('#\\r\u001B[3b');\n          window.term.writeln('');\n          window.term.write('abcdefg\u001B[3D\u001B[10b#\u001B[3b');\n          ")];
                        case 12:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getLinesAsArray(3); }, ['#', ' #', 'abcd####'])];
                        case 13:
                            _a.sent();
                            return [2];
                    }
                });
            });
        });
        describe('Window Options - CSI Ps ; Ps ; Ps t', function () {
            it('should be disabled by default', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, page.evaluate("(() => {\n            window._stack = [];\n            const _h = window.term.onData(data => window._stack.push(data));\n            window.term.write('\u001B[14t');\n            window.term.write('\u001B[16t');\n            window.term.write('\u001B[18t');\n            window.term.write('\u001B[20t');\n            window.term.write('\u001B[21t');\n            return new Promise((r) => window.term.write('', () => { _h.dispose(); r(); }));\n          })()")];
                            case 1:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, page.evaluate("(() => _stack)()")];
                                            case 1: return [2, _a.sent()];
                                        }
                                    }); }); }, [])];
                            case 2:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            });
            it('14 - GetWinSizePixels', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var d;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, page.evaluate("window.term.options.windowOptions = { getWinSizePixels: true }; ")];
                            case 1:
                                _a.sent();
                                return [4, page.evaluate("(() => {\n            window._stack = [];\n            const _h = window.term.onData(data => window._stack.push(data));\n            window.term.write('\u001B[14t');\n            return new Promise((r) => window.term.write('', () => { _h.dispose(); r(); }));\n          })()")];
                            case 2:
                                _a.sent();
                                return [4, getDimensions()];
                            case 3:
                                d = _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, page.evaluate("(() => _stack)()")];
                                            case 1: return [2, _a.sent()];
                                        }
                                    }); }); }, ["\u001B[4;".concat(d.height, ";").concat(d.width, "t")])];
                            case 4:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            });
            it('16 - GetCellSizePixels', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var d;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, page.evaluate("window.term.options.windowOptions = { getCellSizePixels: true }; ")];
                            case 1:
                                _a.sent();
                                return [4, page.evaluate("(() => {\n            window._stack = [];\n            const _h = window.term.onData(data => window._stack.push(data));\n            window.term.write('\u001B[16t');\n            return new Promise((r) => window.term.write('', () => { _h.dispose(); r(); }));\n          })()")];
                            case 2:
                                _a.sent();
                                return [4, getDimensions()];
                            case 3:
                                d = _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, page.evaluate("(() => _stack)()")];
                                            case 1: return [2, _a.sent()];
                                        }
                                    }); }); }, ["\u001B[6;".concat(d.cellHeight, ";").concat(d.cellWidth, "t")])];
                            case 4:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            });
        });
    });
    describe('OSC', function () {
        describe('OSC 4', function () {
            before(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('(() => {window._recordedData = []; window._h = term.onData(d => window._recordedData.push(d));})()')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            after(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('window._h.dispose()')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            it('query single color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;0;?\x07')];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_e.sent(), ['\x1b]4;0;rgb:2e2e/3434/3636\x1b\\']]);
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;77;?\x07')];
                        case 3:
                            _e.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 4:
                            _d.apply(_c, [_e.sent(), ['\x1b]4;0;rgb:2e2e/3434/3636\x1b\\', '\x1b]4;77;rgb:5f5f/d7d7/5f5f\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('query multiple colors', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;0;?;77;?\x07')];
                        case 1:
                            _c.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_c.sent(), ['\x1b]4;0;rgb:2e2e/3434/3636\x1b\\', '\x1b]4;77;rgb:5f5f/d7d7/5f5f\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('set & query single color', function () { return __awaiter(_this, void 0, void 0, function () {
                var restore, _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;0;?\x07')];
                        case 1:
                            _g.sent();
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            restore = _g.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 3:
                            _b.apply(_a, [_g.sent(), restore]);
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;0;rgb:01/02/03\x07\x1b]4;0;?\x07')];
                        case 4:
                            _g.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 5:
                            _d.apply(_c, [_g.sent(), [restore[0], '\x1b]4;0;rgb:0101/0202/0303\x1b\\']]);
                            return [4, (0, TestUtils_1.writeSync)(page, restore[0] + '\x1b]4;0;?\x07')];
                        case 6:
                            _g.sent();
                            _f = (_e = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 7:
                            _f.apply(_e, [_g.sent(), [restore[0], '\x1b]4;0;rgb:0101/0202/0303\x1b\\', restore[0]]]);
                            return [2];
                    }
                });
            }); });
            it('query & set colors mixed', function () { return __awaiter(_this, void 0, void 0, function () {
                var restore, _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;0;?;77;?\x07')];
                        case 1:
                            _g.sent();
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            restore = _g.sent();
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 3:
                            _g.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;0;rgb:01/02/03;43;?;77;#aabbcc\x07')];
                        case 4:
                            _g.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 5:
                            _b.apply(_a, [_g.sent(), ['\x1b]4;43;rgb:0000/d7d7/afaf\x1b\\']]);
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 6:
                            _g.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]4;0;?;77;?\x07')];
                        case 7:
                            _g.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 8:
                            _d.apply(_c, [_g.sent(), ['\x1b]4;0;rgb:0101/0202/0303\x1b\\', '\x1b]4;77;rgb:aaaa/bbbb/cccc\x1b\\']]);
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 9:
                            _g.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, restore[0] + restore[1] + '\x1b]4;0;?;77;?\x07')];
                        case 10:
                            _g.sent();
                            _f = (_e = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 11:
                            _f.apply(_e, [_g.sent(), restore]);
                            return [2];
                    }
                });
            }); });
        });
        describe('OSC 4 & 104', function () {
            before(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('(() => {window._recordedData = []; window._h = term.onData(d => window._recordedData.push(d));})()')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            after(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('window._h.dispose()')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            it('change & restore single color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _i, _a, i, restore, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _i = 0, _a = [0, 43, 77, 255];
                            _f.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3, 10];
                            i = _a[_i];
                            return [4, (0, TestUtils_1.writeSync)(page, "\u001B]4;".concat(i, ";?\u0007"))];
                        case 2:
                            _f.sent();
                            return [4, page.evaluate('window._recordedData')];
                        case 3:
                            restore = _f.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, "\u001B]4;".concat(i, ";rgb:01/02/03\u0007\u001B]4;").concat(i, ";?\u0007"))];
                        case 4:
                            _f.sent();
                            _c = (_b = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 5:
                            _c.apply(_b, [_f.sent(), [restore[0], "\u001B]4;".concat(i, ";rgb:0101/0202/0303\u001B\\")]]);
                            return [4, (0, TestUtils_1.writeSync)(page, "\u001B]104;".concat(i, "\u0007\u001B]4;").concat(i, ";?\u0007"))];
                        case 6:
                            _f.sent();
                            _e = (_d = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 7:
                            _e.apply(_d, [_f.sent(), [restore[0], "\u001B]4;".concat(i, ";rgb:0101/0202/0303\u001B\\"), restore[0]]]);
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 8:
                            _f.sent();
                            _f.label = 9;
                        case 9:
                            _i++;
                            return [3, 1];
                        case 10: return [2];
                    }
                });
            }); });
            it('restore multiple at once', function () { return __awaiter(_this, void 0, void 0, function () {
                var restore, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, "\u001B]4;0;?;43;?;77;?\u0007")];
                        case 1:
                            _c.sent();
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            restore = _c.sent();
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 3:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, "\u001B]4;0;rgb:01/02/03;43;#aabbcc;77;#123456\u0007")];
                        case 4:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, "\u001B]104;0;43;77\u0007" + "\u001B]4;0;?;43;?;77;?\u0007")];
                        case 5:
                            _c.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 6:
                            _b.apply(_a, [_c.sent(), restore]);
                            return [2];
                    }
                });
            }); });
            it('restore full table', function () { return __awaiter(_this, void 0, void 0, function () {
                var restore, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, "\u001B]4;0;?;43;?;77;?\u0007")];
                        case 1:
                            _c.sent();
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            restore = _c.sent();
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 3:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, "\u001B]4;0;rgb:01/02/03;43;#aabbcc;77;#123456\u0007")];
                        case 4:
                            _c.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, "\u001B]104\u0007" + "\u001B]4;0;?;43;?;77;?\u0007")];
                        case 5:
                            _c.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 6:
                            _b.apply(_a, [_c.sent(), restore]);
                            return [2];
                    }
                });
            }); });
        });
        describe('OSC 10 & 11 + 110 | 111 | 112', function () {
            before(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('(() => {window._recordedData = []; window._h = term.onData(d => window._recordedData.push(d));})()')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            after(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('window._h.dispose()')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            it('query FG color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]10;?\x07')];
                        case 1:
                            _c.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_c.sent(), ['\x1b]10;rgb:ffff/ffff/ffff\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('query BG color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]11;?\x07')];
                        case 1:
                            _c.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_c.sent(), ['\x1b]11;rgb:0000/0000/0000\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('query FG & BG color in one call', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]10;?;?\x07')];
                        case 1:
                            _c.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_c.sent(), ['\x1b]10;rgb:ffff/ffff/ffff\x1b\\', '\x1b]11;rgb:0000/0000/0000\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('set & query FG', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]10;rgb:1/2/3\x07\x1b]10;?\x07')];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_e.sent(), ['\x1b]10;rgb:1111/2222/3333\x1b\\']]);
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]10;#ffffff\x07\x1b]10;?\x07')];
                        case 3:
                            _e.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 4:
                            _d.apply(_c, [_e.sent(), ['\x1b]10;rgb:1111/2222/3333\x1b\\', '\x1b]10;rgb:ffff/ffff/ffff\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('set & query BG', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]11;rgb:1/2/3\x07\x1b]11;?\x07')];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_e.sent(), ['\x1b]11;rgb:1111/2222/3333\x1b\\']]);
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]11;#000000\x07\x1b]11;?\x07')];
                        case 3:
                            _e.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 4:
                            _d.apply(_c, [_e.sent(), ['\x1b]11;rgb:1111/2222/3333\x1b\\', '\x1b]11;rgb:0000/0000/0000\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('set & query cursor color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]12;rgb:1/2/3\x07\x1b]12;?\x07')];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_e.sent(), ['\x1b]12;rgb:1111/2222/3333\x1b\\']]);
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]12;#ffffff\x07\x1b]12;?\x07')];
                        case 3:
                            _e.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 4:
                            _d.apply(_c, [_e.sent(), ['\x1b]12;rgb:1111/2222/3333\x1b\\', '\x1b]12;rgb:ffff/ffff/ffff\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('set & query FG & BG color in one call', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]10;#123456;rgb:aa/bb/cc\x07\x1b]10;?;?\x07')];
                        case 1:
                            _c.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_c.sent(), ['\x1b]10;rgb:1212/3434/5656\x1b\\', '\x1b]11;rgb:aaaa/bbbb/cccc\x1b\\']]);
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]10;#ffffff;#000000\x07')];
                        case 3:
                            _c.sent();
                            return [2];
                    }
                });
            }); });
            it('OSC 110: restore FG color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]10;rgb:1/2/3\x07\x1b]10;?\x07')];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_e.sent(), ['\x1b]10;rgb:1111/2222/3333\x1b\\']]);
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 3:
                            _e.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]110\x07\x1b]10;?\x07')];
                        case 4:
                            _e.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 5:
                            _d.apply(_c, [_e.sent(), ['\x1b]10;rgb:ffff/ffff/ffff\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('OSC 111: restore BG color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]11;rgb:1/2/3\x07\x1b]11;?\x07')];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_e.sent(), ['\x1b]11;rgb:1111/2222/3333\x1b\\']]);
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 3:
                            _e.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]111\x07\x1b]11;?\x07')];
                        case 4:
                            _e.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 5:
                            _d.apply(_c, [_e.sent(), ['\x1b]11;rgb:0000/0000/0000\x1b\\']]);
                            return [2];
                    }
                });
            }); });
            it('OSC 112: restore cursor color', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4, (0, TestUtils_1.writeSync)(page, '\x1b]12;rgb:1/2/3\x07\x1b]12;?\x07')];
                        case 1:
                            _e.sent();
                            _b = (_a = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 2:
                            _b.apply(_a, [_e.sent(), ['\x1b]12;rgb:1111/2222/3333\x1b\\']]);
                            return [4, page.evaluate('window._recordedData.length = 0;')];
                        case 3:
                            _e.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b]112\x07\x1b]12;?\x07')];
                        case 4:
                            _e.sent();
                            _d = (_c = chai_1.assert).deepEqual;
                            return [4, page.evaluate('window._recordedData')];
                        case 5:
                            _d.apply(_c, [_e.sent(), ['\x1b]12;rgb:ffff/ffff/ffff\x1b\\']]);
                            return [2];
                    }
                });
            }); });
        });
    });
    describe('ESC', function () {
        describe('DECRC: Save cursor, ESC 7', function () {
            it('should save the absolute cursor position so resizing restores to the correct position', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, page.evaluate("\n          window.term.resize(10, 2);\n          window.term.write('1\\n\\r2\\n\\r3\\n\\r4\\n\\r5');\n          window.term.write('\\x1b7\\x1b[?47h');\n          ")];
                        case 1:
                            _a.sent();
                            return [4, page.evaluate("\n          window.term.resize(10, 4);\n          window.term.write('\\x1b[?47l\\x1b8');\n          ")];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getCursor(); }, { col: 1, row: 3 })];
                        case 3:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
    });
});
function getLinesAsArray(count, start) {
    if (start === void 0) { start = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var text, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    text = '';
                    for (i = start; i < start + count; i++) {
                        text += "window.term.buffer.active.getLine(".concat(i, ").translateToString(true),");
                    }
                    return [4, page.evaluate("[".concat(text, "]"))];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
function simulatePaste(text) {
    return __awaiter(this, void 0, void 0, function () {
        var id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = Math.floor(Math.random() * 1000000);
                    return [4, page.evaluate("\n            (function() {\n              window.term.onData(e => window.result_".concat(id, " = e);\n              const clipboardData = new DataTransfer();\n              clipboardData.setData('text/plain', '").concat(text, "');\n              window.term.textarea.dispatchEvent(new ClipboardEvent('paste', { clipboardData }));\n            })();\n          "))];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("window.result_".concat(id, " "))];
                case 2: return [2, _a.sent()];
            }
        });
    });
}
function getCursor() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, page.evaluate("\n  (function() {\n    return {col: term.buffer.active.cursorX, row: term.buffer.active.cursorY};\n  })();\n  ")];
        });
    });
}
function getDimensions() {
    return __awaiter(this, void 0, void 0, function () {
        var dim;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.evaluate("term._core._renderService.dimensions")];
                case 1:
                    dim = _a.sent();
                    return [2, {
                            cellWidth: dim.css.cell.width.toFixed(0),
                            cellHeight: dim.css.cell.height.toFixed(0),
                            width: dim.css.canvas.width.toFixed(0),
                            height: dim.css.canvas.height.toFixed(0)
                        }];
            }
        });
    });
}
//# sourceMappingURL=InputHandler.api.js.map