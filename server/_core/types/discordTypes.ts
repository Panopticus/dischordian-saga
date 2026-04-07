// Discord OAuth TypeScript types

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUserInfo {
  id: string;           // Discord user snowflake ID
  username: string;
  discriminator: string;
  global_name: string | null;
  email?: string;
  verified?: boolean;
  avatar: string | null;
}
