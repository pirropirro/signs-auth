import { IModule } from 'signs-js';
import { interfaces } from "inversify";
import { IHttpClient, HttpClient } from "signs-net";

import { CognitoHttpClient } from "./CognitoHttpClient";

export class CognitoNetModule implements IModule {
    modules(container: interfaces.Container): void {
        container.unbind("IHttpClient");
        container.bind<IHttpClient>("HttpClient").to(HttpClient).inSingletonScope();
        container.bind<IHttpClient>("IHttpClient").to(CognitoHttpClient).inSingletonScope();
    }
}
