import { IModule } from "signs-js";
import { interfaces } from "inversify";
import { CognitoUserPool } from 'amazon-cognito-identity-js';

import { CognitoClient } from './CognitoClient';
import { ICognitoConfig } from './ICognitoConfig';
import { IAuthClient } from '../auth/IAuthClient';

export class CognitoModule implements IModule {
    modules(container: interfaces.Container): void {
        container.bind<IAuthClient>("IAuthClient").to(CognitoClient);

        container.bind<CognitoUserPool>("CognitoUserPool").toDynamicValue(() => {
            let { userPoolId, clientId } = container.get<ICognitoConfig>("ICognitoConfig");
            return new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId })
        }).inSingletonScope();
    }
}
