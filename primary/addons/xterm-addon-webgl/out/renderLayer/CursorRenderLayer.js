"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorRenderLayer = void 0;
const BaseRenderLayer_1 = require("./BaseRenderLayer");
const CellData_1 = require("common/buffer/CellData");
const Lifecycle_1 = require("common/Lifecycle");
const BLINK_INTERVAL = 600;
class CursorRenderLayer extends BaseRenderLayer_1.BaseRenderLayer {
    constructor(terminal, container, zIndex, _onRequestRefreshRowsEvent, coreBrowserService, _coreService, optionsService, themeService) {
        super(terminal, container, 'cursor', zIndex, true, coreBrowserService, optionsService, themeService);
        this._onRequestRefreshRowsEvent = _onRequestRefreshRowsEvent;
        this._coreService = _coreService;
        this._cell = new CellData_1.CellData();
        this._state = {
            x: 0,
            y: 0,
            isFocused: false,
            style: '',
            width: 0
        };
        this._cursorRenderers = {
            'bar': this._renderBarCursor.bind(this),
            'block': this._renderBlockCursor.bind(this),
            'underline': this._renderUnderlineCursor.bind(this)
        };
        this._handleOptionsChanged(terminal);
        this.register(optionsService.onOptionChange(() => this._handleOptionsChanged(terminal)));
        this.register((0, Lifecycle_1.toDisposable)(() => {
            var _a;
            (_a = this._cursorBlinkStateManager) === null || _a === void 0 ? void 0 : _a.dispose();
            this._cursorBlinkStateManager = undefined;
        }));
    }
    resize(terminal, dim) {
        super.resize(terminal, dim);
        this._state = {
            x: 0,
            y: 0,
            isFocused: false,
            style: '',
            width: 0
        };
    }
    reset(terminal) {
        var _a;
        this._clearCursor();
        (_a = this._cursorBlinkStateManager) === null || _a === void 0 ? void 0 : _a.restartBlinkAnimation(terminal);
        this._handleOptionsChanged(terminal);
    }
    handleBlur(terminal) {
        var _a;
        (_a = this._cursorBlinkStateManager) === null || _a === void 0 ? void 0 : _a.pause();
        this._onRequestRefreshRowsEvent.fire({ start: terminal.buffer.active.cursorY, end: terminal.buffer.active.cursorY });
    }
    handleFocus(terminal) {
        var _a;
        (_a = this._cursorBlinkStateManager) === null || _a === void 0 ? void 0 : _a.resume(terminal);
        this._onRequestRefreshRowsEvent.fire({ start: terminal.buffer.active.cursorY, end: terminal.buffer.active.cursorY });
    }
    _handleOptionsChanged(terminal) {
        var _a;
        if (terminal.options.cursorBlink) {
            if (!this._cursorBlinkStateManager) {
                this._cursorBlinkStateManager = new CursorBlinkStateManager(() => {
                    this._render(terminal, true);
                }, this._coreBrowserService);
            }
        }
        else {
            (_a = this._cursorBlinkStateManager) === null || _a === void 0 ? void 0 : _a.dispose();
            this._cursorBlinkStateManager = undefined;
        }
        this._onRequestRefreshRowsEvent.fire({ start: terminal.buffer.active.cursorY, end: terminal.buffer.active.cursorY });
    }
    handleCursorMove(terminal) {
        var _a;
        (_a = this._cursorBlinkStateManager) === null || _a === void 0 ? void 0 : _a.restartBlinkAnimation(terminal);
    }
    handleGridChanged(terminal, startRow, endRow) {
        if (!this._cursorBlinkStateManager || this._cursorBlinkStateManager.isPaused) {
            this._render(terminal, false);
        }
        else {
            this._cursorBlinkStateManager.restartBlinkAnimation(terminal);
        }
    }
    _render(terminal, triggeredByAnimationFrame) {
        if (!this._coreService.isCursorInitialized || this._coreService.isCursorHidden) {
            this._clearCursor();
            return;
        }
        const cursorY = terminal.buffer.active.baseY + terminal.buffer.active.cursorY;
        const viewportRelativeCursorY = cursorY - terminal.buffer.active.viewportY;
        const cursorX = Math.min(terminal.buffer.active.cursorX, terminal.cols - 1);
        if (viewportRelativeCursorY < 0 || viewportRelativeCursorY >= terminal.rows) {
            this._clearCursor();
            return;
        }
        terminal._core.buffer.lines.get(cursorY).loadCell(cursorX, this._cell);
        if (this._cell.content === undefined) {
            return;
        }
        if (!this._coreBrowserService.isFocused) {
            this._clearCursor();
            this._ctx.save();
            this._ctx.fillStyle = this._themeService.colors.cursor.css;
            const cursorStyle = terminal.options.cursorStyle;
            this._renderBlurCursor(terminal, cursorX, viewportRelativeCursorY, this._cell);
            this._ctx.restore();
            this._state.x = cursorX;
            this._state.y = viewportRelativeCursorY;
            this._state.isFocused = false;
            this._state.style = cursorStyle;
            this._state.width = this._cell.getWidth();
            return;
        }
        if (this._cursorBlinkStateManager && !this._cursorBlinkStateManager.isCursorVisible) {
            this._clearCursor();
            return;
        }
        if (this._state) {
            if (this._state.x === cursorX &&
                this._state.y === viewportRelativeCursorY &&
                this._state.isFocused === this._coreBrowserService.isFocused &&
                this._state.style === terminal.options.cursorStyle &&
                this._state.width === this._cell.getWidth()) {
                return;
            }
            this._clearCursor();
        }
        this._ctx.save();
        this._cursorRenderers[terminal.options.cursorStyle || 'block'](terminal, cursorX, viewportRelativeCursorY, this._cell);
        this._ctx.restore();
        this._state.x = cursorX;
        this._state.y = viewportRelativeCursorY;
        this._state.isFocused = false;
        this._state.style = terminal.options.cursorStyle;
        this._state.width = this._cell.getWidth();
    }
    _clearCursor() {
        if (this._state) {
            if (this._coreBrowserService.dpr < 1) {
                this._clearAll();
            }
            else {
                this._clearCells(this._state.x, this._state.y, this._state.width, 1);
            }
            this._state = {
                x: 0,
                y: 0,
                isFocused: false,
                style: '',
                width: 0
            };
        }
    }
    _renderBarCursor(terminal, x, y, cell) {
        this._ctx.save();
        this._ctx.fillStyle = this._themeService.colors.cursor.css;
        this._fillLeftLineAtCell(x, y, this._optionsService.rawOptions.cursorWidth);
        this._ctx.restore();
    }
    _renderBlockCursor(terminal, x, y, cell) {
        this._ctx.save();
        this._ctx.fillStyle = this._themeService.colors.cursor.css;
        this._fillCells(x, y, cell.getWidth(), 1);
        this._ctx.fillStyle = this._themeService.colors.cursorAccent.css;
        this._fillCharTrueColor(terminal, cell, x, y);
        this._ctx.restore();
    }
    _renderUnderlineCursor(terminal, x, y, cell) {
        this._ctx.save();
        this._ctx.fillStyle = this._themeService.colors.cursor.css;
        this._fillBottomLineAtCells(x, y);
        this._ctx.restore();
    }
    _renderBlurCursor(terminal, x, y, cell) {
        this._ctx.save();
        this._ctx.strokeStyle = this._themeService.colors.cursor.css;
        this._strokeRectAtCell(x, y, cell.getWidth(), 1);
        this._ctx.restore();
    }
}
exports.CursorRenderLayer = CursorRenderLayer;
class CursorBlinkStateManager {
    constructor(_renderCallback, _coreBrowserService) {
        this._renderCallback = _renderCallback;
        this._coreBrowserService = _coreBrowserService;
        this.isCursorVisible = true;
        if (this._coreBrowserService.isFocused) {
            this._restartInterval();
        }
    }
    get isPaused() { return !(this._blinkStartTimeout || this._blinkInterval); }
    dispose() {
        if (this._blinkInterval) {
            this._coreBrowserService.window.clearInterval(this._blinkInterval);
            this._blinkInterval = undefined;
        }
        if (this._blinkStartTimeout) {
            this._coreBrowserService.window.clearTimeout(this._blinkStartTimeout);
            this._blinkStartTimeout = undefined;
        }
        if (this._animationFrame) {
            this._coreBrowserService.window.cancelAnimationFrame(this._animationFrame);
            this._animationFrame = undefined;
        }
    }
    restartBlinkAnimation(terminal) {
        if (this.isPaused) {
            return;
        }
        this._animationTimeRestarted = Date.now();
        this.isCursorVisible = true;
        if (!this._animationFrame) {
            this._animationFrame = this._coreBrowserService.window.requestAnimationFrame(() => {
                this._renderCallback();
                this._animationFrame = undefined;
            });
        }
    }
    _restartInterval(timeToStart = BLINK_INTERVAL) {
        if (this._blinkInterval) {
            this._coreBrowserService.window.clearInterval(this._blinkInterval);
            this._blinkInterval = undefined;
        }
        this._blinkStartTimeout = this._coreBrowserService.window.setTimeout(() => {
            if (this._animationTimeRestarted) {
                const time = BLINK_INTERVAL - (Date.now() - this._animationTimeRestarted);
                this._animationTimeRestarted = undefined;
                if (time > 0) {
                    this._restartInterval(time);
                    return;
                }
            }
            this.isCursorVisible = false;
            this._animationFrame = this._coreBrowserService.window.requestAnimationFrame(() => {
                this._renderCallback();
                this._animationFrame = undefined;
            });
            this._blinkInterval = this._coreBrowserService.window.setInterval(() => {
                if (this._animationTimeRestarted) {
                    const time = BLINK_INTERVAL - (Date.now() - this._animationTimeRestarted);
                    this._animationTimeRestarted = undefined;
                    this._restartInterval(time);
                    return;
                }
                this.isCursorVisible = !this.isCursorVisible;
                this._animationFrame = this._coreBrowserService.window.requestAnimationFrame(() => {
                    this._renderCallback();
                    this._animationFrame = undefined;
                });
            }, BLINK_INTERVAL);
        }, timeToStart);
    }
    pause() {
        this.isCursorVisible = true;
        if (this._blinkInterval) {
            this._coreBrowserService.window.clearInterval(this._blinkInterval);
            this._blinkInterval = undefined;
        }
        if (this._blinkStartTimeout) {
            this._coreBrowserService.window.clearTimeout(this._blinkStartTimeout);
            this._blinkStartTimeout = undefined;
        }
        if (this._animationFrame) {
            this._coreBrowserService.window.cancelAnimationFrame(this._animationFrame);
            this._animationFrame = undefined;
        }
    }
    resume(terminal) {
        this.pause();
        this._animationTimeRestarted = undefined;
        this._restartInterval();
        this.restartBlinkAnimation(terminal);
    }
}
//# sourceMappingURL=CursorRenderLayer.js.map