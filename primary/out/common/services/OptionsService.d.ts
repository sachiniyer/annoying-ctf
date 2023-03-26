import { IOptionsService, ITerminalOptions } from 'common/services/Services';
import { IEvent } from 'common/EventEmitter';
import { IDisposable } from 'common/Types';
import { Disposable } from 'common/Lifecycle';
export declare const DEFAULT_OPTIONS: Readonly<Required<ITerminalOptions>>;
export declare class OptionsService extends Disposable implements IOptionsService {
    serviceBrand: any;
    readonly rawOptions: Required<ITerminalOptions>;
    options: Required<ITerminalOptions>;
    private readonly _onOptionChange;
    readonly onOptionChange: IEvent<keyof ITerminalOptions, void>;
    constructor(options: Partial<ITerminalOptions>);
    onSpecificOptionChange<T extends keyof ITerminalOptions>(key: T, listener: (value: ITerminalOptions[T]) => any): IDisposable;
    onMultipleOptionChange(keys: (keyof ITerminalOptions)[], listener: () => any): IDisposable;
    private _setupOptions;
    private _sanitizeAndValidateOption;
}
//# sourceMappingURL=OptionsService.d.ts.map