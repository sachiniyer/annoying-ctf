import { IRenderer, IRenderDimensions } from 'browser/renderer/shared/Types';
import { IEvent } from 'common/EventEmitter';
import { Disposable } from 'common/Lifecycle';
import { IOptionsService, IBufferService, IDecorationService } from 'common/services/Services';
import { ICharSizeService, ICoreBrowserService, IRenderService, IThemeService } from 'browser/services/Services';
export declare class RenderService extends Disposable implements IRenderService {
    private _rowCount;
    private readonly _charSizeService;
    serviceBrand: undefined;
    private _renderer;
    private _renderDebouncer;
    private _screenDprMonitor;
    private _pausedResizeTask;
    private _isPaused;
    private _needsFullRefresh;
    private _isNextRenderRedrawOnly;
    private _needsSelectionRefresh;
    private _canvasWidth;
    private _canvasHeight;
    private _selectionState;
    private readonly _onDimensionsChange;
    readonly onDimensionsChange: IEvent<IRenderDimensions, void>;
    private readonly _onRenderedViewportChange;
    readonly onRenderedViewportChange: IEvent<{
        start: number;
        end: number;
    }, void>;
    private readonly _onRender;
    readonly onRender: IEvent<{
        start: number;
        end: number;
    }, void>;
    private readonly _onRefreshRequest;
    readonly onRefreshRequest: IEvent<{
        start: number;
        end: number;
    }, void>;
    get dimensions(): IRenderDimensions;
    constructor(_rowCount: number, screenElement: HTMLElement, optionsService: IOptionsService, _charSizeService: ICharSizeService, decorationService: IDecorationService, bufferService: IBufferService, coreBrowserService: ICoreBrowserService, themeService: IThemeService);
    private _handleIntersectionChange;
    refreshRows(start: number, end: number, isRedrawOnly?: boolean): void;
    private _renderRows;
    resize(cols: number, rows: number): void;
    private _handleOptionsChanged;
    private _fireOnCanvasResize;
    hasRenderer(): boolean;
    setRenderer(renderer: IRenderer): void;
    addRefreshCallback(callback: FrameRequestCallback): number;
    private _fullRefresh;
    clearTextureAtlas(): void;
    handleDevicePixelRatioChange(): void;
    handleResize(cols: number, rows: number): void;
    handleCharSizeChanged(): void;
    handleBlur(): void;
    handleFocus(): void;
    handleSelectionChanged(start: [number, number] | undefined, end: [number, number] | undefined, columnSelectMode: boolean): void;
    handleCursorMove(): void;
    clear(): void;
}
//# sourceMappingURL=RenderService.d.ts.map