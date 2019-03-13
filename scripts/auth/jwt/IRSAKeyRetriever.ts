export interface IRSAKeyRetriever {
    retrive(kid: string): Promise<string>;
}
