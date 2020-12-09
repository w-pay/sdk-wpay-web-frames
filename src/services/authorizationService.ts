import IAuthorizationService from './types/IAuthorzationService';

export default class AuthorizationService implements IAuthorizationService {
    private authorizationToken: string = '';
    private apiBase: string = "https://dev.mobile-api.woolworths.com.au";

    public get AuthorizationToken(): string {
        return this.authorizationToken ? `${this.authorizationToken}` : '';
    }

    public async login(username: string, password: string): Promise<void> {
        // call the woolies service
        try {
            const response = await fetch(`${this.apiBase}/wow/v1/idm/accounts/token`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            });

            const responseData = await response.json();
            this.authorizationToken = responseData.accessToken;
        } catch (e) {
            console.log(e);
        }
    }

    public isAuthenticated(): boolean {
        return this.AuthorizationToken.length > 0 ? true : false;
    }
}