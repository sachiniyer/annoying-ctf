import { ITerminal } from 'browser/Types';
import { Disposable } from 'common/Lifecycle';
export declare class AccessibilityManager extends Disposable {
    private readonly _terminal;
    private _accessibilityContainer;
    private _liveRegion;
    private _liveRegionLineCount;
    private _liveRegionDebouncer;
    private _charsToConsume;
    private _charsToAnnounce;
    constructor(_terminal: ITerminal);
    private _handleTab;
    private _handleChar;
    private _clearLiveRegion;
    private _handleKey;
    private _refreshRows;
    private _announceCharacters;
}
//# sourceMappingURL=AccessibilityManager.d.ts.map