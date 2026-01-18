export interface SigninRequest {
  identifier: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface LoginResponseData {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
}
