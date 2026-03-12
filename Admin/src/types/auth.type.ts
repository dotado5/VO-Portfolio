export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  session: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  } | null;
}
