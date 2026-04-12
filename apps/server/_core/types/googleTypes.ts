// Google OAuth TypeScript types

export interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token: string;
}

export interface GoogleUserInfo {
  sub: string;        // Unique Google user ID (used as openId)
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
}
