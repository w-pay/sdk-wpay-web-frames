import IAuthorizationService from './types/IAuthorzationService';
export default class AuthorizationService implements IAuthorizationService {
    private authorizationToken;
    private apiBase;
    get AuthorizationToken(): string;
    login(username: string, password: string): Promise<void>;
    isAuthenticated(): boolean;
}
