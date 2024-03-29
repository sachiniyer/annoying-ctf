"use strict";
/**
 * Copyright (c) 2018 The xterm.js authors. All rights reserved.
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableLigatures = void 0;
const font_1 = require("./font");
// Caches 100K characters worth of ligatures. In practice this works out to
// about 650 KB worth of cache, when a moderate number of ligatures are present.
const CACHE_SIZE = 100000;
/**
 * Enable ligature support for the provided Terminal instance. To function
 * properly, this must be called after `open()` is called on the therminal. If
 * the font currently in use supports ligatures, the terminal will automatically
 * start to render them.
 * @param term Terminal instance from xterm.js
 */
function enableLigatures(term, fallbackLigatures = []) {
    let currentFontName = undefined;
    let font = undefined;
    let loadingState = 0 /* LoadingState.UNLOADED */;
    let loadError = undefined;
    return term.registerCharacterJoiner((text) => {
        // If the font hasn't been loaded yet, load it and return an empty result
        const termFont = term.options.fontFamily;
        if (termFont &&
            (loadingState === 0 /* LoadingState.UNLOADED */ || currentFontName !== termFont)) {
            font = undefined;
            loadingState = 1 /* LoadingState.LOADING */;
            currentFontName = termFont;
            const currentCallFontName = currentFontName;
            (0, font_1.default)(currentCallFontName, CACHE_SIZE)
                .then(f => {
                // Another request may have come in while we were waiting, so make
                // sure our font is still vaild.
                if (currentCallFontName === term.options.fontFamily) {
                    loadingState = 2 /* LoadingState.LOADED */;
                    font = f;
                    // Only refresh things if we actually found a font
                    if (f) {
                        term.refresh(0, term.rows - 1);
                    }
                }
            })
                .catch(e => {
                // Another request may have come in while we were waiting, so make
                // sure our font is still vaild.
                if (currentCallFontName === term.options.fontFamily) {
                    loadingState = 3 /* LoadingState.FAILED */;
                    if (term.options.logLevel === 'debug') {
                        console.debug(loadError, new Error('Failure while loading font'));
                    }
                    font = undefined;
                    loadError = e;
                }
            });
        }
        if (font && loadingState === 2 /* LoadingState.LOADED */) {
            // We clone the entries to avoid the internal cache of the ligature finder
            // getting messed up.
            return font.findLigatureRanges(text).map(range => [range[0], range[1]]);
        }
        return getFallbackRanges(text, fallbackLigatures);
    });
}
exports.enableLigatures = enableLigatures;
function getFallbackRanges(text, fallbackLigatures) {
    const ranges = [];
    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < fallbackLigatures.length; j++) {
            if (text.startsWith(fallbackLigatures[j], i)) {
                ranges.push([i, i + fallbackLigatures[j].length]);
                i += fallbackLigatures[j].length - 1;
                break;
            }
        }
    }
    return ranges;
}
//# sourceMappingURL=index.js.map