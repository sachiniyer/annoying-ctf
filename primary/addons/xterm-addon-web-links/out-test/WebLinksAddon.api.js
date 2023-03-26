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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const TestUtils_1 = require("../../../out-test/api/TestUtils");
const APP = 'http://127.0.0.1:3001/test';
let browser;
let page;
const width = 800;
const height = 600;
describe('WebLinksAddon', () => {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            browser = yield (0, TestUtils_1.launchBrowser)();
            page = yield (yield browser.newContext()).newPage();
            yield page.setViewportSize({ width, height });
        });
    });
    after(() => __awaiter(void 0, void 0, void 0, function* () { return yield browser.close(); }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield page.goto(APP); }));
    it('.com', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield testHostName('foo.com');
        });
    });
    it('.com.au', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield testHostName('foo.com.au');
        });
    });
    it('.io', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield testHostName('foo.io');
        });
    });
    describe('correct buffer offsets & uri', () => {
        it('all half width', () => __awaiter(void 0, void 0, void 0, function* () {
            setupCustom();
            yield (0, TestUtils_1.writeSync)(page, 'aaa http://example.com aaa http://example.com aaa');
            yield resetAndHover(5, 1);
            yield evalLinkStateData('http://example.com', { start: { x: 5, y: 1 }, end: { x: 22, y: 1 } });
            yield resetAndHover(1, 2);
            yield evalLinkStateData('http://example.com', { start: { x: 28, y: 1 }, end: { x: 5, y: 2 } });
        }));
        it('url after full width', () => __awaiter(void 0, void 0, void 0, function* () {
            setupCustom();
            yield (0, TestUtils_1.writeSync)(page, '￥￥￥ http://example.com ￥￥￥ http://example.com aaa');
            yield resetAndHover(8, 1);
            yield evalLinkStateData('http://example.com', { start: { x: 8, y: 1 }, end: { x: 25, y: 1 } });
            yield resetAndHover(1, 2);
            yield evalLinkStateData('http://example.com', { start: { x: 34, y: 1 }, end: { x: 11, y: 2 } });
        }));
        it('full width within url and before', () => __awaiter(void 0, void 0, void 0, function* () {
            setupCustom();
            yield (0, TestUtils_1.writeSync)(page, '￥￥￥ https://ko.wikipedia.org/wiki/위키백과:대문 aaa https://ko.wikipedia.org/wiki/위키백과:대문 ￥￥￥');
            yield resetAndHover(8, 1);
            yield evalLinkStateData('https://ko.wikipedia.org/wiki/위키백과:대문', { start: { x: 8, y: 1 }, end: { x: 11, y: 2 } });
            yield resetAndHover(1, 2);
            yield evalLinkStateData('https://ko.wikipedia.org/wiki/위키백과:대문', { start: { x: 8, y: 1 }, end: { x: 11, y: 2 } });
            yield resetAndHover(17, 2);
            yield evalLinkStateData('https://ko.wikipedia.org/wiki/위키백과:대문', { start: { x: 17, y: 2 }, end: { x: 19, y: 3 } });
        }));
        it('name + password url after full width and combining', () => __awaiter(void 0, void 0, void 0, function* () {
            setupCustom();
            yield (0, TestUtils_1.writeSync)(page, '￥￥￥cafe\u0301 http://test:password@example.com/some_path');
            yield resetAndHover(12, 1);
            yield evalLinkStateData('http://test:password@example.com/some_path', { start: { x: 12, y: 1 }, end: { x: 13, y: 2 } });
            yield resetAndHover(13, 2);
            yield evalLinkStateData('http://test:password@example.com/some_path', { start: { x: 12, y: 1 }, end: { x: 13, y: 2 } });
        }));
    });
});
function testHostName(hostname) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, TestUtils_1.openTerminal)(page, { cols: 40 });
        yield page.evaluate(`window.term.loadAddon(new window.WebLinksAddon())`);
        const data = `  http://${hostname}  \\r\\n` +
            `  http://${hostname}/a~b#c~d?e~f  \\r\\n` +
            `  http://${hostname}/colon:test  \\r\\n` +
            `  http://${hostname}/colon:test:  \\r\\n` +
            `"http://${hostname}/"\\r\\n` +
            `\\'http://${hostname}/\\'\\r\\n` +
            `http://${hostname}/subpath/+/id`;
        yield (0, TestUtils_1.writeSync)(page, data);
        yield pollForLinkAtCell(3, 1, `http://${hostname}`);
        yield pollForLinkAtCell(3, 2, `http://${hostname}/a~b#c~d?e~f`);
        yield pollForLinkAtCell(3, 3, `http://${hostname}/colon:test`);
        yield pollForLinkAtCell(3, 4, `http://${hostname}/colon:test`);
        yield pollForLinkAtCell(2, 5, `http://${hostname}/`);
        yield pollForLinkAtCell(2, 6, `http://${hostname}/`);
        yield pollForLinkAtCell(1, 7, `http://${hostname}/subpath/+/id`);
    });
}
function pollForLinkAtCell(col, row, value) {
    return __awaiter(this, void 0, void 0, function* () {
        const rowSelector = `.xterm-rows > :nth-child(${row})`;
        yield (0, TestUtils_1.pollFor)(page, `!!document.querySelector('${rowSelector} > :nth-child(${col})')`, true);
        yield (0, TestUtils_1.pollFor)(page, `document.querySelectorAll('${rowSelector} > span[style]').length >= ${value.length}`, true, () => __awaiter(this, void 0, void 0, function* () { return page.hover(`${rowSelector} > :nth-child(${col})`); }));
        chai_1.assert.equal(yield page.evaluate(`Array.prototype.reduce.call(document.querySelectorAll('${rowSelector} > span[style]'), (a, b) => a + b.textContent, '');`), value);
    });
}
function setupCustom() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, TestUtils_1.openTerminal)(page, { cols: 40 });
        yield page.evaluate(`window._linkStateData = {};
window._linkaddon = new window.WebLinksAddon();
window._linkaddon._options.hover = (event, uri, range) => { window._linkStateData = { uri, range }; };
window.term.loadAddon(window._linkaddon);`);
    });
}
function resetAndHover(col, row) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(`window._linkStateData = {};`);
        const rowSelector = `.xterm-rows > :nth-child(${row})`;
        yield page.hover(`${rowSelector} > :nth-child(${col})`);
    });
}
function evalLinkStateData(uri, range) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield page.evaluate(`window._linkStateData`);
        chai_1.assert.equal(data.uri, uri);
        chai_1.assert.deepEqual(data.range, range);
    });
}
//# sourceMappingURL=WebLinksAddon.api.js.map