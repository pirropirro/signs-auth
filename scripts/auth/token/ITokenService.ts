import { JWT } from "../jwt/IJWTService";

export interface ITokenService {
    decode(token: string): JWT;
    verify(token: string): Promise<[boolean, JWT]>;
}
