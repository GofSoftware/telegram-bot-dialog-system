import * as https from 'https';
import * as http from 'http';
import { ITelegramResponse, NameValuePair, TelegramApiError } from './telegram-api';

export class HttpClient {

    constructor(private telegramBotToken: string = null) {
    }

    public httpDeleteRequest(host: string, port: number, path: string): Promise<void> {
        return new Promise(((resolve, reject) => {
            const request = http.request({
                host: host,
                port: port,
                path: path,
                method: 'DELETE'
            }, (response: any) => {
                response.on('data', (data: any) => {
                    if(response.statusCode !== 200 && response.statusCode !== 201) {
                        reject(`Status code: ${response.statusCode} data: ${data}`);
                    } else {
                        resolve();
                    }
                });
            }).on('error', (error: any) => {
                reject(error);
            });
            request.end();
        }));
    }

    public httpGetRequest(url: string): Promise<any> {
        return new Promise(((resolve, reject) => {
            http.get(url, (response: any) => {
                const contentType = response.headers['content-type'];

                if (contentType === 'application/json') {
                    this.jsonHttpResponseHandler(resolve, response);
                }

                if (contentType === 'application/octet-stream') {
                    this.octetHttpResponseHandler(resolve, response);
                }

            }).on('error', (error: any) => {
                reject(error);
            });
        }));
    }

    public httpsGetRequest(url: string): Promise<any> {
        return new Promise(((resolve, reject) => {
            https.get(url, (response: any) => {
                const contentType = response.headers['content-type'];

                if (contentType === 'application/json') {
                    this.jsonHttpResponseHandler(resolve, response);
                }

                if (contentType === 'application/octet-stream') {
                    this.octetHttpResponseHandler(resolve, response);
                }

            }).on('error', (error: any) => {
                reject(error);
            });
        }));
    }

    public textHttpResponseHandler(resolve: (value: any) => void, response: any): void {
        response.setEncoding('utf8');
        let data = '';

        response.on('data', (chunk: string) => {
            data += chunk;
        });

        response.on('end', () => {
            resolve(data);
        });
    }

    public jsonHttpResponseHandler(resolve: (value: any) => void, response: any): void {
        response.setEncoding('utf8');
        let data = '';

        response.on('data', (chunk: string) => {
            data += chunk;
        });

        response.on('end', () => {
            resolve(JSON.parse(data));
        });
    }

    public octetHttpResponseHandler(resolve: (value: any) => void, response: any): void {
        const data: Buffer[] = [];

        response.on('data', (chunk: Buffer) => {
            data.push(chunk);
        });

        response.on('end', () => {
            resolve(Buffer.concat(data));
        });
    }

    public handleError(response: ITelegramResponse): void {
        console.error(`Got error from Telegram: [${response.error_code}] ${response.description}`);
        throw TelegramApiError.fromTelegramResponse(response);
    }

    public getMethodUrl(methodName: string, params: NameValuePair[] = null): string {
        const url = `https://api.telegram.org/bot${this.telegramBotToken}/${methodName}`;
        const paramsString = (params == null) ? '' : '?' +
            params.filter((p) => p.value != null).map((p) => `${p.name}=${encodeURIComponent(p.value)}`).join('&');
        return `${url}${paramsString}`;
    }

    public getFileDownloadUrl(filePath: string): string {
        return `https://api.telegram.org/file/bot${this.telegramBotToken}/${filePath}`;
    }
}
