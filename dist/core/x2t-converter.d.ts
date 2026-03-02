import { X2tConvertParams, X2tConvertResult } from './types';
export declare class X2tConverter {
    private worker;
    private initPromise;
    private messageId;
    private pendingMessages;
    private x2tPath;
    constructor(x2tPath?: string);
    private getNextId;
    private sendMessage;
    private handleWorkerMessage;
    private handleWorkerError;
    init(): Promise<void>;
    convert(params: X2tConvertParams): Promise<X2tConvertResult>;
    terminate(): void;
    get isInitialized(): boolean;
}
//# sourceMappingURL=x2t-converter.d.ts.map