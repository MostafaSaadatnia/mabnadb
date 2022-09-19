export interface RefreshTokenRequest {
    grant_type: 'refresh_token';
    scopes: string[]; // TODO use CLIENT_SCOPE type.
    public_key?: string; // Optional. Makes it possible to renew keypair. Given signature must still be generated using the old keypair.
    refresh_token: string;
    time_stamp: number;
    signing_algorithm: string; // "RSA256"
    signature: string; // Base64 signature of (refresh_token + time_stamp) using the private key that corresponds to the public_key sent when retrieving the refresh_token.
}