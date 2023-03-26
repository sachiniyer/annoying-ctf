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
const width = 1024;
const height = 768;
describe('FitAddon', () => {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            browser = yield (0, TestUtils_1.launchBrowser)();
            page = yield (yield browser.newContext()).newPage();
            yield page.setViewportSize({ width, height });
            yield page.goto(APP);
        });
    });
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate(`document.querySelector('#terminal-container').style.display=''`);
            yield (0, TestUtils_1.openTerminal)(page);
        });
    });
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield browser.close();
    }));
    afterEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate(`window.term.dispose()`);
        });
    });
    it('no terminal', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate(`window.fit = new FitAddon();`);
            chai_1.assert.equal(yield page.evaluate(`window.fit.proposeDimensions()`), undefined);
        });
    });
    describe('proposeDimensions', () => {
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            return yield unloadFit();
        }));
        it('default', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loadFit();
                const dimensions = yield page.evaluate(`window.fit.proposeDimensions()`);
                chai_1.assert.isAbove(dimensions.cols, 85);
                chai_1.assert.isBelow(dimensions.cols, 88);
                chai_1.assert.isAbove(dimensions.rows, 24);
                chai_1.assert.isBelow(dimensions.rows, 29);
            });
        });
        it('width', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loadFit(1008);
                const dimensions = yield page.evaluate(`window.fit.proposeDimensions()`);
                chai_1.assert.isAbove(dimensions.cols, 108);
                chai_1.assert.isBelow(dimensions.cols, 111);
                chai_1.assert.isAbove(dimensions.rows, 24);
                chai_1.assert.isBelow(dimensions.rows, 29);
            });
        });
        it('small', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loadFit(1, 1);
                chai_1.assert.deepEqual(yield page.evaluate(`window.fit.proposeDimensions()`), {
                    cols: 2,
                    rows: 1
                });
            });
        });
        it('hidden', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(`window.term.dispose()`);
                yield page.evaluate(`document.querySelector('#terminal-container').style.display='none'`);
                yield page.evaluate(`window.term = new Terminal()`);
                yield page.evaluate(`window.term.open(document.querySelector('#terminal-container'))`);
                yield loadFit();
                chai_1.assert.equal(yield page.evaluate(`window.fit.proposeDimensions()`), undefined);
            });
        });
    });
    describe('fit', () => {
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            return yield unloadFit();
        }));
        it('default', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loadFit();
                yield page.evaluate(`window.fit.fit()`);
                const cols = yield page.evaluate(`window.term.cols`);
                const rows = yield page.evaluate(`window.term.rows`);
                chai_1.assert.isAbove(cols, 85);
                chai_1.assert.isBelow(cols, 88);
                chai_1.assert.isAbove(rows, 24);
                chai_1.assert.isBelow(rows, 29);
            });
        });
        it('width', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loadFit(1008);
                yield page.evaluate(`window.fit.fit()`);
                const cols = yield page.evaluate(`window.term.cols`);
                const rows = yield page.evaluate(`window.term.rows`);
                chai_1.assert.isAbove(cols, 108);
                chai_1.assert.isBelow(cols, 111);
                chai_1.assert.isAbove(rows, 24);
                chai_1.assert.isBelow(rows, 29);
            });
        });
        it('small', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loadFit(1, 1);
                yield page.evaluate(`window.fit.fit()`);
                chai_1.assert.equal(yield page.evaluate(`window.term.cols`), 2);
                chai_1.assert.equal(yield page.evaluate(`window.term.rows`), 1);
            });
        });
    });
});
function loadFit(width = 800, height = 450) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(`
    window.fit = new FitAddon();
    window.term.loadAddon(window.fit);
    document.querySelector('#terminal-container').style.width='${width}px';
    document.querySelector('#terminal-container').style.height='${height}px';
  `);
    });
}
function unloadFit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(`window.fit.dispose();`);
    });
}
//# sourceMappingURL=FitAddon.api.js.map