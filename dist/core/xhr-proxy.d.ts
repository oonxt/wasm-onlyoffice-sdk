export interface XHRMiddleware {
    (request: Request): Response | null | Promise<Response | null>;
}
/**
 * Creates an XMLHttpRequest proxy class that supports middleware
 * @param BaseXHR The original XMLHttpRequest class
 * @returns The enhanced XMLHttpRequest class
 */
export declare function createXHRProxy(BaseXHR?: {
    new (): XMLHttpRequest;
    prototype: XMLHttpRequest;
    readonly UNSENT: 0;
    readonly OPENED: 1;
    readonly HEADERS_RECEIVED: 2;
    readonly LOADING: 3;
    readonly DONE: 4;
}): {
    new (): {
        "__#private@#isMocked": boolean;
        "__#private@#requestMethod": string;
        "__#private@#requestUrl": string;
        "__#private@#requestHeaders": Headers;
        "__#private@#requestBody": any;
        open(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null): void;
        setRequestHeader(name: string, value: string): void;
        send(body?: Document | XMLHttpRequestBodyInit | null): void;
        "__#private@#tryMiddlewares"(): Promise<boolean>;
        "__#private@#handleMockResponse"(response: Response): Promise<void>;
        onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null;
        readonly readyState: number;
        readonly response: any;
        readonly responseText: string;
        responseType: XMLHttpRequestResponseType;
        readonly responseURL: string;
        readonly responseXML: Document | null;
        readonly status: number;
        readonly statusText: string;
        timeout: number;
        readonly upload: XMLHttpRequestUpload;
        withCredentials: boolean;
        abort(): void;
        abort(): void;
        getAllResponseHeaders(): string;
        getAllResponseHeaders(): string;
        getResponseHeader(name: string): string | null;
        getResponseHeader(name: string): string | null;
        overrideMimeType(mime: string): void;
        overrideMimeType(mime: string): void;
        readonly UNSENT: 0;
        readonly OPENED: 1;
        readonly HEADERS_RECEIVED: 2;
        readonly LOADING: 3;
        readonly DONE: 4;
        addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        onabort: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        onload: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        onloadend: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        onloadstart: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        onprogress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
        dispatchEvent(event: Event): boolean;
        dispatchEvent(event: Event): boolean;
    };
    _middlewares: XHRMiddleware[];
    /**
     * Register global middleware
     */
    use(middleware: XHRMiddleware): void;
    /**
     * Clear all middleware
     */
    clearMiddlewares(): void;
    readonly UNSENT: 0;
    readonly OPENED: 1;
    readonly HEADERS_RECEIVED: 2;
    readonly LOADING: 3;
    readonly DONE: 4;
};
//# sourceMappingURL=xhr-proxy.d.ts.map