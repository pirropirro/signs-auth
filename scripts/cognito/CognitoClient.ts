import { Dictionary, map } from 'lodash';
import { injectable, inject } from 'inversify';
import { AuthenticationDetails, CognitoUserPool, CognitoUserAttribute, CognitoUser, CognitoRefreshToken } from 'amazon-cognito-identity-js';

import { Tokens } from '../auth/Tokens';
import { CognitoHandler } from './CognitoHandler';
import { IAuthClient } from '../auth/IAuthClient';

@injectable()
export class CognitoClient implements IAuthClient {
    constructor(@inject("CognitoUserPool") private userPool: CognitoUserPool) { }

    login(Username: string, Password: string): Promise<Tokens> {
        let handler = new CognitoHandler(Username, this.userPool);
        return handler.handle(u => u.authenticateUser.bind(u), new AuthenticationDetails({ Username, Password }), handler);
    }

    provision(username: string, password: string, attributes: Dictionary<string>): Promise<{ sub: string }> {
        return new Promise((res, rej) =>
            this.userPool.signUp(username, password, map(attributes, ((Value, Name) => new CognitoUserAttribute({ Name, Value }))), null,
                (err, data) => err ? rej(err) : res({ sub: data.userSub })))
    }

    verify(Username: string, code: string): Promise<boolean> {
        let handler = new CognitoHandler(Username, this.userPool);
        return new Promise((res, rej) => handler.handle(u => u.confirmRegistration.bind(u), code, false, (err) => err ? rej(err) : res(true)));
    }

    renew(Username: string, RefreshToken: string): Promise<Tokens> {
        let handler = new CognitoHandler(Username, this.userPool);
        return handler.handle(u => u.refreshSession.bind(u), new CognitoRefreshToken({ RefreshToken }), (err, data) => err ? handler.onFailure(err) : handler.onSuccess(data));
    }
}