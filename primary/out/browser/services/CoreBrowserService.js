"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreBrowserService = void 0;
class CoreBrowserService {
    constructor(_textarea, window) {
        this._textarea = _textarea;
        this.window = window;
        this._isFocused = false;
        this._cachedIsFocused = undefined;
        this._textarea.addEventListener('focus', () => this._isFocused = true);
        this._textarea.addEventListener('blur', () => this._isFocused = false);
    }
    get dpr() {
        return this.window.devicePixelRatio;
    }
    get isFocused() {
        if (this._cachedIsFocused === undefined) {
            this._cachedIsFocused = this._isFocused && this._textarea.ownerDocument.hasFocus();
            queueMicrotask(() => this._cachedIsFocused = undefined);
        }
        return this._cachedIsFocused;
    }
}
exports.CoreBrowserService = CoreBrowserService;
//# sourceMappingURL=CoreBrowserService.js.map