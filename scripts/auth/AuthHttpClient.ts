import { IHttpClient } from "signs-net";
import { merge, Dictionary } from "lodash";
import { inject, injectable } from "inversify";
import { HttpResponse } from "signs-net/dist/net/IHttpClient";
import { ICognitoConfig } from "../cognito";

@injectable()
export class AuthHttpClient implements IHttpClient {
    constructor(@inject("HttpClient") private httpClient: IHttpClient,
        @inject("ICognitoConfig") private config: ICognitoConfig) { }

    get(url: string, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.httpClient.get(url, this.mergeHeaders(headers));
    }

    post(url: string, body: any, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.httpClient.post(url, body, this.mergeHeaders(headers));
    }

    put(url: string, body: any, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.httpClient.put(url, body, this.mergeHeaders(headers));
    }

    delete(url: string, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.httpClient.delete(url, this.mergeHeaders(headers));
    }

    private mergeHeaders(headers: Dictionary<string>): Dictionary<string> {
        return merge({
            Authorization: 'Basic ' + Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
        }, headers);
    }
}