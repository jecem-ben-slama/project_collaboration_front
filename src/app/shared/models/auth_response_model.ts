export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  email: string;
}
