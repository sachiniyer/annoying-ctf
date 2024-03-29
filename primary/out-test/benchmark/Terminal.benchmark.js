"use strict";
/**
 * Copyright (c) 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 */
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
const xterm_benchmark_1 = require("xterm-benchmark");
const node_pty_1 = require("node-pty");
const TextDecoder_1 = require("common/input/TextDecoder");
const Terminal_1 = require("browser/Terminal");
(0, xterm_benchmark_1.perfContext)('Terminal: ls -lR /usr/lib', () => {
    let content = '';
    let contentUtf8;
    (0, xterm_benchmark_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        // grab output from "ls -lR /usr"
        const p = (0, node_pty_1.spawn)('ls', ['--color=auto', '-lR', '/usr/lib'], {
            name: 'xterm-256color',
            cols: 80,
            rows: 25,
            cwd: process.env.HOME,
            env: process.env,
            encoding: null // needs to be fixed in node-pty
        });
        const chunks = [];
        let length = 0;
        p.on('data', data => {
            chunks.push(data);
            length += data.length;
        });
        yield new Promise(resolve => p.on('exit', () => resolve()));
        contentUtf8 = Buffer.concat(chunks, length);
        // translate to content string
        const buffer = new Uint32Array(contentUtf8.length);
        const decoder = new TextDecoder_1.Utf8ToUtf32();
        const codepoints = decoder.decode(contentUtf8, buffer);
        for (let i = 0; i < codepoints; ++i) {
            content += (0, TextDecoder_1.stringFromCodePoint)(buffer[i]);
            // peek into content to force flat repr in v8
            if (!(i % 10000000)) {
                content[i];
            }
        }
    }));
    (0, xterm_benchmark_1.perfContext)('write/string/async', () => {
        let terminal;
        (0, xterm_benchmark_1.before)(() => {
            terminal = new Terminal_1.Terminal({ cols: 80, rows: 25, scrollback: 1000 });
        });
        new xterm_benchmark_1.ThroughputRuntimeCase('', () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise(res => terminal.write(content, res));
            return { payloadSize: contentUtf8.length };
        }), { fork: false }).showAverageThroughput();
    });
    (0, xterm_benchmark_1.perfContext)('write/Utf8/async', () => {
        let terminal;
        (0, xterm_benchmark_1.before)(() => {
            terminal = new Terminal_1.Terminal({ cols: 80, rows: 25, scrollback: 1000 });
        });
        new xterm_benchmark_1.ThroughputRuntimeCase('', () => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise(res => terminal.write(content, res));
            return { payloadSize: contentUtf8.length };
        }), { fork: false }).showAverageThroughput();
    });
});
