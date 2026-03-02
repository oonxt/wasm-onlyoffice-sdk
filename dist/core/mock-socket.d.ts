type Callback = (...args: any[]) => void;
export interface MockSocketOptions {
    /** Enable debug logging. Defaults to true in development mode. */
    debug?: boolean;
}
/**
 * Mock implementation of socket.io-client using mitt for event handling.
 *
 * @template ListenEvents - Events Server -> Client
 * @template EmitEvents - Events Client -> Server
 */
export declare class MockSocket<ListenEvents extends Record<string, Callback> = any, EmitEvents extends Record<string, Callback> = any> {
    private static _staticEmitter;
    static on<E extends string>(event: E, listener: Callback): void;
    static off<E extends string>(event: E, listener?: Callback): void;
    active: boolean;
    connected: boolean;
    disconnected: boolean;
    recovered: boolean;
    id: string;
    io: {
        setOpenToken: () => void;
        setSessionToken: () => void;
        on: () => void;
        reconnectionAttempts: () => void;
        reconnectionDelay: () => void;
        reconnectionDelayMax: () => void;
        timeout: () => void;
        transports: () => void;
        upgrade: () => void;
        upgradeTransport: () => void;
        upgradeTimeout: () => void;
    };
    private _clientEmitter;
    private _serverEmitter;
    private _debug;
    constructor(options?: MockSocketOptions);
    private _log;
    open(): this;
    compress(): void;
    /**
     * Simulates connection establishment and generates a new Session ID.
     */
    connect(): this;
    disconnect(): this;
    close(): this;
    /**
     * Triggers local listeners (internal helper).
     * Used to simulate incoming server events.
     */
    private _trigger;
    /**
     * Registers a listener for an event from the server.
     */
    on<E extends keyof ListenEvents & string>(event: E, listener: ListenEvents[E]): this;
    /**
     * Registers a one-time listener for an event from the server.
     */
    once<E extends keyof ListenEvents & string>(event: E, listener: ListenEvents[E]): this;
    /**
     * Removes a listener for an event.
     */
    off<E extends keyof ListenEvents & string>(event: E, listener?: ListenEvents[E]): this;
    /**
     * Removes all listeners, or those of the specified event.
     */
    removeAllListeners(event?: string): this;
    /**
     * Sends a message to the server using the 'message' event.
     * This is a shorthand for `emit('message', ...args)`.
     */
    send(...args: Parameters<EmitEvents["message"]>): this;
    /**
     * Sends a message to the server.
     * First tries global middlewares, then instance handler defined by `serverSideOn`.
     */
    emit<E extends keyof EmitEvents & string>(event: E, ...args: Parameters<EmitEvents[E]>): this;
    server: {
        on: (event: string, listener: Callback) => void;
        off: (event: string, listener?: Callback) => void;
        emit: (event: string, ...args: any[]) => void;
    };
}
/**
 * Factory function compatible with socket.io-client API.
 * Usage: const socket = io() or io(url, options)
 */
export declare function io(url?: string, options?: MockSocketOptions): MockSocket;
export interface SocketIOStatic {
    (url?: string, options?: MockSocketOptions): MockSocket;
}
declare const ioWithStatics: SocketIOStatic;
export default ioWithStatics;
//# sourceMappingURL=mock-socket.d.ts.map