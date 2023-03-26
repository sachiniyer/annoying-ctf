import { IBuffer as IBufferApi, IBufferNamespace as IBufferNamespaceApi } from 'xterm';
import { ICoreTerminal } from 'common/Types';
export declare class BufferNamespaceApi implements IBufferNamespaceApi {
    private _core;
    private _normal;
    private _alternate;
    private readonly _onBufferChange;
    readonly onBufferChange: import("common/EventEmitter").IEvent<IBufferApi, void>;
    constructor(_core: ICoreTerminal);
    get active(): IBufferApi;
    get normal(): IBufferApi;
    get alternate(): IBufferApi;
}
//# sourceMappingURL=BufferNamespaceApi.d.ts.map