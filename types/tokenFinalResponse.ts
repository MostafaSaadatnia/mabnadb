export interface TokenFinalResponse {
    type: 'tokens';
    claims: {
        sub: string;
        [claimName: string]: any;
    };
    accessToken: string;
    accessTokenExpiration: number;
    refreshToken?: string;
    refreshTokenExpiration?: number | null;
    alerts?: {
        type: 'warning' | 'info';
        messageCode: string;
        message: string;
        messageParams?: { [param: string]: string };
    }[];
}