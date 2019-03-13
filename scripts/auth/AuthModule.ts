import { interfaces } from "inversify";
import { IModule, IRouteDecorator } from 'signs-js';

import { AuthDecorator } from './AuthDecorator';
import { JWTService } from "../auth/jwt/JWTService";
import { TokenService } from "./token/TokenService";
import { ITokenService } from "./token/ITokenService";
import { IJWTService } from "../auth/jwt/IJWTService";
import { RSAKeyRetriever } from "../auth/jwt/RSAKeyRetriever";
import { IRSAKeyRetriever } from "../auth/jwt/IRSAKeyRetriever";

export class AuthModule implements IModule {
    modules(container: interfaces.Container): void {
        container.bind<IRouteDecorator>("IRouteDecorator").to(AuthDecorator);

        container.bind<IJWTService>("IJWTService").to(JWTService);
        container.bind<IRSAKeyRetriever>("IRSAKeyRetriever").to(RSAKeyRetriever);
        container.bind<ITokenService>("ITokenService").to(TokenService).inSingletonScope();
    }
}
