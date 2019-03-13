import { inject, injectable, } from "inversify";
import { UnauthorizedException } from "signs-js";

import { ITokenService } from "./ITokenService";
import { IJWTService, JWT } from "../jwt/IJWTService";
import { IRSAKeyRetriever } from "../jwt/IRSAKeyRetriever";

@injectable()
export class TokenService implements ITokenService {
    constructor(@inject("IJWTService") private jwt: IJWTService,
        @inject("IRSAKeyRetriever") private rsa: IRSAKeyRetriever) { }

    public async verify(token: string): Promise<[boolean, JWT]> {
        let decoded = this.decode(token);
        let pubKey = await this.rsa.retrive(decoded.header.kid);
        let valid = await this.jwt.verify(this.getToken(token), pubKey);

        return [valid, decoded];
    }

    public decode(token: string): JWT {
        let decoded = this.jwt.decode(this.getToken(token), { complete: true });
        if (!decoded || !decoded.header) throw new UnauthorizedException("Token Authorization Error");
        else return decoded;
    }

    private getToken(authorization: string): string {
        return authorization ? authorization.replace("Bearer ", "") : null;
    }
}
