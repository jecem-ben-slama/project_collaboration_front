export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  role: string;
  email: string;
}
