import { Request } from 'express';
import { IController, IRoute } from 'signs-js';

import { JWTPayload } from './jwt/IJWTService';

export function Authenticate(): any {
    return function (route: IRoute, name: string) {
        Reflect.defineMetadata(`controller:route:${name}:auth`, true, route.constructor);
    }
}

export function AuthenticateAll(): any {
    return function (controller: any) {
        Reflect.defineMetadata(`controller:auth`, true, controller);
    }
}

export function needAuth(controller: IController, name: string): boolean {
    return !!Reflect.getMetadata(`controller:auth`, controller.constructor) || !!Reflect.getMetadata(`controller:route:${name}:auth`, controller.constructor);
}


export type AuthenticatedRequest = Request & { auth: JWTPayload };
