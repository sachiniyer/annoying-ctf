import { IUnicodeService } from 'common/services/Services';
import { ICharAtlasConfig, IRasterizedGlyph, ITextureAtlas } from 'browser/renderer/shared/Types';
export declare class TextureAtlas implements ITextureAtlas {
    private readonly _document;
    private readonly _config;
    private readonly _unicodeService;
    private _didWarmUp;
    private _cacheMap;
    private _cacheMapCombined;
    private _pages;
    get pages(): {
        canvas: HTMLCanvasElement;
        version: number;
    }[];
    private _activePages;
    private _tmpCanvas;
    private _tmpCtx;
    private _workBoundingBox;
    private _workAttributeData;
    private _textureSize;
    static maxAtlasPages: number | undefined;
    static maxTextureSize: number | undefined;
    private readonly _onAddTextureAtlasCanvas;
    readonly onAddTextureAtlasCanvas: import("common/EventEmitter").IEvent<HTMLCanvasElement, void>;
    private readonly _onRemoveTextureAtlasCanvas;
    readonly onRemoveTextureAtlasCanvas: import("common/EventEmitter").IEvent<HTMLCanvasElement, void>;
    constructor(_document: Document, _config: ICharAtlasConfig, _unicodeService: IUnicodeService);
    dispose(): void;
    warmUp(): void;
    private _doWarmUp;
    private _requestClearModel;
    beginFrame(): boolean;
    clearTexture(): void;
    private _createNewPage;
    private _mergePages;
    private _deletePage;
    getRasterizedGlyphCombinedChar(chars: string, bg: number, fg: number, ext: number): IRasterizedGlyph;
    getRasterizedGlyph(code: number, bg: number, fg: number, ext: number): IRasterizedGlyph;
    private _getFromCacheMap;
    private _getColorFromAnsiIndex;
    private _getBackgroundColor;
    private _getForegroundColor;
    private _resolveBackgroundRgba;
    private _resolveForegroundRgba;
    private _getMinimumContrastColor;
    private _drawToCache;
    private _findGlyphBoundingBox;
}
//# sourceMappingURL=TextureAtlas.d.ts.map