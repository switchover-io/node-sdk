import { Logger, Fetcher, ApiResponse } from "switchover-js-core"
import { API_ENDPOINT_HOST, API_ENDPOINT_PATH, API_ENDPOINT_PORT, API_ENDPOINT_FILENAME } from './sdk-config';
import * as https from 'https';

export class HttpFetcher implements Fetcher {

    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    fetchAll(sdkKey: string, lastModified?: string): Promise<ApiResponse> {

        const options = {
            hostname: API_ENDPOINT_HOST,
            port: API_ENDPOINT_PORT,
            path: API_ENDPOINT_PATH + "/" + sdkKey + "/" + API_ENDPOINT_FILENAME,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, must-revalidate',
                'X-Switchover-Client-ID': sdkKey,
                'X-Switchover-User-Agent': 'switchover-js/1.0'
            }
        }

        if (lastModified) {
            this.logger.debug('Fetch using last Header Last-Modified ' + lastModified);
            options.headers['If-Modified-Since'] = lastModified;
        }

        return new Promise((resolve, reject) => {

            const request = https.request(options, response => {

                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
 
                    const body = data ? JSON.parse(data) : null;
                    if (response.statusCode === 200) {
                        
                        const lastModified = response.headers["last-modified"];
                        this.logger.debug('Response Last-Modified ' + lastModified);

                       resolve({
                            lastModified: lastModified,
                            payload: body
                        });
                    } else if (response.statusCode === 304) {
                        this.logger.debug('Config unchanged');
                        resolve(null);
                    } else if (response.statusCode > 400) {
                        reject({ status: response.statusCode, text: body});
                    }
                });
            });

            request.on('error', (e) => {
                this.logger.error(e.message);
                reject({ status: e.name, text: e.message });
            });
            request.end();
        });
    }

}