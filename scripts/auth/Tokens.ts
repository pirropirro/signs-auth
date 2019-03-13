import { Dictionary } from 'lodash';

export interface Tokens {
    payload: Dictionary<string>;
    accessToken: string;
    idToken: string;
    refreshToken: string;
}