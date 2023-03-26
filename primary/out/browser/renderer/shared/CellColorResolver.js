"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellColorResolver = void 0;
let $fg = 0;
let $bg = 0;
let $hasFg = false;
let $hasBg = false;
let $isSelected = false;
let $colors;
class CellColorResolver {
    constructor(_terminal, _selectionRenderModel, _decorationService, _coreBrowserService, _themeService) {
        this._terminal = _terminal;
        this._selectionRenderModel = _selectionRenderModel;
        this._decorationService = _decorationService;
        this._coreBrowserService = _coreBrowserService;
        this._themeService = _themeService;
        this.result = {
            fg: 0,
            bg: 0,
            ext: 0
        };
    }
    resolve(cell, x, y) {
        this.result.bg = cell.bg;
        this.result.fg = cell.fg;
        this.result.ext = cell.bg & 268435456 ? cell.extended.ext : 0;
        $bg = 0;
        $fg = 0;
        $hasBg = false;
        $hasFg = false;
        $isSelected = false;
        $colors = this._themeService.colors;
        this._decorationService.forEachDecorationAtCell(x, y, 'bottom', d => {
            if (d.backgroundColorRGB) {
                $bg = d.backgroundColorRGB.rgba >> 8 & 0xFFFFFF;
                $hasBg = true;
            }
            if (d.foregroundColorRGB) {
                $fg = d.foregroundColorRGB.rgba >> 8 & 0xFFFFFF;
                $hasFg = true;
            }
        });
        $isSelected = this._selectionRenderModel.isCellSelected(this._terminal, x, y);
        if ($isSelected) {
            $bg = (this._coreBrowserService.isFocused ? $colors.selectionBackgroundOpaque : $colors.selectionInactiveBackgroundOpaque).rgba >> 8 & 0xFFFFFF;
            $hasBg = true;
            if ($colors.selectionForeground) {
                $fg = $colors.selectionForeground.rgba >> 8 & 0xFFFFFF;
                $hasFg = true;
            }
        }
        this._decorationService.forEachDecorationAtCell(x, y, 'top', d => {
            if (d.backgroundColorRGB) {
                $bg = d.backgroundColorRGB.rgba >> 8 & 0xFFFFFF;
                $hasBg = true;
            }
            if (d.foregroundColorRGB) {
                $fg = d.foregroundColorRGB.rgba >> 8 & 0xFFFFFF;
                $hasFg = true;
            }
        });
        if ($hasBg) {
            if ($isSelected) {
                $bg = (cell.bg & ~16777215 & ~134217728) | $bg | 50331648;
            }
            else {
                $bg = (cell.bg & ~16777215) | $bg | 50331648;
            }
        }
        if ($hasFg) {
            $fg = (cell.fg & ~16777215 & ~67108864) | $fg | 50331648;
        }
        if (this.result.fg & 67108864) {
            if ($hasBg && !$hasFg) {
                if ((this.result.bg & 50331648) === 0) {
                    $fg = (this.result.fg & ~(16777215 | 67108864 | 50331648)) | (($colors.background.rgba >> 8 & 0xFFFFFF) & 16777215) | 50331648;
                }
                else {
                    $fg = (this.result.fg & ~(16777215 | 67108864 | 50331648)) | this.result.bg & (16777215 | 50331648);
                }
                $hasFg = true;
            }
            if (!$hasBg && $hasFg) {
                if ((this.result.fg & 50331648) === 0) {
                    $bg = (this.result.bg & ~(16777215 | 50331648)) | (($colors.foreground.rgba >> 8 & 0xFFFFFF) & 16777215) | 50331648;
                }
                else {
                    $bg = (this.result.bg & ~(16777215 | 50331648)) | this.result.fg & (16777215 | 50331648);
                }
                $hasBg = true;
            }
        }
        $colors = undefined;
        this.result.bg = $hasBg ? $bg : this.result.bg;
        this.result.fg = $hasFg ? $fg : this.result.fg;
    }
}
exports.CellColorResolver = CellColorResolver;
//# sourceMappingURL=CellColorResolver.js.map