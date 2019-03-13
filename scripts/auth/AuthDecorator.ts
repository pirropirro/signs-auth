import { merge } from "lodash";
import { inject, injectable } from "inversify";
import { IController, IRoute, IRouteDecorator, RouteMetadata, UnauthorizedException } from 'signs-js';

import { ITokenService } from "./token/ITokenService";
import { needAuth, AuthenticatedRequest } from './Authenticate';


@injectable()
export class AuthDecorator implements IRouteDecorator {
    constructor(@inject("ITokenService") private service: ITokenService) { }

    decorate(route: IRoute, controller: IController, { name }: RouteMetadata): IRoute {
        if (!needAuth(controller, name)) return route;

        return async (req) => {
            let authorization = req.headers.authorization || req.headers.Authorization as string;
            if (!authorization) throw new UnauthorizedException("No authorization token found in the headers");

            let [valid, decoded] = await this.service.verify(authorization);
            if (!valid) throw new UnauthorizedException("No valid authorization token");
            if (!decoded) throw new UnauthorizedException("No decoded token");

            return route(merge(req, { auth: decoded.payload }) as AuthenticatedRequest);
        }
    }
}
