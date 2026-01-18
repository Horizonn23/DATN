import { ProductDetail } from "./product";

export type CartItem = {
  id: number;
  productDetail: ProductDetail;
  quantity: number;
};

export type Cart = {
  id: string;
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
};
