"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinedCellData = exports.WebglRenderer = void 0;
const Lifecycle_1 = require("browser/Lifecycle");
const CellColorResolver_1 = require("browser/renderer/shared/CellColorResolver");
const CharAtlasCache_1 = require("browser/renderer/shared/CharAtlasCache");
const DevicePixelObserver_1 = require("browser/renderer/shared/DevicePixelObserver");
const RendererUtils_1 = require("browser/renderer/shared/RendererUtils");
const AttributeData_1 = require("common/buffer/AttributeData");
const CellData_1 = require("common/buffer/CellData");
const Constants_1 = require("common/buffer/Constants");
const EventEmitter_1 = require("common/EventEmitter");
const Lifecycle_2 = require("common/Lifecycle");
const GlyphRenderer_1 = require("./GlyphRenderer");
const RectangleRenderer_1 = require("./RectangleRenderer");
const CursorRenderLayer_1 = require("./renderLayer/CursorRenderLayer");
const LinkRenderLayer_1 = require("./renderLayer/LinkRenderLayer");
const RenderModel_1 = require("./RenderModel");
class WebglRenderer extends Lifecycle_2.Disposable {
    constructor(_terminal, _characterJoinerService, _charSizeService, _coreBrowserService, coreService, _decorationService, _optionsService, _themeService, preserveDrawingBuffer) {
        super();
        this._terminal = _terminal;
        this._characterJoinerService = _characterJoinerService;
        this._charSizeService = _charSizeService;
        this._coreBrowserService = _coreBrowserService;
        this._decorationService = _decorationService;
        this._optionsService = _optionsService;
        this._themeService = _themeService;
        this._model = new RenderModel_1.RenderModel();
        this._workCell = new CellData_1.CellData();
        this._onChangeTextureAtlas = this.register(new EventEmitter_1.EventEmitter());
        this.onChangeTextureAtlas = this._onChangeTextureAtlas.event;
        this._onAddTextureAtlasCanvas = this.register(new EventEmitter_1.EventEmitter());
        this.onAddTextureAtlasCanvas = this._onAddTextureAtlasCanvas.event;
        this._onRemoveTextureAtlasCanvas = this.register(new EventEmitter_1.EventEmitter());
        this.onRemoveTextureAtlasCanvas = this._onRemoveTextureAtlasCanvas.event;
        this._onRequestRedraw = this.register(new EventEmitter_1.EventEmitter());
        this.onRequestRedraw = this._onRequestRedraw.event;
        this._onContextLoss = this.register(new EventEmitter_1.EventEmitter());
        this.onContextLoss = this._onContextLoss.event;
        this.register(this._themeService.onChangeColors(() => this._handleColorChange()));
        this._cellColorResolver = new CellColorResolver_1.CellColorResolver(this._terminal, this._model.selection, this._decorationService, this._coreBrowserService, this._themeService);
        this._core = this._terminal._core;
        this._renderLayers = [
            new LinkRenderLayer_1.LinkRenderLayer(this._core.screenElement, 2, this._terminal, this._core.linkifier2, this._coreBrowserService, _optionsService, this._themeService),
            new CursorRenderLayer_1.CursorRenderLayer(_terminal, this._core.screenElement, 3, this._onRequestRedraw, this._coreBrowserService, coreService, _optionsService, this._themeService)
        ];
        this.dimensions = (0, RendererUtils_1.createRenderDimensions)();
        this._devicePixelRatio = this._coreBrowserService.dpr;
        this._updateDimensions();
        this.register(_optionsService.onOptionChange(() => this._handleOptionsChanged()));
        this._canvas = document.createElement('canvas');
        const contextAttributes = {
            antialias: false,
            depth: false,
            preserveDrawingBuffer
        };
        this._gl = this._canvas.getContext('webgl2', contextAttributes);
        if (!this._gl) {
            throw new Error('WebGL2 not supported ' + this._gl);
        }
        this.register((0, Lifecycle_1.addDisposableDomListener)(this._canvas, 'webglcontextlost', (e) => {
            console.log('webglcontextlost event received');
            e.preventDefault();
            this._contextRestorationTimeout = setTimeout(() => {
                this._contextRestorationTimeout = undefined;
                console.warn('webgl context not restored; firing onContextLoss');
                this._onContextLoss.fire(e);
            }, 3000);
        }));
        this.register((0, Lifecycle_1.addDisposableDomListener)(this._canvas, 'webglcontextrestored', (e) => {
            console.warn('webglcontextrestored event received');
            clearTimeout(this._contextRestorationTimeout);
            this._contextRestorationTimeout = undefined;
            (0, CharAtlasCache_1.removeTerminalFromCache)(this._terminal);
            this._initializeWebGLState();
            this._requestRedrawViewport();
        }));
        this.register((0, DevicePixelObserver_1.observeDevicePixelDimensions)(this._canvas, this._coreBrowserService.window, (w, h) => this._setCanvasDevicePixelDimensions(w, h)));
        this._core.screenElement.appendChild(this._canvas);
        [this._rectangleRenderer, this._glyphRenderer] = this._initializeWebGLState();
        this._isAttached = this._coreBrowserService.window.document.body.contains(this._core.screenElement);
        this.register((0, Lifecycle_2.toDisposable)(() => {
            var _a;
            for (const l of this._renderLayers) {
                l.dispose();
            }
            (_a = this._canvas.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(this._canvas);
            (0, CharAtlasCache_1.removeTerminalFromCache)(this._terminal);
        }));
    }
    get textureAtlas() {
        var _a;
        return (_a = this._charAtlas) === null || _a === void 0 ? void 0 : _a.pages[0].canvas;
    }
    _handleColorChange() {
        this._refreshCharAtlas();
        this._clearModel(true);
    }
    handleDevicePixelRatioChange() {
        if (this._devicePixelRatio !== this._coreBrowserService.dpr) {
            this._devicePixelRatio = this._coreBrowserService.dpr;
            this.handleResize(this._terminal.cols, this._terminal.rows);
        }
    }
    handleResize(cols, rows) {
        var _a, _b, _c, _d;
        this._updateDimensions();
        this._model.resize(this._terminal.cols, this._terminal.rows);
        for (const l of this._renderLayers) {
            l.resize(this._terminal, this.dimensions);
        }
        this._canvas.width = this.dimensions.device.canvas.width;
        this._canvas.height = this.dimensions.device.canvas.height;
        this._canvas.style.width = `${this.dimensions.css.canvas.width}px`;
        this._canvas.style.height = `${this.dimensions.css.canvas.height}px`;
        this._core.screenElement.style.width = `${this.dimensions.css.canvas.width}px`;
        this._core.screenElement.style.height = `${this.dimensions.css.canvas.height}px`;
        (_a = this._rectangleRenderer) === null || _a === void 0 ? void 0 : _a.setDimensions(this.dimensions);
        (_b = this._rectangleRenderer) === null || _b === void 0 ? void 0 : _b.handleResize();
        (_c = this._glyphRenderer) === null || _c === void 0 ? void 0 : _c.setDimensions(this.dimensions);
        (_d = this._glyphRenderer) === null || _d === void 0 ? void 0 : _d.handleResize();
        this._refreshCharAtlas();
        this._clearModel(false);
    }
    handleCharSizeChanged() {
        this.handleResize(this._terminal.cols, this._terminal.rows);
    }
    handleBlur() {
        for (const l of this._renderLayers) {
            l.handleBlur(this._terminal);
        }
        this._requestRedrawViewport();
    }
    handleFocus() {
        for (const l of this._renderLayers) {
            l.handleFocus(this._terminal);
        }
        this._requestRedrawViewport();
    }
    handleSelectionChanged(start, end, columnSelectMode) {
        for (const l of this._renderLayers) {
            l.handleSelectionChanged(this._terminal, start, end, columnSelectMode);
        }
        this._model.selection.update(this._terminal, start, end, columnSelectMode);
        this._requestRedrawViewport();
    }
    handleCursorMove() {
        for (const l of this._renderLayers) {
            l.handleCursorMove(this._terminal);
        }
    }
    _handleOptionsChanged() {
        this._updateDimensions();
        this._refreshCharAtlas();
    }
    _initializeWebGLState() {
        var _a, _b;
        (_a = this._rectangleRenderer) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this._glyphRenderer) === null || _b === void 0 ? void 0 : _b.dispose();
        this._rectangleRenderer = this.register(new RectangleRenderer_1.RectangleRenderer(this._terminal, this._gl, this.dimensions, this._themeService));
        this._glyphRenderer = this.register(new GlyphRenderer_1.GlyphRenderer(this._terminal, this._gl, this.dimensions));
        this.handleCharSizeChanged();
        return [this._rectangleRenderer, this._glyphRenderer];
    }
    _refreshCharAtlas() {
        var _a, _b;
        if (this.dimensions.device.char.width <= 0 && this.dimensions.device.char.height <= 0) {
            this._isAttached = false;
            return;
        }
        const atlas = (0, CharAtlasCache_1.acquireTextureAtlas)(this._terminal, this._optionsService.rawOptions, this._themeService.colors, this.dimensions.device.cell.width, this.dimensions.device.cell.height, this.dimensions.device.char.width, this.dimensions.device.char.height, this._coreBrowserService.dpr);
        if (this._charAtlas !== atlas) {
            (_a = this._charAtlasDisposable) === null || _a === void 0 ? void 0 : _a.dispose();
            this._onChangeTextureAtlas.fire(atlas.pages[0].canvas);
            this._charAtlasDisposable = (0, Lifecycle_2.getDisposeArrayDisposable)([
                (0, EventEmitter_1.forwardEvent)(atlas.onAddTextureAtlasCanvas, this._onAddTextureAtlasCanvas),
                (0, EventEmitter_1.forwardEvent)(atlas.onRemoveTextureAtlasCanvas, this._onRemoveTextureAtlasCanvas)
            ]);
        }
        this._charAtlas = atlas;
        this._charAtlas.warmUp();
        (_b = this._glyphRenderer) === null || _b === void 0 ? void 0 : _b.setAtlas(this._charAtlas);
    }
    _clearModel(clearGlyphRenderer) {
        var _a;
        this._model.clear();
        if (clearGlyphRenderer) {
            (_a = this._glyphRenderer) === null || _a === void 0 ? void 0 : _a.clear();
        }
    }
    clearTextureAtlas() {
        var _a;
        (_a = this._charAtlas) === null || _a === void 0 ? void 0 : _a.clearTexture();
        this._clearModel(true);
        this._requestRedrawViewport();
    }
    clear() {
        this._clearModel(true);
        for (const l of this._renderLayers) {
            l.reset(this._terminal);
        }
    }
    registerCharacterJoiner(handler) {
        return -1;
    }
    deregisterCharacterJoiner(joinerId) {
        return false;
    }
    renderRows(start, end) {
        var _a, _b;
        if (!this._isAttached) {
            if (this._coreBrowserService.window.document.body.contains(this._core.screenElement) && this._charSizeService.width && this._charSizeService.height) {
                this._updateDimensions();
                this._refreshCharAtlas();
                this._isAttached = true;
            }
            else {
                return;
            }
        }
        for (const l of this._renderLayers) {
            l.handleGridChanged(this._terminal, start, end);
        }
        if (!this._glyphRenderer || !this._rectangleRenderer) {
            return;
        }
        if (this._glyphRenderer.beginFrame()) {
            this._clearModel(true);
        }
        this._updateModel(start, end);
        (_a = this._rectangleRenderer) === null || _a === void 0 ? void 0 : _a.render();
        (_b = this._glyphRenderer) === null || _b === void 0 ? void 0 : _b.render(this._model);
    }
    _updateModel(start, end) {
        const terminal = this._core;
        let cell = this._workCell;
        let lastBg;
        let y;
        let row;
        let line;
        let joinedRanges;
        let isJoined;
        let lastCharX;
        let range;
        let chars;
        let code;
        let i;
        let x;
        let j;
        start = clamp(start, terminal.rows - 1, 0);
        end = clamp(end, terminal.rows - 1, 0);
        for (y = start; y <= end; y++) {
            row = y + terminal.buffer.ydisp;
            line = terminal.buffer.lines.get(row);
            this._model.lineLengths[y] = 0;
            joinedRanges = this._characterJoinerService.getJoinedCharacters(row);
            for (x = 0; x < terminal.cols; x++) {
                lastBg = this._cellColorResolver.result.bg;
                line.loadCell(x, cell);
                if (x === 0) {
                    lastBg = this._cellColorResolver.result.bg;
                }
                isJoined = false;
                lastCharX = x;
                if (joinedRanges.length > 0 && x === joinedRanges[0][0]) {
                    isJoined = true;
                    range = joinedRanges.shift();
                    cell = new JoinedCellData(cell, line.translateToString(true, range[0], range[1]), range[1] - range[0]);
                    lastCharX = range[1] - 1;
                }
                chars = cell.getChars();
                code = cell.getCode();
                i = ((y * terminal.cols) + x) * RenderModel_1.RENDER_MODEL_INDICIES_PER_CELL;
                this._cellColorResolver.resolve(cell, x, row);
                if (code !== Constants_1.NULL_CELL_CODE) {
                    this._model.lineLengths[y] = x + 1;
                }
                if (this._model.cells[i] === code &&
                    this._model.cells[i + RenderModel_1.RENDER_MODEL_BG_OFFSET] === this._cellColorResolver.result.bg &&
                    this._model.cells[i + RenderModel_1.RENDER_MODEL_FG_OFFSET] === this._cellColorResolver.result.fg &&
                    this._model.cells[i + RenderModel_1.RENDER_MODEL_EXT_OFFSET] === this._cellColorResolver.result.ext) {
                    continue;
                }
                if (chars.length > 1) {
                    code |= RenderModel_1.COMBINED_CHAR_BIT_MASK;
                }
                this._model.cells[i] = code;
                this._model.cells[i + RenderModel_1.RENDER_MODEL_BG_OFFSET] = this._cellColorResolver.result.bg;
                this._model.cells[i + RenderModel_1.RENDER_MODEL_FG_OFFSET] = this._cellColorResolver.result.fg;
                this._model.cells[i + RenderModel_1.RENDER_MODEL_EXT_OFFSET] = this._cellColorResolver.result.ext;
                this._glyphRenderer.updateCell(x, y, code, this._cellColorResolver.result.bg, this._cellColorResolver.result.fg, this._cellColorResolver.result.ext, chars, lastBg);
                if (isJoined) {
                    cell = this._workCell;
                    for (x++; x < lastCharX; x++) {
                        j = ((y * terminal.cols) + x) * RenderModel_1.RENDER_MODEL_INDICIES_PER_CELL;
                        this._glyphRenderer.updateCell(x, y, Constants_1.NULL_CELL_CODE, 0, 0, 0, Constants_1.NULL_CELL_CHAR, 0);
                        this._model.cells[j] = Constants_1.NULL_CELL_CODE;
                        this._model.cells[j + RenderModel_1.RENDER_MODEL_BG_OFFSET] = this._cellColorResolver.result.bg;
                        this._model.cells[j + RenderModel_1.RENDER_MODEL_FG_OFFSET] = this._cellColorResolver.result.fg;
                        this._model.cells[j + RenderModel_1.RENDER_MODEL_EXT_OFFSET] = this._cellColorResolver.result.ext;
                    }
                }
            }
        }
        this._rectangleRenderer.updateBackgrounds(this._model);
    }
    _updateDimensions() {
        if (!this._charSizeService.width || !this._charSizeService.height) {
            return;
        }
        this.dimensions.device.char.width = Math.floor(this._charSizeService.width * this._devicePixelRatio);
        this.dimensions.device.char.height = Math.ceil(this._charSizeService.height * this._devicePixelRatio);
        this.dimensions.device.cell.height = Math.floor(this.dimensions.device.char.height * this._optionsService.rawOptions.lineHeight);
        this.dimensions.device.char.top = this._optionsService.rawOptions.lineHeight === 1 ? 0 : Math.round((this.dimensions.device.cell.height - this.dimensions.device.char.height) / 2);
        this.dimensions.device.cell.width = this.dimensions.device.char.width + Math.round(this._optionsService.rawOptions.letterSpacing);
        this.dimensions.device.char.left = Math.floor(this._optionsService.rawOptions.letterSpacing / 2);
        this.dimensions.device.canvas.height = this._terminal.rows * this.dimensions.device.cell.height;
        this.dimensions.device.canvas.width = this._terminal.cols * this.dimensions.device.cell.width;
        this.dimensions.css.canvas.height = Math.round(this.dimensions.device.canvas.height / this._devicePixelRatio);
        this.dimensions.css.canvas.width = Math.round(this.dimensions.device.canvas.width / this._devicePixelRatio);
        this.dimensions.css.cell.height = this.dimensions.device.cell.height / this._devicePixelRatio;
        this.dimensions.css.cell.width = this.dimensions.device.cell.width / this._devicePixelRatio;
    }
    _setCanvasDevicePixelDimensions(width, height) {
        if (this._canvas.width === width && this._canvas.height === height) {
            return;
        }
        this._canvas.width = width;
        this._canvas.height = height;
        this._requestRedrawViewport();
    }
    _requestRedrawViewport() {
        this._onRequestRedraw.fire({ start: 0, end: this._terminal.rows - 1 });
    }
}
exports.WebglRenderer = WebglRenderer;
class JoinedCellData extends AttributeData_1.AttributeData {
    constructor(firstCell, chars, width) {
        super();
        this.content = 0;
        this.combinedData = '';
        this.fg = firstCell.fg;
        this.bg = firstCell.bg;
        this.combinedData = chars;
        this._width = width;
    }
    isCombined() {
        return 2097152;
    }
    getWidth() {
        return this._width;
    }
    getChars() {
        return this.combinedData;
    }
    getCode() {
        return 0x1FFFFF;
    }
    setFromCharData(value) {
        throw new Error('not implemented');
    }
    getAsCharData() {
        return [this.fg, this.getChars(), this.getWidth(), this.getCode()];
    }
}
exports.JoinedCellData = JoinedCellData;
function clamp(value, max, min = 0) {
    return Math.max(Math.min(value, max), min);
}
//# sourceMappingURL=WebglRenderer.js.map