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
describe('Unicode11Addon', () => {
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            browser = yield (0, TestUtils_1.launchBrowser)();
            page = yield (yield browser.newContext()).newPage();
            yield page.setViewportSize({ width, height });
        });
    });
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield browser.close();
    }));
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.goto(APP);
            yield (0, TestUtils_1.openTerminal)(page);
        });
    });
    it('wcwidth V11 emoji test', () => __awaiter(void 0, void 0, void 0, function* () {
        yield page.evaluate(`
      window.unicode11 = new Unicode11Addon();
      window.term.loadAddon(window.unicode11);
    `);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.unicode.versions`), ['6', '11']);
        yield page.evaluate(`window.term.unicode.activeVersion = '11';`);
        chai_1.assert.deepEqual(yield page.evaluate(`window.term.unicode.activeVersion`), '11');
        chai_1.assert.deepEqual(yield page.evaluate(`window.term._core.unicodeService.getStringCellWidth('🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣')`), 20);
    }));
});
//# sourceMappingURL=Unicode11Addon.api.js.map