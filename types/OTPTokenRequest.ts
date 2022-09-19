export interface OTPTokenRequest {
    grant_type: 'otp';
    public_key?: string; // If a refresh token is requested. Clients own the keypair and sign refresh_token requests using it.
    email: string;
    scopes: string[]; // TODO use CLIENT_SCOPE type.
    otp_id?: string;
    otp?: string;
  }