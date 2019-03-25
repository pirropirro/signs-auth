import { IModule } from 'signs-js';
import { interfaces } from "inversify";
import { IHttpClient, HttpClient } from "signs-net";

import { AuthHttpClient } from "./AuthHttpClient";

export class AuthNetModule implements IModule {
    modules(container: interfaces.Container): void {
        container.unbind("IHttpClient");
        container.bind<IHttpClient>("HttpClient").to(HttpClient).inSingletonScope();
        container.bind<IHttpClient>("IHttpClient").to(AuthHttpClient).inSingletonScope();
    }
}
