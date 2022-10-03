import { TokenFinalResponse } from "./tokenFinalResponse";
import { TokenOtpSentResponse } from "./tokenOtpSentResponse";
import { TokenResponseInvalidTimestamp } from "./tokenResponseInvalidTimestamp";

export type TokenResponse =
    | TokenFinalResponse
    | TokenOtpSentResponse
    | TokenResponseInvalidTimestamp;