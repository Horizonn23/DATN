import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SigninRequest,
  SignupRequest,
  ForgotPasswordRequest,
} from "@/types/auth";
import { useAuthService } from "@/api/service/authService";

export function useAuthorization() {
  const { signIn, signUp, verify, forgotPassword } = useAuthService();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: (data: SigninRequest) => signIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("SignIn Mutation Error:", error.message);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: SignupRequest) => signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("SignUp Mutation Error:", error.message);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ code, email }: { code: string; email: string }) =>
      verify(code, email),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Verify Mutation Error:", error.message);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("Forgot Password Mutation Error:", error.message);
    },
  });

  return {
    signIn: signInMutation,
    signUp: signUpMutation,
    verifyCode: verifyMutation,
    forgotPassword: forgotPasswordMutation,
  };
}
