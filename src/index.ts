import { Options, LogLevel, Logger, Client, Evaluator, EventEmitter, MemoryCache } from "switchover-js-core";
import { HttpFetcher } from "./HttpFetcher";

export { Options, LogLevel, Client } from "switchover-js-core";
export { HttpFetcher } from "./HttpFetcher";

/**
     * Create a new client for you given SDK-KEY. You should create only one client per sdkkey accross your application.
     *
     * You can provide several options:
     *
     * - onUpdate: callback when autoRefresh is enabled and toggles have been updated on server-side
     * - autoRefresh: set to true if you want to enable auto refreshing toggles
     * - refreshInterval: interval in seconds for polling the toggle endpoints. Default is 60 seconds.
     *
     * @param sdkKey
     * @param options
     * @param logLevel
     */
    export function createClient(sdkKey: string, options?:Options, logLevel?: LogLevel) : Client {
    
        const logger = Logger.createLogger(logLevel);

        const baseOptions = options || { autoRefresh: false }

        //check for interval
        if (baseOptions.autoRefresh && baseOptions.refreshInterval < 10) {
            baseOptions.refreshInterval = 10;
            logger.debug('Refresh interval was below 10s, set to 10s');
        }


        return new Client(
            new Evaluator(),
            new EventEmitter(),
            new MemoryCache(),
            new HttpFetcher(logger),
            sdkKey,
            baseOptions,
            logLevel);
    }


