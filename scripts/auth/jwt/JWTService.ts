import * as jsonwebtoken from "jsonwebtoken";
import { injectable, inject } from "inversify";
import { UnauthorizedException } from 'signs-js';

import { IAuthConfig } from "../IAuthConfig";
import { IJWTService, JWT } from "./IJWTService";

@injectable()
export class JWTService implements IJWTService {
    constructor(@inject("IAuthConfig") private config: IAuthConfig) { }

    public decode(token: string, options: any): JWT {
        return jsonwebtoken.decode(token, options) as any;
    }

    public verify(token: string, pubKey: string): Promise<boolean> {
        let options = { issuer: this.config.issuer, algorithms: this.config.algorithms };
        return new Promise<boolean>((res, rej) => jsonwebtoken.verify(token, pubKey, options,
            error => error ? rej(new UnauthorizedException(error.message)) : res(true)));
    }
}
