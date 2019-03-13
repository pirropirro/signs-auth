import { IAuthenticationCallback, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { UnauthorizedException } from '../engine/Exception';


type CognitoAction<T extends any[]> = (...args: T) => void;

export class CognitoHandler implements IAuthenticationCallback {
    private user: CognitoUser

    private resolve: (value?: any | PromiseLike<any>) => void;
    private reject: (reason?: any) => void;

    private __promise: Promise<any> = new Promise((res, rej) => {
        this.resolve = res;
        this.reject = rej;
    });

    constructor(username: string, userPool: CognitoUserPool) {
        this.user = new CognitoUser({ Username: username, Pool: userPool });
    }

    handle<T extends CognitoAction<P>, P extends any[]>(cb: (user: CognitoUser) => T, ...options: P): Promise<any> {
        let action = cb(this.user);
        action(...options);
        return this.__promise;
    }

    onSuccess(session: CognitoUserSession, userConfirmationNecessary?: boolean): void {
        this.resolve({
            payload: session.getAccessToken().decodePayload(),
            accessToken: session.getAccessToken().getJwtToken(),
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken()
        })
    }
    onFailure(err: any): void {
        this.reject(new UnauthorizedException(err.message))
    }

    newPasswordRequired(userAttributes: any, requiredAttributes: any): void {
        let att = {};
        requiredAttributes.forEach(k => att[k] = "a");
        this.user.completeNewPasswordChallenge("Test123!!!!", att, this)
    }
}
