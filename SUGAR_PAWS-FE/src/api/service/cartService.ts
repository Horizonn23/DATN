import { Cart, CartItem } from "@/types/cart";
import { useRequest } from "../Request";
import API from "../api";
import { ApiError } from "next/dist/server/api-utils";

export function useCartService() {
  const { Request } = useRequest();

  const addToCart = async (productDetailId: number, quantity: number) => {
    try {
      const { data } = await Request.post<CartItem>(API.CART_ITEM, {
        productDetailId,
        quantity,
      });
      return data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        throw new Error(error.message as string);
      } else console.log(error);
    }
  };

  const getCartItems = async () => {
    try {
      const { data } = await Request.get<Cart>(API.CART);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ApiError) throw new Error(error.message);
      else
        console.error(
          "GetCartItems Error:",
          error.response?.data || error.message,
        );
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      const { data } = await Request.del(`${API.CART_ITEM}/${cartItemId}`);
      return data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        throw new Error(error.message as string);
      } else throw new Error("An error happen, please try again later!");
    }
  };

  const updateCart = async (
    cartItemId: number,
    quantity: number,
    newProductDetailId?: number,
  ) => {
    try {
      const { data } = await Request.patch<CartItem>(
        `${API.CART_ITEM}/${cartItemId}`,
        {
          quantity,
          newProductDetailId: newProductDetailId,
        },
      );
      return data;
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        throw new Error(error.message as string);
      } else throw new Error("An error happen, please try again later!");
    }
  };

  return { addToCart, getCartItems, removeFromCart, updateCart };
}
