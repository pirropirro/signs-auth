import { IHttpClient } from "signs-net";
import { merge, Dictionary } from "lodash";
import { inject, injectable } from "inversify";
import { HttpResponse } from "signs-net/dist/net/IHttpClient";
import { ICognitoConfig } from "./ICognitoConfig";

@injectable()
export class CognitoHttpClient implements IHttpClient {
    constructor(@inject("HttpClient") private httpClient: IHttpClient,
        @inject("ICognitoConfig") private config: ICognitoConfig) { }

    get(url: string, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.retrieveToken(token => this.httpClient.get(url, this.mergeHeaders(headers, token)));
    }

    post(url: string, body: any, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.retrieveToken(token => this.httpClient.post(url, body, this.mergeHeaders(headers, token)));
    }

    put(url: string, body: any, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.retrieveToken(token => this.httpClient.put(url, body, this.mergeHeaders(headers, token)));
    }

    delete(url: string, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.retrieveToken(token => this.httpClient.delete(url, this.mergeHeaders(headers, token)));
    }

    private mergeHeaders(headers: Dictionary<string>, accessToken: string): Dictionary<string> {
        return accessToken ? merge({
            Authorization: 'Bearer ' + accessToken
        }, headers) : headers;
    }

    private async retrieveToken(cb: (accessToken: string) => Promise<HttpResponse>): Promise<HttpResponse> {
        let { access_token } = (await this.httpClient.post(`${this.config.domain}/oauth2/token?grant_type=client_credentials&scope=transactions%2Fpost`, null, {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": 'Basic ' + Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
        })).response;

        return cb(access_token);
    }
}
