export type User = {
  id?: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
  username: string;
  role: "USER" | "ADMIN";
  gender?: string | null;
  dayOfBirth?: number | null;
  monthOfBirth?: number | null;
  yearOfBirth?: number | null;
  isVerified?: boolean;
};
