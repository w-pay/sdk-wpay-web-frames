export default interface IAuthorizationService {
    readonly AuthorizationToken: string;

    login(username: string, password: string): Promise<any>;
    isAuthenticated(): boolean;
}