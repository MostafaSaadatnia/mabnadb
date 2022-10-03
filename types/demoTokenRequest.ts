export interface DemoTokenRequest {
    grant_type: 'demo';
    scopes: ['ACCESS_DB'];
    demo_user: string; // Email of a demo user that must have been added using the MabnaDB cloud CLI.
    public_key?: string;
}