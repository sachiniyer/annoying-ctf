import { IRenderDimensions } from 'browser/renderer/shared/Types';
export declare function throwIfFalsy<T>(value: T | undefined | null): T;
export declare function isPowerlineGlyph(codepoint: number): boolean;
export declare function isRestrictedPowerlineGlyph(codepoint: number): boolean;
export declare function excludeFromContrastRatioDemands(codepoint: number): boolean;
export declare function createRenderDimensions(): IRenderDimensions;
//# sourceMappingURL=RendererUtils.d.ts.map