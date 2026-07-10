export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
}
