import { Voucher } from "@/types/order";
import { useRequest } from "../Request";
import API from "../api";

export interface ValidateVoucherDto {
  voucherCode: string;
  orderAmount: number;
}

export interface VoucherValidation {
  isValid: boolean;
  message?: string;
  discountAmount?: number;
}

export interface UserVoucher {
  id: number;
  userId: number;
  voucherId: number;
  usedAt: Date;
  orderId?: number;
  voucher: Voucher;
}

export function useVoucherService() {
  const { Request } = useRequest();

  const getActiveVouchers = async () => {
    try {
      const { data } = await Request.get<Voucher[]>(`${API.VOUCHERS}/active`);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "GetActiveVouchers Error:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch active vouchers.",
      );
    }
  };

  const getUserVouchers = async () => {
    try {
      const { data } = await Request.get<UserVoucher[]>(
        `${API.VOUCHERS}/my-vouchers`,
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "GetUserVouchers Error:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch user vouchers.",
      );
    }
  };

  const validateVoucher = async (
    voucherCode: string,
    orderAmount: number,
  ): Promise<VoucherValidation> => {
    try {
      const { data } = await Request.post<VoucherValidation>(
        `${API.VOUCHERS}/validate`,
        { voucherCode, orderAmount },
      );
      return data || { isValid: false, message: "Invalid response" };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "ValidateVoucher Error:",
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.message || "Failed to validate voucher.",
      );
    }
  };

  return {
    getActiveVouchers,
    getUserVouchers,
    validateVoucher,
  };
}
