export interface MDBClient {
    id: string;
    email: string;
    emailVerified: boolean;
    scopes: string[]; // TODO: Use the CLIENT_SCOPE[] type.
}