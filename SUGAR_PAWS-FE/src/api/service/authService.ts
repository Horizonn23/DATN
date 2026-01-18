import API from "@/api/api";
import { useRequest } from "@/api/Request";
import {
  SigninRequest,
  LoginResponseData,
  SignupRequest,
  ForgotPasswordRequest,
} from "@/types/auth";

export function useAuthService() {
  const { Request } = useRequest();

  const signIn = async ({ identifier, password }: SigninRequest) => {
    try {
      const { data } = await Request.post<LoginResponseData>(API.LOGIN, {
        identifier,
        password,
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("SignIn Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Sign in failed.");
    }
  };

  const signUp = async ({ name, username, email, password }: SignupRequest) => {
    try {
      const { data } = await Request.post<LoginResponseData>(API.REGISTER, {
        name,
        username,
        email,
        password,
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("SignUp Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Sign up failed.");
    }
  };

  const verify = async (code: string, email: string) => {
    try {
      const { data } = await Request.post(API.VERIFY, { code, email });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Verify Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Verification failed.");
    }
  };

  const forgotPassword = async ({ email }: ForgotPasswordRequest) => {
    try {
      const { data } = await Request.post(API.FORGOT_PASSWORD, { email });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Forgot Password Error:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to send reset email.",
      );
    }
  };

  return { signIn, signUp, verify, forgotPassword };
}
