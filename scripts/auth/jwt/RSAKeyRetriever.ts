const jwksRsa = require("jwks-rsa");
import { inject, injectable } from "inversify";
import { UnauthorizedException } from "signs-js";

import { IAuthConfig } from "../IAuthConfig";
import { IRSAKeyRetriever } from "./IRSAKeyRetriever";

@injectable()
export class RSAKeyRetriever implements IRSAKeyRetriever {
    private client;

    constructor(@inject("IAuthConfig") private config: IAuthConfig) {
        this.client = jwksRsa({
            cache: true,
            rateLimit: true,
            cacheMaxEntries: 5, // Default value
            jwksUri: this.config.issuer + "/.well-known/jwks.json"
        });
    }

    retrive(kid: string): Promise<string> {
        return new Promise<string>((res, rej) =>
            this.client.getSigningKey(kid, (err, key) => err ? rej(new UnauthorizedException(err.message)) : res(key.publicKey || key.rsaPublicKey)));
    }
}
