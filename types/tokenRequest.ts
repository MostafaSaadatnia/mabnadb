import { ClientCredentialsTokenRequest } from "./clientCredentialsTokenRequest";
import { DemoTokenRequest } from "./demoTokenRequest";
import { OTPTokenRequest } from "./OTPTokenRequest";
import { RefreshTokenRequest } from "./refreshTokenRequest";

export type TokenRequest =
    | OTPTokenRequest
    | ClientCredentialsTokenRequest
    | RefreshTokenRequest
    | DemoTokenRequest;