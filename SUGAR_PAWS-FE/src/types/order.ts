import { ShippingAddress } from "./address";
import { ProductDetail } from "./product";
import { Payment } from "./payment";

// Voucher types
export type VoucherType = "SHIPPING" | "DISCOUNT";
export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface Voucher {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: VoucherType;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  currentUsageCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoucherInfo {
  id: number;
  code: string;
  name: string;
  type: string;
  discountType: string;
  discountValue: number;
}

export interface OrderCalculation {
  totalProduct: number;
  shippingFee: number;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  voucher?: VoucherInfo;
}

export type Order = {
  id: number;
  userId: number;
  shippingAddressId: number;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  deliveredAt?: Date;
  shippingFee?: number;
  totalAmount: number;
  originalAmount?: number;
  discountAmount?: number;
  trackingCode?: string;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  requestCancelAt?: Date;
  status: OrderStatus;
  payId?: number;
  userName?: string;
  phoneNumber?: string;
  voucherId?: number;

  shippingAddress?: ShippingAddress;
  orderItems?: OrderItem[];
  payment?: Payment;
  voucher?: VoucherInfo;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productDetailId: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;

  productDetail?: ProductDetail;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DELIVERED"
  | "COMPLETED"
  | "REQUESTCANCEL"
  | "CANCELLED"
  | "REFUNDED";
