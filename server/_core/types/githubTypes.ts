// GitHub OAuth TypeScript types

export interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface GitHubUserInfo {
  id: number;           // GitHub user numeric ID
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}
