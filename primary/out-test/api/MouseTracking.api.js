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
var width = 1280;
var height = 960;
var fontSize = 6;
var cols = 260;
var rows = 50;
var noShift = process.platform === 'darwin' ? false : true;
function resetMouseModes() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.evaluate("\n    window.term.write('\u001B[?9l\u001B[?1000l\u001B[?1001l\u001B[?1002l\u001B[?1003l');\n    window.term.write('\u001B[?1005l\u001B[?1006l\u001B[?1015l');\n  ")];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
function getReports(encoding) {
    return __awaiter(this, void 0, void 0, function () {
        var reports;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.evaluate("window.calls")];
                case 1:
                    reports = _a.sent();
                    return [4, page.evaluate("window.calls = [];")];
                case 2:
                    _a.sent();
                    return [2, reports.map(function (report) { return parseReport(encoding, report); })];
            }
        });
    });
}
function cellPos(col, row) {
    return __awaiter(this, void 0, void 0, function () {
        var coords;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.evaluate("\n    (function() {\n      const rect = window.term.element.getBoundingClientRect();\n      const dim = term._core._renderService.dimensions;\n      return {left: rect.left, top: rect.top, bottom: rect.bottom, right: rect.right, width: dim.css.cell.width, height: dim.css.cell.height};\n    })();\n  ")];
                case 1:
                    coords = _a.sent();
                    return [2, [col * coords.width + coords.left + 2, row * coords.height + coords.top + 2]];
            }
        });
    });
}
function mouseMove(col, row) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, xPixels, yPixels;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, cellPos(col, row)];
                case 1:
                    _a = _b.sent(), xPixels = _a[0], yPixels = _a[1];
                    return [4, page.mouse.move(xPixels, yPixels)];
                case 2: return [2, _b.sent()];
            }
        });
    });
}
function mouseDown(button) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.mouse.down({ button: button })];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
function mouseUp(button) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, page.mouse.up({ button: button })];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
function toModifiersMask(modifiers) {
    var mask = 0;
    if (modifiers.has('Alt')) {
        mask |= 1;
    }
    if (modifiers.has('Control')) {
        mask |= 2;
    }
    if (modifiers.has('Meta')) {
        mask |= 4;
    }
    if (modifiers.has('Shift')) {
        mask |= 8;
    }
    return mask;
}
var buttons = {
    '<none>': -1,
    left: 0,
    middle: 1,
    right: 2,
    released: 3,
    wheelUp: 4,
    wheelDown: 5,
    wheelLeft: 6,
    wheelRight: 7,
    aux8: 8,
    aux9: 9,
    aux10: 10,
    aux11: 11,
    aux12: 12,
    aux13: 13,
    aux14: 14,
    aux15: 15
};
var reverseButtons = {};
for (var el in buttons) {
    reverseButtons[buttons[el]] = el;
}
function evalButtonCode(code) {
    if (code > 255) {
        return { button: 'invalid', action: 'invalid', modifier: {} };
    }
    var modifier = { shift: !!(code & 4), meta: !!(code & 8), control: !!(code & 16) };
    var move = code & 32;
    var button = code & 3;
    if (code & 128) {
        button |= 8;
    }
    if (code & 64) {
        button |= 4;
    }
    var actionS = 'press';
    var buttonS = reverseButtons[button];
    if (button === 3) {
        buttonS = '<none>';
        actionS = 'release';
    }
    if (move) {
        actionS = 'move';
    }
    else if (4 <= button && button <= 7) {
        buttonS = 'wheel';
        actionS = button === 4 ? 'up' : button === 5 ? 'down' : button === 6 ? 'left' : 'right';
    }
    return { button: buttonS, action: actionS, modifier: modifier };
}
function parseReport(encoding, msg) {
    var _a;
    var sReport;
    var buttonCode;
    var row;
    var col;
    var report = String.fromCharCode.apply(null, msg);
    if (!report || report[0] !== '\x1b') {
        return report;
    }
    switch (encoding) {
        case 'DEFAULT':
            return {
                state: evalButtonCode(report.charCodeAt(3) - 32),
                col: report.charCodeAt(4) - 32,
                row: report.charCodeAt(5) - 32
            };
        case 'SGR':
            sReport = report.slice(3, -1);
            _a = sReport.split(';').map(function (el) { return parseInt(el); }), buttonCode = _a[0], col = _a[1], row = _a[2];
            var state = evalButtonCode(buttonCode);
            if (report[report.length - 1] === 'm') {
                state.action = 'release';
            }
            return { state: state, row: row, col: col };
        default:
            return {
                state: evalButtonCode(report.charCodeAt(3) - 32),
                col: report.charCodeAt(4) - 32,
                row: report.charCodeAt(5) - 32
            };
    }
}
describe('Mouse Tracking Tests', function () { return __awaiter(void 0, void 0, void 0, function () {
    var browserType, itMouse;
    return __generator(this, function (_a) {
        browserType = (0, TestUtils_1.getBrowserType)();
        browserType.name() === 'chromium';
        itMouse = it;
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
                            return [2];
                    }
                });
            });
        });
        after(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2, browser.close()];
        }); }); });
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, page.goto(APP)];
                    case 1:
                        _a.sent();
                        return [4, (0, TestUtils_1.openTerminal)(page)];
                    case 2:
                        _a.sent();
                        return [4, page.evaluate("\n      window.calls = [];\n      window.term.onData(e => calls.push( Array.from(e).map(el => el.charCodeAt(0)) ));\n      window.term.onBinary(e => calls.push( Array.from(e).map(el => el.charCodeAt(0)) ));\n      window.term.options.fontSize = ".concat(fontSize, ";\n      window.term.resize(").concat(cols, ", ").concat(rows, ");\n    "))];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        describe('DECSET 9 (X10)', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                itMouse('default encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var encoding;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                encoding = 'DEFAULT';
                                return [4, resetMouseModes()];
                            case 1:
                                _a.sent();
                                return [4, mouseMove(0, 0)];
                            case 2:
                                _a.sent();
                                return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?9h')];
                            case 3:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 4:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 5:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 6:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                            case 7:
                                _a.sent();
                                return [4, mouseMove(50, 10)];
                            case 8:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                            case 9:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 10:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 11:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 12:
                                _a.sent();
                                return [4, mouseMove(223 - 1, rows - 1)];
                            case 13:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 14:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 15:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 223, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 16:
                                _a.sent();
                                return [4, mouseMove(257, rows - 1)];
                            case 17:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 18:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 19:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                            case 20:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 21:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 22:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 23:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 24:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 25:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 26:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 27:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 28:
                                _a.sent();
                                return [4, mouseDown('right')];
                            case 29:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 30:
                                _a.sent();
                                return [4, mouseUp('right')];
                            case 31:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } }])];
                            case 32:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 33:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 34:
                                _a.sent();
                                return [4, page.keyboard.down('Control')];
                            case 35:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 36:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 37:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 38:
                                _a.sent();
                                return [4, page.keyboard.up('Control')];
                            case 39:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 40:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 41:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 42:
                                _a.sent();
                                return [4, page.keyboard.down('Alt')];
                            case 43:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 44:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 45:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 46:
                                _a.sent();
                                return [4, page.keyboard.up('Alt')];
                            case 47:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 48:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 49:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 50:
                                _a.sent();
                                return [4, page.keyboard.down('Shift')];
                            case 51:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 52:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 53:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 54:
                                _a.sent();
                                return [4, page.keyboard.up('Shift')];
                            case 55:
                                _a.sent();
                                if (!noShift) return [3, 57];
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                            case 56:
                                _a.sent();
                                return [3, 59];
                            case 57: return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                            case 58:
                                _a.sent();
                                _a.label = 59;
                            case 59: return [4, mouseMove(43, 24)];
                            case 60:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 61:
                                _a.sent();
                                return [4, page.keyboard.down('Control')];
                            case 62:
                                _a.sent();
                                return [4, page.keyboard.down('Alt')];
                            case 63:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 64:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 65:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 66:
                                _a.sent();
                                return [4, page.keyboard.up('Control')];
                            case 67:
                                _a.sent();
                                return [4, page.keyboard.up('Alt')];
                            case 68:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 69:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                itMouse('SGR encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var encoding;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                encoding = 'SGR';
                                return [4, resetMouseModes()];
                            case 1:
                                _a.sent();
                                return [4, mouseMove(0, 0)];
                            case 2:
                                _a.sent();
                                return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?9h\x1b[?1006h')];
                            case 3:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 4:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 5:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 6:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                            case 7:
                                _a.sent();
                                return [4, mouseMove(50, 10)];
                            case 8:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                            case 9:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 10:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 11:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 12:
                                _a.sent();
                                return [4, mouseMove(cols - 1, rows - 1)];
                            case 13:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 14:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 15:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: cols, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 16:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 17:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 18:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 19:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 20:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 21:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 22:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 23:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 24:
                                _a.sent();
                                return [4, mouseDown('right')];
                            case 25:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 26:
                                _a.sent();
                                return [4, mouseUp('right')];
                            case 27:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } }])];
                            case 28:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 29:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 30:
                                _a.sent();
                                return [4, page.keyboard.down('Control')];
                            case 31:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 32:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 33:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 34:
                                _a.sent();
                                return [4, page.keyboard.up('Control')];
                            case 35:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 36:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 37:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 38:
                                _a.sent();
                                return [4, page.keyboard.down('Alt')];
                            case 39:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 40:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 41:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 42:
                                _a.sent();
                                return [4, page.keyboard.up('Alt')];
                            case 43:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 44:
                                _a.sent();
                                return [4, mouseMove(43, 24)];
                            case 45:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 46:
                                _a.sent();
                                return [4, page.keyboard.down('Shift')];
                            case 47:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 48:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 49:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 50:
                                _a.sent();
                                return [4, page.keyboard.up('Shift')];
                            case 51:
                                _a.sent();
                                if (!noShift) return [3, 53];
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                            case 52:
                                _a.sent();
                                return [3, 55];
                            case 53: return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                            case 54:
                                _a.sent();
                                _a.label = 55;
                            case 55: return [4, mouseMove(43, 24)];
                            case 56:
                                _a.sent();
                                return [4, getReports(encoding)];
                            case 57:
                                _a.sent();
                                return [4, page.keyboard.down('Control')];
                            case 58:
                                _a.sent();
                                return [4, page.keyboard.down('Alt')];
                            case 59:
                                _a.sent();
                                return [4, mouseDown('left')];
                            case 60:
                                _a.sent();
                                return [4, mouseMove(44, 24)];
                            case 61:
                                _a.sent();
                                return [4, mouseUp('left')];
                            case 62:
                                _a.sent();
                                return [4, page.keyboard.up('Control')];
                            case 63:
                                _a.sent();
                                return [4, page.keyboard.up('Alt')];
                            case 64:
                                _a.sent();
                                return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [{ col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }])];
                            case 65:
                                _a.sent();
                                return [2];
                        }
                    });
                }); });
                return [2];
            });
        }); });
        describe('DECSET 1000 (VT200 mouse)', function () {
            itMouse('default encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                var encoding;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encoding = 'DEFAULT';
                            return [4, resetMouseModes()];
                        case 1:
                            _a.sent();
                            return [4, mouseMove(0, 0)];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?1000h')];
                        case 3:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 4:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 5:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 7:
                            _a.sent();
                            return [4, mouseMove(50, 10)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                        case 9:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 10:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 11:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 51, row: 11, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 12:
                            _a.sent();
                            return [4, mouseMove(223 - 1, rows - 1)];
                        case 13:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 14:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 15:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 223, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 223, row: rows, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 16:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 17:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 18:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 19:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 20:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 21:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 22:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 23:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 24:
                            _a.sent();
                            return [4, mouseDown('right')];
                        case 25:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 26:
                            _a.sent();
                            return [4, mouseUp('right')];
                        case 27:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 28:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 29:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 30:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 31:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 32:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 33:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 34:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 35:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: true, shift: false, meta: false } } }
                                ])];
                        case 36:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 37:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 38:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 39:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 40:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 41:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 42:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 43:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: true } } }
                                ])];
                        case 44:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 45:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 46:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 47:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 48:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 49:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 50:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 51:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 52:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 53:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: true, shift: false, meta: true } } }
                                ])];
                        case 54:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            itMouse('SGR encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                var encoding;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encoding = 'SGR';
                            return [4, resetMouseModes()];
                        case 1:
                            _a.sent();
                            return [4, mouseMove(0, 0)];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?1000h\x1b[?1006h')];
                        case 3:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 4:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 5:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 7:
                            _a.sent();
                            return [4, mouseMove(50, 10)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                        case 9:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 10:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 11:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 51, row: 11, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 12:
                            _a.sent();
                            return [4, mouseMove(cols - 1, rows - 1)];
                        case 13:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 14:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 15:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: cols, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: cols, row: rows, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 16:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 17:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 18:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 19:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 20:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 21:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 22:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 23:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 24:
                            _a.sent();
                            return [4, mouseDown('right')];
                        case 25:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 26:
                            _a.sent();
                            return [4, mouseUp('right')];
                        case 27:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'right', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 28:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 29:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 30:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 31:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 32:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 33:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 34:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 35:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: true, shift: false, meta: false } } }
                                ])];
                        case 36:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 37:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 38:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 39:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 40:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 41:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 42:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 43:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: true } } }
                                ])];
                        case 44:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 45:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 46:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 47:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 48:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 49:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 50:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 51:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 52:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 53:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: true, shift: false, meta: true } } }
                                ])];
                        case 54:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        describe('DECSET 1002 (xterm with drag)', function () {
            itMouse('default encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                var encoding;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encoding = 'DEFAULT';
                            return [4, resetMouseModes()];
                        case 1:
                            _a.sent();
                            return [4, mouseMove(0, 0)];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?1002h')];
                        case 3:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 4:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 5:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 7:
                            _a.sent();
                            return [4, mouseMove(50, 10)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                        case 9:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 10:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 11:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 51, row: 11, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 12:
                            _a.sent();
                            return [4, mouseMove(223 - 1, rows - 1)];
                        case 13:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 14:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 15:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 223, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 223, row: rows, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 16:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 17:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 18:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 19:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 20:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 21:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 22:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 23:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 24:
                            _a.sent();
                            return [4, mouseDown('right')];
                        case 25:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 26:
                            _a.sent();
                            return [4, mouseUp('right')];
                        case 27:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 28:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 29:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 30:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 31:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 32:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 33:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 34:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 35:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: true, shift: false, meta: false } } }
                                ])];
                        case 36:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 37:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 38:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 39:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 40:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 41:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 42:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 43:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: true } } }
                                ])];
                        case 44:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 45:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 46:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 47:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 48:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 49:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 50:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 51:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 52:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 53:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: true, shift: false, meta: true } } }
                                ])];
                        case 54:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            itMouse('SGR encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                var encoding;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encoding = 'SGR';
                            return [4, resetMouseModes()];
                        case 1:
                            _a.sent();
                            return [4, mouseMove(0, 0)];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?1002h\x1b[?1006h')];
                        case 3:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 4:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 5:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 7:
                            _a.sent();
                            return [4, mouseMove(50, 10)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [])];
                        case 9:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 10:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 11:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 51, row: 11, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 12:
                            _a.sent();
                            return [4, mouseMove(cols - 1, rows - 1)];
                        case 13:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 14:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 15:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: cols, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: cols, row: rows, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 16:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 17:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 18:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 19:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 20:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 21:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 22:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 23:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 24:
                            _a.sent();
                            return [4, mouseDown('right')];
                        case 25:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 26:
                            _a.sent();
                            return [4, mouseUp('right')];
                        case 27:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'right', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 28:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 29:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 30:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 31:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 32:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 33:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 34:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 35:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: true, shift: false, meta: false } } }
                                ])];
                        case 36:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 37:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 38:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 39:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 40:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 41:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 42:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 43:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: true } } }
                                ])];
                        case 44:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 45:
                            _a.sent();
                            return [4, getReports(encoding)];
                        case 46:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 47:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 48:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 49:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 50:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 51:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 52:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 53:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: true, shift: false, meta: true } } }
                                ])];
                        case 54:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        describe('DECSET 1003 (xterm any event)', function () {
            itMouse('default encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                var encoding;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encoding = 'DEFAULT';
                            return [4, resetMouseModes()];
                        case 1:
                            _a.sent();
                            return [4, mouseMove(0, 0)];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?1003h')];
                        case 3:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 4:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 5:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 7:
                            _a.sent();
                            return [4, mouseMove(50, 10)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 9:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 10:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 11:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 51, row: 11, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 12:
                            _a.sent();
                            return [4, mouseMove(223 - 1, rows - 1)];
                        case 13:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 14:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 15:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 223, row: rows, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 223, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 223, row: rows, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 16:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 17:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 18:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 19:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 20:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 21:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 22:
                            _a.sent();
                            return [4, mouseDown('right')];
                        case 23:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 24:
                            _a.sent();
                            return [4, mouseUp('right')];
                        case 25:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 26:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 27:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 28:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 29:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 30:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 31:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 32:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: true, shift: false, meta: false } } }
                                ])];
                        case 33:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 34:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 35:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 36:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 37:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 38:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 39:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: false, shift: false, meta: true } } }
                                ])];
                        case 40:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 41:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 42:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 43:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 44:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 45:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 46:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 47:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 48:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: '<none>', modifier: { control: true, shift: false, meta: true } } }
                                ])];
                        case 49:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
            itMouse('SGR encoding', function () { return __awaiter(void 0, void 0, void 0, function () {
                var encoding;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encoding = 'SGR';
                            return [4, resetMouseModes()];
                        case 1:
                            _a.sent();
                            return [4, mouseMove(0, 0)];
                        case 2:
                            _a.sent();
                            return [4, (0, TestUtils_1.writeSync)(page, '\x1b[?1003h\x1b[?1006h')];
                        case 3:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 4:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 5:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 6:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 1, row: 1, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 7:
                            _a.sent();
                            return [4, mouseMove(50, 10)];
                        case 8:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 9:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 10:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 11:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 51, row: 11, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 51, row: 11, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 12:
                            _a.sent();
                            return [4, mouseMove(cols - 1, rows - 1)];
                        case 13:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 14:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 15:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: cols, row: rows, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } },
                                    { col: cols, row: rows, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: cols, row: rows, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 16:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 17:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 18:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 19:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 20:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 21:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 22:
                            _a.sent();
                            return [4, mouseDown('right')];
                        case 23:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 24:
                            _a.sent();
                            return [4, mouseUp('right')];
                        case 25:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'right', modifier: { control: false, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'right', modifier: { control: false, shift: false, meta: false } } }
                                ])];
                        case 26:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 27:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 28:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 29:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 30:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 31:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 32:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: false } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: true, shift: false, meta: false } } }
                                ])];
                        case 33:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 34:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 35:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 36:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 37:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 38:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 39:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: false, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: false, shift: false, meta: true } } }
                                ])];
                        case 40:
                            _a.sent();
                            return [4, page.keyboard.down('Control')];
                        case 41:
                            _a.sent();
                            return [4, page.keyboard.down('Alt')];
                        case 42:
                            _a.sent();
                            return [4, mouseMove(43, 24)];
                        case 43:
                            _a.sent();
                            return [4, mouseDown('left')];
                        case 44:
                            _a.sent();
                            return [4, mouseMove(44, 24)];
                        case 45:
                            _a.sent();
                            return [4, mouseUp('left')];
                        case 46:
                            _a.sent();
                            return [4, page.keyboard.up('Control')];
                        case 47:
                            _a.sent();
                            return [4, page.keyboard.up('Alt')];
                        case 48:
                            _a.sent();
                            return [4, (0, TestUtils_1.pollFor)(page, function () { return getReports(encoding); }, [
                                    { col: 44, row: 25, state: { action: 'move', button: '<none>', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 44, row: 25, state: { action: 'press', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'move', button: 'left', modifier: { control: true, shift: false, meta: true } } },
                                    { col: 45, row: 25, state: { action: 'release', button: 'left', modifier: { control: true, shift: false, meta: true } } }
                                ])];
                        case 49:
                            _a.sent();
                            return [2];
                    }
                });
            }); });
        });
        return [2];
    });
}); });
//# sourceMappingURL=MouseTracking.api.js.map