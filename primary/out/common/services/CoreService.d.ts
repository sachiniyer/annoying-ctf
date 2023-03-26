import { ICoreService, ILogService, IOptionsService, IBufferService } from 'common/services/Services';
import { IEvent } from 'common/EventEmitter';
import { IDecPrivateModes, IModes } from 'common/Types';
import { Disposable } from 'common/Lifecycle';
export declare class CoreService extends Disposable implements ICoreService {
    private readonly _bufferService;
    private readonly _logService;
    private readonly _optionsService;
    serviceBrand: any;
    isCursorInitialized: boolean;
    isCursorHidden: boolean;
    modes: IModes;
    decPrivateModes: IDecPrivateModes;
    private readonly _onData;
    readonly onData: IEvent<string, void>;
    private readonly _onUserInput;
    readonly onUserInput: IEvent<void, void>;
    private readonly _onBinary;
    readonly onBinary: IEvent<string, void>;
    private readonly _onRequestScrollToBottom;
    readonly onRequestScrollToBottom: IEvent<void, void>;
    constructor(_bufferService: IBufferService, _logService: ILogService, _optionsService: IOptionsService);
    reset(): void;
    triggerDataEvent(data: string, wasUserInput?: boolean): void;
    triggerBinaryEvent(data: string): void;
}
//# sourceMappingURL=CoreService.d.ts.map