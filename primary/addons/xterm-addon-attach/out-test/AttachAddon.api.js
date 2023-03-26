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
const WebSocket = require("ws");
const TestUtils_1 = require("../../../out-test/api/TestUtils");
const APP = 'http://127.0.0.1:3001/test';
let browser;
let page;
const width = 800;
const height = 600;
describe('AttachAddon', () => {
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
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () { return yield page.goto(APP); }));
    it('string', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, TestUtils_1.openTerminal)(page);
            const port = 8080;
            const server = new WebSocket.Server({ port });
            server.on('connection', socket => socket.send('foo'));
            yield page.evaluate(`window.term.loadAddon(new window.AttachAddon(new WebSocket('ws://localhost:${port}')))`);
            yield (0, TestUtils_1.pollFor)(page, `window.term.buffer.active.getLine(0).translateToString(true)`, 'foo');
            server.close();
        });
    });
    it('utf8', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, TestUtils_1.openTerminal)(page);
            const port = 8080;
            const server = new WebSocket.Server({ port });
            const data = new Uint8Array([102, 111, 111]);
            server.on('connection', socket => socket.send(data));
            yield page.evaluate(`window.term.loadAddon(new window.AttachAddon(new WebSocket('ws://localhost:${port}')))`);
            yield (0, TestUtils_1.pollFor)(page, `window.term.buffer.active.getLine(0).translateToString(true)`, 'foo');
            server.close();
        });
    });
});
//# sourceMappingURL=AttachAddon.api.js.map