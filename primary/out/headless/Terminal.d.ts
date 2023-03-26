import { IBuffer } from 'common/buffer/Types';
import { CoreTerminal } from 'common/CoreTerminal';
import { IEvent } from 'common/EventEmitter';
import { ITerminalOptions as IInitializedTerminalOptions } from 'common/services/Services';
import { IMarker, ITerminalOptions } from 'common/Types';
export declare class Terminal extends CoreTerminal {
    get options(): Required<IInitializedTerminalOptions>;
    private readonly _onBell;
    readonly onBell: IEvent<void, void>;
    private readonly _onCursorMove;
    readonly onCursorMove: IEvent<void, void>;
    private readonly _onTitleChange;
    readonly onTitleChange: IEvent<string, void>;
    private readonly _onA11yCharEmitter;
    readonly onA11yChar: IEvent<string, void>;
    private readonly _onA11yTabEmitter;
    readonly onA11yTab: IEvent<number, void>;
    constructor(options?: ITerminalOptions);
    get buffer(): IBuffer;
    get markers(): IMarker[];
    addMarker(cursorYOffset: number): IMarker | undefined;
    bell(): void;
    resize(x: number, y: number): void;
    clear(): void;
    reset(): void;
}
//# sourceMappingURL=Terminal.d.ts.map