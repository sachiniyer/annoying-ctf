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
const fs_1 = require("fs");
const path_1 = require("path");
const TestUtils_1 = require("../../../out-test/api/TestUtils");
const APP = 'http://127.0.0.1:3001/test';
let browser;
let page;
const width = 800;
const height = 600;
describe('Search Tests', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            browser = yield (0, TestUtils_1.launchBrowser)();
            page = yield (yield browser.newContext()).newPage();
            yield page.setViewportSize({ width, height });
            yield page.goto(APP);
            yield (0, TestUtils_1.openTerminal)(page);
        });
    });
    after(() => {
        browser.close();
    });
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(`
      window.term.reset()
      window.search?.dispose();
      window.search = new SearchAddon();
      window.term.loadAddon(window.search);
    `);
    }));
    it('Simple Search', () => __awaiter(this, void 0, void 0, function* () {
        yield (0, TestUtils_1.writeSync)(page, 'dafhdjfldshafhldsahfkjhldhjkftestlhfdsakjfhdjhlfdsjkafhjdlk');
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('test')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), 'test');
    }));
    it('Scrolling Search', () => __awaiter(this, void 0, void 0, function* () {
        let dataString = '';
        for (let i = 0; i < 100; i++) {
            if (i === 52) {
                dataString += '$^1_3{}test$#';
            }
            dataString += makeData(50);
        }
        yield (0, TestUtils_1.writeSync)(page, dataString);
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('$^1_3{}test$#')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), '$^1_3{}test$#');
    }));
    it('Incremental Find Previous', () => __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(`window.term.writeln('package.jsonc\\n')`);
        yield (0, TestUtils_1.writeSync)(page, 'package.json pack package.lock');
        yield page.evaluate(`window.search.findPrevious('pack', {incremental: true})`);
        let line = yield page.evaluate(`window.term.buffer.active.getLine(window.term.getSelectionPosition().start.y).translateToString()`);
        let selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
        chai_1.assert.deepEqual(line.substring(selectionPosition.start.x, selectionPosition.end.x + 8), 'package.lock');
        yield page.evaluate(`window.search.findPrevious('package.j', {incremental: true})`);
        selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
        chai_1.assert.deepEqual(line.substring(selectionPosition.start.x, selectionPosition.end.x + 3), 'package.json');
        yield page.evaluate(`window.search.findPrevious('package.jsonc', {incremental: true})`);
        line = yield page.evaluate(`window.term.buffer.active.getLine(window.term.getSelectionPosition().start.y).translateToString()`);
        selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
        chai_1.assert.deepEqual(line.substring(selectionPosition.start.x, selectionPosition.end.x), 'package.jsonc');
    }));
    it('Incremental Find Next', () => __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(`window.term.writeln('package.lock pack package.json package.ups\\n')`);
        yield (0, TestUtils_1.writeSync)(page, 'package.jsonc');
        yield page.evaluate(`window.search.findNext('pack', {incremental: true})`);
        let line = yield page.evaluate(`window.term.buffer.active.getLine(window.term.getSelectionPosition().start.y).translateToString()`);
        let selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
        chai_1.assert.deepEqual(line.substring(selectionPosition.start.x, selectionPosition.end.x + 8), 'package.lock');
        yield page.evaluate(`window.search.findNext('package.j', {incremental: true})`);
        selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
        chai_1.assert.deepEqual(line.substring(selectionPosition.start.x, selectionPosition.end.x + 3), 'package.json');
        yield page.evaluate(`window.search.findNext('package.jsonc', {incremental: true})`);
        line = yield page.evaluate(`window.term.buffer.active.getLine(window.term.getSelectionPosition().start.y).translateToString()`);
        selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
        chai_1.assert.deepEqual(line.substring(selectionPosition.start.x, selectionPosition.end.x), 'package.jsonc');
    }));
    it('Simple Regex', () => __awaiter(this, void 0, void 0, function* () {
        yield (0, TestUtils_1.writeSync)(page, 'abc123defABCD');
        yield page.evaluate(`window.search.findNext('[a-z]+', {regex: true})`);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), 'abc');
        yield page.evaluate(`window.search.findNext('[A-Z]+', {regex: true, caseSensitive: true})`);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), 'ABCD');
    }));
    it('Search for single result twice should not unselect it', () => __awaiter(this, void 0, void 0, function* () {
        yield (0, TestUtils_1.writeSync)(page, 'abc def');
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('abc')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), 'abc');
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('abc')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), 'abc');
    }));
    it('Search for result bounding with wide unicode chars', () => __awaiter(this, void 0, void 0, function* () {
        yield (0, TestUtils_1.writeSync)(page, '中文xx𝄞𝄞');
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('中')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), '中');
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('xx')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), 'xx');
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('𝄞')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelection()`), '𝄞');
        chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('𝄞')`), true);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.getSelectionPosition()`), {
            start: {
                x: 7,
                y: 0
            },
            end: {
                x: 8,
                y: 0
            }
        });
    }));
    describe('onDidChangeResults', () => __awaiter(this, void 0, void 0, function* () {
        describe('findNext', () => {
            it('should not fire unless the decorations option is set', () => __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(`
          window.calls = [];
          window.search.onDidChangeResults(e => window.calls.push(e));
        `);
                yield (0, TestUtils_1.writeSync)(page, 'abc');
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('a')`), true);
                chai_1.assert.strictEqual(yield page.evaluate('window.calls.length'), 0);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('b', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.strictEqual(yield page.evaluate('window.calls.length'), 1);
            }));
            it('should fire with correct event values', () => __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(`
          window.calls = [];
          window.search.onDidChangeResults(e => window.calls.push(e));
        `);
                yield (0, TestUtils_1.writeSync)(page, 'abc bc c');
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('a', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 }
                ]);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('b', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 }
                ]);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('d', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), false);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 0, resultIndex: -1 }
                ]);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('c', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('c', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findNext('c', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 0, resultIndex: -1 },
                    { resultCount: 3, resultIndex: 0 },
                    { resultCount: 3, resultIndex: 1 },
                    { resultCount: 3, resultIndex: 2 }
                ]);
            }));
            it('should fire with correct event values (incremental)', () => __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(`
          window.calls = [];
          window.search.onDidChangeResults(e => window.calls.push(e));
        `);
                yield (0, TestUtils_1.writeSync)(page, 'abc aabc');
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findNext('a', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 0 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findNext('ab', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findNext('abc', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findNext('abc', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 1 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findNext('abcd', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), false);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 0, resultIndex: -1 }
                ]);
            }));
        });
        describe('findPrevious', () => {
            it('should not fire unless the decorations option is set', () => __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(`
          window.calls = [];
          window.search.onDidChangeResults(e => window.calls.push(e));
        `);
                yield (0, TestUtils_1.writeSync)(page, 'abc');
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('a')`), true);
                chai_1.assert.strictEqual(yield page.evaluate('window.calls.length'), 0);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('b', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.strictEqual(yield page.evaluate('window.calls.length'), 1);
            }));
            it('should fire with correct event values', () => __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(`
          window.calls = [];
          window.search.onDidChangeResults(e => window.calls.push(e));
        `);
                yield (0, TestUtils_1.writeSync)(page, 'abc bc c');
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('a', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 }
                ]);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('b', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 1 }
                ]);
                yield (0, TestUtils_1.timeout)(2000);
                chai_1.assert.strictEqual(yield page.evaluate(`debugger; window.search.findPrevious('d', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), false);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 0, resultIndex: -1 }
                ]);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('c', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('c', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('c', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 1, resultIndex: 0 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 0, resultIndex: -1 },
                    { resultCount: 3, resultIndex: 2 },
                    { resultCount: 3, resultIndex: 1 },
                    { resultCount: 3, resultIndex: 0 }
                ]);
            }));
            it('should fire with correct event values (incremental)', () => __awaiter(this, void 0, void 0, function* () {
                yield page.evaluate(`
          window.calls = [];
          window.search.onDidChangeResults(e => window.calls.push(e));
        `);
                yield (0, TestUtils_1.writeSync)(page, 'abc aabc');
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findPrevious('a', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 2 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findPrevious('ab', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 2 },
                    { resultCount: 2, resultIndex: 1 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findPrevious('abc', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 2 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 2, resultIndex: 1 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findPrevious('abc', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 2 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 2, resultIndex: 0 }
                ]);
                chai_1.assert.deepStrictEqual(yield page.evaluate(`window.search.findPrevious('abcd', { incremental: true, decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), false);
                chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                    { resultCount: 3, resultIndex: 2 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 2, resultIndex: 1 },
                    { resultCount: 2, resultIndex: 0 },
                    { resultCount: 0, resultIndex: -1 }
                ]);
            }));
        });
    }));
    describe('Regression tests', () => {
        describe('#2444 wrapped line content not being found', () => {
            let fixture;
            before(() => __awaiter(this, void 0, void 0, function* () {
                const rawFixture = yield new Promise(r => (0, fs_1.readFile)((0, path_1.resolve)(__dirname, '../fixtures/issue-2444'), (err, data) => r(data)));
                if (process.platform === 'win32') {
                    fixture = rawFixture.toString()
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r');
                }
                else {
                    fixture = rawFixture.toString()
                        .replace(/\n/g, '\\n\\r');
                }
                fixture = fixture
                    .replace(/'/g, `\\'`);
            }));
            it('should find all occurrences using findNext', () => __awaiter(this, void 0, void 0, function* () {
                yield (0, TestUtils_1.writeSync)(page, fixture);
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                let selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 24, y: 53 }, end: { x: 30, y: 53 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 24, y: 76 }, end: { x: 30, y: 76 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 24, y: 96 }, end: { x: 30, y: 96 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 1, y: 114 }, end: { x: 7, y: 114 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 11, y: 115 }, end: { x: 17, y: 115 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 1, y: 126 }, end: { x: 7, y: 126 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 11, y: 127 }, end: { x: 17, y: 127 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 1, y: 135 }, end: { x: 7, y: 135 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 11, y: 136 }, end: { x: 17, y: 136 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findNext('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 24, y: 53 }, end: { x: 30, y: 53 } });
            }));
            it('should y all occurrences using findPrevious', () => __awaiter(this, void 0, void 0, function* () {
                yield (0, TestUtils_1.writeSync)(page, fixture);
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                let selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 11, y: 136 }, end: { x: 17, y: 136 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 1, y: 135 }, end: { x: 7, y: 135 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 11, y: 127 }, end: { x: 17, y: 127 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 1, y: 126 }, end: { x: 7, y: 126 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 11, y: 115 }, end: { x: 17, y: 115 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 1, y: 114 }, end: { x: 7, y: 114 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 24, y: 96 }, end: { x: 30, y: 96 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 24, y: 76 }, end: { x: 30, y: 76 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 24, y: 53 }, end: { x: 30, y: 53 } });
                chai_1.assert.deepEqual(yield page.evaluate(`window.search.findPrevious('opencv')`), true);
                selectionPosition = yield page.evaluate(`window.term.getSelectionPosition()`);
                chai_1.assert.deepEqual(selectionPosition, { start: { x: 11, y: 136 }, end: { x: 17, y: 136 } });
            }));
        });
    });
    describe('#3834 lines with null characters before search terms', () => {
        it('should find all matches on a line containing null characters', () => __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate(`
        window.calls = [];
        window.search.onDidChangeResults(e => window.calls.push(e));
      `);
            yield (0, TestUtils_1.writeSync)(page, '\\x1b[CHi Hi');
            chai_1.assert.strictEqual(yield page.evaluate(`window.search.findPrevious('h', { decorations: { activeMatchColorOverviewRuler: '#ff0000' } })`), true);
            chai_1.assert.deepStrictEqual(yield page.evaluate('window.calls'), [
                { resultCount: 2, resultIndex: 1 }
            ]);
        }));
    });
});
function makeData(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
//# sourceMappingURL=SearchAddon.api.js.map