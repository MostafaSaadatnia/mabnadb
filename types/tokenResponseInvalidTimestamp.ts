/** Can be returned when grant_type="refresh_token" if the given time_stamp differs too much
 * from server time. Will happen if the client's clock differs too much from the server.
 * Client should then retry the token request using grant_type="refresh_token" again but
 * regenerate the signature from (server_time + refresh_token).
 */
export interface TokenResponseInvalidTimestamp {
    type: 'invalid-timestamp';
    server_time: number; // Allows client to adjust its timestamp by diffing server time with client and redo refresh_token request.
    message: string;
}