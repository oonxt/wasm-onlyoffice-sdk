import { MockSocket } from './mock-socket';
import { User } from './types';
export declare class EditorServer {
    private converter;
    private id;
    private socket;
    private sessionId;
    private user;
    private participants;
    private syncChangesIndex;
    private loadPromise;
    private file;
    private fileType;
    private title;
    private fsMap;
    private urlsMap;
    private downloadId;
    private downloadParts;
    constructor({ x2tPath, user }?: {
        x2tPath?: string;
        user?: User;
    });
    open(file: File, { fileType, fileName }?: {
        fileType?: string;
        fileName?: string;
    }): Promise<{
        id: string;
        documentType: import('./types').DocumentType;
    }>;
    openNew(fileType?: string): {
        id: string;
        documentType: import('./types').DocumentType;
    };
    openUrl(url: string, { fileType, fileName }?: {
        fileType?: string;
        fileName?: string;
    }): Promise<{
        id: string;
        documentType: import('./types').DocumentType;
    }>;
    getDocument(): {
        fileType: string;
        key: string;
        title: string;
        url: string;
    };
    getUser(): User;
    private loadDocument;
    private addMedia;
    handleConnect({ socket }: {
        socket: MockSocket;
    }): void;
    handleDisconnect({ socket }: {
        socket: MockSocket;
    }): void;
    send(msg: any): void;
    handleMessage(msg: any, ...args: unknown[]): Promise<void>;
    handleRequest(req: Request): Promise<Response | null>;
    destroy(): void;
}
//# sourceMappingURL=editor-server.d.ts.map