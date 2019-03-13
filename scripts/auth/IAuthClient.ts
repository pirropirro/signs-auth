import { Tokens } from "./Tokens";

export interface IAuthClient {
    login(username: string, password: string): Promise<Tokens>;
    provision(username: string, password: string, attributes: any): Promise<{ sub: string }>;
    verify(username: string, code: string): Promise<boolean>;
    renew(Username: string, refreshToken: string): Promise<Tokens>;
}
