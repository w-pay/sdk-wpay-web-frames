export default interface IChallengeResponse {
    type: string;
    instrumentId: string;
    token: string;
    reference?: string;
}