import { Options, ResponseCache } from "switchover-js-core";

export interface ProxyOption {
    protocol?: string;
    host?: string;
    port?: number | string;
    auth?: {
        username: string,
        password: string
    }
}

export interface ClientOptions extends Options {
    cache?: ResponseCache;
    proxy?: ProxyOption;
}