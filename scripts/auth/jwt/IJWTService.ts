export interface JWT {
    header: JWTHeader;
    payload: JWTPayload;
}

export interface JWTHeader {
    kid: string;
}

export interface JWTPayload {
    [key: string]: any;
    sub?: string;
    scope?: string;
    aud?: string | string[];
}

export interface IJWTService {
    decode(token: string, options: any): JWT;
    verify(token: string, pubKey: string): Promise<boolean>;
}
