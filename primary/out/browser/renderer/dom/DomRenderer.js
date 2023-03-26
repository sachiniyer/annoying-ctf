"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomRenderer = void 0;
const DomRendererRowFactory_1 = require("browser/renderer/dom/DomRendererRowFactory");
const Constants_1 = require("browser/renderer/shared/Constants");
const RendererUtils_1 = require("browser/renderer/shared/RendererUtils");
const Services_1 = require("browser/services/Services");
const Color_1 = require("common/Color");
const EventEmitter_1 = require("common/EventEmitter");
const Lifecycle_1 = require("common/Lifecycle");
const Services_2 = require("common/services/Services");
const TERMINAL_CLASS_PREFIX = 'xterm-dom-renderer-owner-';
const ROW_CONTAINER_CLASS = 'xterm-rows';
const FG_CLASS_PREFIX = 'xterm-fg-';
const BG_CLASS_PREFIX = 'xterm-bg-';
const FOCUS_CLASS = 'xterm-focus';
const SELECTION_CLASS = 'xterm-selection';
let nextTerminalId = 1;
let DomRenderer = class DomRenderer extends Lifecycle_1.Disposable {
    constructor(_element, _screenElement, _viewportElement, _linkifier2, instantiationService, _charSizeService, _optionsService, _bufferService, _coreBrowserService, themeService) {
        super();
        this._element = _element;
        this._screenElement = _screenElement;
        this._viewportElement = _viewportElement;
        this._linkifier2 = _linkifier2;
        this._charSizeService = _charSizeService;
        this._optionsService = _optionsService;
        this._bufferService = _bufferService;
        this._coreBrowserService = _coreBrowserService;
        this._terminalClass = nextTerminalId++;
        this._rowElements = [];
        this._cellToRowElements = [];
        this.onRequestRedraw = this.register(new EventEmitter_1.EventEmitter()).event;
        this._rowContainer = document.createElement('div');
        this._rowContainer.classList.add(ROW_CONTAINER_CLASS);
        this._rowContainer.style.lineHeight = 'normal';
        this._rowContainer.setAttribute('aria-hidden', 'true');
        this._refreshRowElements(this._bufferService.cols, this._bufferService.rows);
        this._selectionContainer = document.createElement('div');
        this._selectionContainer.classList.add(SELECTION_CLASS);
        this._selectionContainer.setAttribute('aria-hidden', 'true');
        this.dimensions = (0, RendererUtils_1.createRenderDimensions)();
        this._updateDimensions();
        this.register(this._optionsService.onOptionChange(() => this._handleOptionsChanged()));
        this.register(themeService.onChangeColors(e => this._injectCss(e)));
        this._injectCss(themeService.colors);
        this._rowFactory = instantiationService.createInstance(DomRendererRowFactory_1.DomRendererRowFactory, document);
        this._element.classList.add(TERMINAL_CLASS_PREFIX + this._terminalClass);
        this._screenElement.appendChild(this._rowContainer);
        this._screenElement.appendChild(this._selectionContainer);
        this.register(this._linkifier2.onShowLinkUnderline(e => this._handleLinkHover(e)));
        this.register(this._linkifier2.onHideLinkUnderline(e => this._handleLinkLeave(e)));
        this.register((0, Lifecycle_1.toDisposable)(() => {
            this._element.classList.remove(TERMINAL_CLASS_PREFIX + this._terminalClass);
            this._rowContainer.remove();
            this._selectionContainer.remove();
            this._themeStyleElement.remove();
            this._dimensionsStyleElement.remove();
        }));
    }
    _updateDimensions() {
        const dpr = this._coreBrowserService.dpr;
        this.dimensions.device.char.width = this._charSizeService.width * dpr;
        this.dimensions.device.char.height = Math.ceil(this._charSizeService.height * dpr);
        this.dimensions.device.cell.width = this.dimensions.device.char.width + Math.round(this._optionsService.rawOptions.letterSpacing);
        this.dimensions.device.cell.height = Math.floor(this.dimensions.device.char.height * this._optionsService.rawOptions.lineHeight);
        this.dimensions.device.char.left = 0;
        this.dimensions.device.char.top = 0;
        this.dimensions.device.canvas.width = this.dimensions.device.cell.width * this._bufferService.cols;
        this.dimensions.device.canvas.height = this.dimensions.device.cell.height * this._bufferService.rows;
        this.dimensions.css.canvas.width = Math.round(this.dimensions.device.canvas.width / dpr);
        this.dimensions.css.canvas.height = Math.round(this.dimensions.device.canvas.height / dpr);
        this.dimensions.css.cell.width = this.dimensions.css.canvas.width / this._bufferService.cols;
        this.dimensions.css.cell.height = this.dimensions.css.canvas.height / this._bufferService.rows;
        for (const element of this._rowElements) {
            element.style.width = `${this.dimensions.css.canvas.width}px`;
            element.style.height = `${this.dimensions.css.cell.height}px`;
            element.style.lineHeight = `${this.dimensions.css.cell.height}px`;
            element.style.overflow = 'hidden';
        }
        if (!this._dimensionsStyleElement) {
            this._dimensionsStyleElement = document.createElement('style');
            this._screenElement.appendChild(this._dimensionsStyleElement);
        }
        const styles = `${this._terminalSelector} .${ROW_CONTAINER_CLASS} span {` +
            ` display: inline-block;` +
            ` height: 100%;` +
            ` vertical-align: top;` +
            ` width: ${this.dimensions.css.cell.width}px` +
            `}`;
        this._dimensionsStyleElement.textContent = styles;
        this._selectionContainer.style.height = this._viewportElement.style.height;
        this._screenElement.style.width = `${this.dimensions.css.canvas.width}px`;
        this._screenElement.style.height = `${this.dimensions.css.canvas.height}px`;
    }
    _injectCss(colors) {
        if (!this._themeStyleElement) {
            this._themeStyleElement = document.createElement('style');
            this._screenElement.appendChild(this._themeStyleElement);
        }
        let styles = `${this._terminalSelector} .${ROW_CONTAINER_CLASS} {` +
            ` color: ${colors.foreground.css};` +
            ` font-family: ${this._optionsService.rawOptions.fontFamily};` +
            ` font-size: ${this._optionsService.rawOptions.fontSize}px;` +
            `}`;
        styles +=
            `${this._terminalSelector} span:not(.${DomRendererRowFactory_1.BOLD_CLASS}) {` +
                ` font-weight: ${this._optionsService.rawOptions.fontWeight};` +
                `}` +
                `${this._terminalSelector} span.${DomRendererRowFactory_1.BOLD_CLASS} {` +
                ` font-weight: ${this._optionsService.rawOptions.fontWeightBold};` +
                `}` +
                `${this._terminalSelector} span.${DomRendererRowFactory_1.ITALIC_CLASS} {` +
                ` font-style: italic;` +
                `}`;
        styles +=
            `@keyframes blink_box_shadow` + `_` + this._terminalClass + ` {` +
                ` 50% {` +
                `  box-shadow: none;` +
                ` }` +
                `}`;
        styles +=
            `@keyframes blink_block` + `_` + this._terminalClass + ` {` +
                ` 0% {` +
                `  background-color: ${colors.cursor.css};` +
                `  color: ${colors.cursorAccent.css};` +
                ` }` +
                ` 50% {` +
                `  background-color: ${colors.cursorAccent.css};` +
                `  color: ${colors.cursor.css};` +
                ` }` +
                `}`;
        styles +=
            `${this._terminalSelector} .${ROW_CONTAINER_CLASS}:not(.${FOCUS_CLASS}) .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_STYLE_BLOCK_CLASS} ,` +
                `${this._terminalSelector} .${ROW_CONTAINER_CLASS}:not(.${FOCUS_CLASS}) .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_STYLE_BAR_CLASS} ,` +
                `${this._terminalSelector} .${ROW_CONTAINER_CLASS}:not(.${FOCUS_CLASS}) .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_STYLE_UNDERLINE_CLASS} ` +
                `{` +
                ` outline: 1px solid ${colors.cursor.css};` +
                ` outline-offset: -1px;` +
                `}` +
                `${this._terminalSelector} .${ROW_CONTAINER_CLASS}.${FOCUS_CLASS} .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_BLINK_CLASS}:not(.${DomRendererRowFactory_1.CURSOR_STYLE_BLOCK_CLASS}) {` +
                ` animation: blink_box_shadow` + `_` + this._terminalClass + ` 1s step-end infinite;` +
                `}` +
                `${this._terminalSelector} .${ROW_CONTAINER_CLASS}.${FOCUS_CLASS} .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_BLINK_CLASS}.${DomRendererRowFactory_1.CURSOR_STYLE_BLOCK_CLASS} {` +
                ` animation: blink_block` + `_` + this._terminalClass + ` 1s step-end infinite;` +
                `}` +
                `${this._terminalSelector} .${ROW_CONTAINER_CLASS}.${FOCUS_CLASS} .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_STYLE_BLOCK_CLASS} {` +
                ` background-color: ${colors.cursor.css};` +
                ` color: ${colors.cursorAccent.css};` +
                `}` +
                `${this._terminalSelector} .${ROW_CONTAINER_CLASS} .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_STYLE_BAR_CLASS} {` +
                ` box-shadow: ${this._optionsService.rawOptions.cursorWidth}px 0 0 ${colors.cursor.css} inset;` +
                `}` +
                `${this._terminalSelector} .${ROW_CONTAINER_CLASS} .${DomRendererRowFactory_1.CURSOR_CLASS}.${DomRendererRowFactory_1.CURSOR_STYLE_UNDERLINE_CLASS} {` +
                ` box-shadow: 0 -1px 0 ${colors.cursor.css} inset;` +
                `}`;
        styles +=
            `${this._terminalSelector} .${SELECTION_CLASS} {` +
                ` position: absolute;` +
                ` top: 0;` +
                ` left: 0;` +
                ` z-index: 1;` +
                ` pointer-events: none;` +
                `}` +
                `${this._terminalSelector}.focus .${SELECTION_CLASS} div {` +
                ` position: absolute;` +
                ` background-color: ${colors.selectionBackgroundOpaque.css};` +
                `}` +
                `${this._terminalSelector} .${SELECTION_CLASS} div {` +
                ` position: absolute;` +
                ` background-color: ${colors.selectionInactiveBackgroundOpaque.css};` +
                `}`;
        for (const [i, c] of colors.ansi.entries()) {
            styles +=
                `${this._terminalSelector} .${FG_CLASS_PREFIX}${i} { color: ${c.css}; }` +
                    `${this._terminalSelector} .${BG_CLASS_PREFIX}${i} { background-color: ${c.css}; }`;
        }
        styles +=
            `${this._terminalSelector} .${FG_CLASS_PREFIX}${Constants_1.INVERTED_DEFAULT_COLOR} { color: ${Color_1.color.opaque(colors.background).css}; }` +
                `${this._terminalSelector} .${BG_CLASS_PREFIX}${Constants_1.INVERTED_DEFAULT_COLOR} { background-color: ${colors.foreground.css}; }`;
        this._themeStyleElement.textContent = styles;
    }
    handleDevicePixelRatioChange() {
        this._updateDimensions();
    }
    _refreshRowElements(cols, rows) {
        for (let i = this._rowElements.length; i <= rows; i++) {
            const row = document.createElement('div');
            this._rowContainer.appendChild(row);
            this._rowElements.push(row);
        }
        while (this._rowElements.length > rows) {
            this._rowContainer.removeChild(this._rowElements.pop());
        }
    }
    handleResize(cols, rows) {
        this._refreshRowElements(cols, rows);
        this._updateDimensions();
    }
    handleCharSizeChanged() {
        this._updateDimensions();
    }
    handleBlur() {
        this._rowContainer.classList.remove(FOCUS_CLASS);
    }
    handleFocus() {
        this._rowContainer.classList.add(FOCUS_CLASS);
    }
    handleSelectionChanged(start, end, columnSelectMode) {
        while (this._selectionContainer.children.length) {
            this._selectionContainer.removeChild(this._selectionContainer.children[0]);
        }
        this._rowFactory.handleSelectionChanged(start, end, columnSelectMode);
        this.renderRows(0, this._bufferService.rows - 1);
        if (!start || !end) {
            return;
        }
        const viewportStartRow = start[1] - this._bufferService.buffer.ydisp;
        const viewportEndRow = end[1] - this._bufferService.buffer.ydisp;
        const viewportCappedStartRow = Math.max(viewportStartRow, 0);
        const viewportCappedEndRow = Math.min(viewportEndRow, this._bufferService.rows - 1);
        if (viewportCappedStartRow >= this._bufferService.rows || viewportCappedEndRow < 0) {
            return;
        }
        const documentFragment = document.createDocumentFragment();
        if (columnSelectMode) {
            const isXFlipped = start[0] > end[0];
            documentFragment.appendChild(this._createSelectionElement(viewportCappedStartRow, isXFlipped ? end[0] : start[0], isXFlipped ? start[0] : end[0], viewportCappedEndRow - viewportCappedStartRow + 1));
        }
        else {
            const startCol = viewportStartRow === viewportCappedStartRow ? start[0] : 0;
            const endCol = viewportCappedStartRow === viewportEndRow ? end[0] : this._bufferService.cols;
            documentFragment.appendChild(this._createSelectionElement(viewportCappedStartRow, startCol, endCol));
            const middleRowsCount = viewportCappedEndRow - viewportCappedStartRow - 1;
            documentFragment.appendChild(this._createSelectionElement(viewportCappedStartRow + 1, 0, this._bufferService.cols, middleRowsCount));
            if (viewportCappedStartRow !== viewportCappedEndRow) {
                const endCol = viewportEndRow === viewportCappedEndRow ? end[0] : this._bufferService.cols;
                documentFragment.appendChild(this._createSelectionElement(viewportCappedEndRow, 0, endCol));
            }
        }
        this._selectionContainer.appendChild(documentFragment);
    }
    _createSelectionElement(row, colStart, colEnd, rowCount = 1) {
        const element = document.createElement('div');
        element.style.height = `${rowCount * this.dimensions.css.cell.height}px`;
        element.style.top = `${row * this.dimensions.css.cell.height}px`;
        element.style.left = `${colStart * this.dimensions.css.cell.width}px`;
        element.style.width = `${this.dimensions.css.cell.width * (colEnd - colStart)}px`;
        return element;
    }
    handleCursorMove() {
    }
    _handleOptionsChanged() {
        this._updateDimensions();
    }
    clear() {
        for (const e of this._rowElements) {
            e.replaceChildren();
        }
    }
    renderRows(start, end) {
        const cursorAbsoluteY = this._bufferService.buffer.ybase + this._bufferService.buffer.y;
        const cursorX = Math.min(this._bufferService.buffer.x, this._bufferService.cols - 1);
        const cursorBlink = this._optionsService.rawOptions.cursorBlink;
        for (let y = start; y <= end; y++) {
            const rowElement = this._rowElements[y];
            const row = y + this._bufferService.buffer.ydisp;
            const lineData = this._bufferService.buffer.lines.get(row);
            const cursorStyle = this._optionsService.rawOptions.cursorStyle;
            if (!this._cellToRowElements[y] || this._cellToRowElements[y].length !== this._bufferService.cols) {
                this._cellToRowElements[y] = new Int16Array(this._bufferService.cols);
            }
            rowElement.replaceChildren(this._rowFactory.createRow(lineData, row, row === cursorAbsoluteY, cursorStyle, cursorX, cursorBlink, this.dimensions.css.cell.width, this._bufferService.cols, this._cellToRowElements[y]));
        }
    }
    get _terminalSelector() {
        return `.${TERMINAL_CLASS_PREFIX}${this._terminalClass}`;
    }
    _handleLinkHover(e) {
        this._setCellUnderline(e.x1, e.x2, e.y1, e.y2, e.cols, true);
    }
    _handleLinkLeave(e) {
        this._setCellUnderline(e.x1, e.x2, e.y1, e.y2, e.cols, false);
    }
    _setCellUnderline(x, x2, y, y2, cols, enabled) {
        x = this._cellToRowElements[y][x];
        x2 = this._cellToRowElements[y2][x2];
        if (x === -1 || x2 === -1) {
            return;
        }
        while (x !== x2 || y !== y2) {
            const row = this._rowElements[y];
            if (!row) {
                return;
            }
            const span = row.children[x];
            if (span) {
                span.style.textDecoration = enabled ? 'underline' : 'none';
            }
            if (++x >= cols) {
                x = 0;
                y++;
            }
        }
    }
};
DomRenderer = __decorate([
    __param(4, Services_2.IInstantiationService),
    __param(5, Services_1.ICharSizeService),
    __param(6, Services_2.IOptionsService),
    __param(7, Services_2.IBufferService),
    __param(8, Services_1.ICoreBrowserService),
    __param(9, Services_1.IThemeService)
], DomRenderer);
exports.DomRenderer = DomRenderer;
//# sourceMappingURL=DomRenderer.js.map