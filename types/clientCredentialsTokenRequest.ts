export interface ClientCredentialsTokenRequest {
    grant_type: 'client_credentials';
    client_id: string;
    client_secret: string;
    public_key?: string; // If a refresh token is requested. The web client calling the server-client should own corresponding private key.
    scopes: string[]; // TODO: Move TOKEN_SCOPE type to this lib and use it instead.
    claims?: {
      sub: string;
      email?: string;
      email_verified?: string;
      [customClaim: string]: any;
    };
    expires_in?: string; // timespan string compatible with https://github.com/vercel/ms
    not_before?: string; // timespan string compatible with https://github.com/vercel/ms
  }