import { useQuery, useMutation } from "@tanstack/react-query";
import { useVoucherService } from "@/api/service/voucherService";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { showErrorToast } from "@/components/ui/ErrorToast";

// Query keys
const VOUCHER_KEYS = {
  all: ["vouchers"] as const,
  active: ["vouchers", "active"] as const,
  user: ["vouchers", "user"] as const,
  validate: (code: string, amount: number) =>
    ["vouchers", "validate", code, amount] as const,
};

// Hooks for voucher queries
export function useActiveVouchers() {
  const { getActiveVouchers } = useVoucherService();
  return useQuery({
    queryKey: VOUCHER_KEYS.active,
    queryFn: getActiveVouchers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUserVouchers() {
  const { getUserVouchers } = useVoucherService();

  return useQuery({
    queryKey: VOUCHER_KEYS.user,
    queryFn: getUserVouchers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useValidateVoucher() {
  const { validateVoucher } = useVoucherService();

  return useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) =>
      validateVoucher(code, amount),
    onSuccess: (data) => {
      if (data.isValid) {
        showSuccessToast("Voucher is valid!");
      } else {
        showErrorToast(data.message || "Voucher is not valid");
      }
    },
    onError: (error) => {
      showErrorToast(error.message || "Failed to validate voucher");
    },
  });
}
