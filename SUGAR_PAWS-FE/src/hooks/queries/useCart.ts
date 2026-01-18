import { useCartService } from "@/api/service/cartService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";

export function useAddProductToCart() {
  const { addToCart } = useCartService();
  const queryClient = useQueryClient();

  const addProductToCart = async (productId: number, quantity: number) => {
    try {
      const data = await addToCart(productId, quantity);
      await queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      return data;
    } catch (error) {
      console.error("AddProductToCart Error:", error);
      throw new Error(error.message);
    }
  };

  return { addProductToCart };
}

export function useGetCartItems() {
  const { getCartItems } = useCartService();
  const userInfo = useSelector(selectUser);
  const isLoggedIn = !!(userInfo && userInfo.username);

  const getCartItemsQuery = useQuery({
    queryKey: ["cartItems"],
    queryFn: () => getCartItems(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: isLoggedIn,
  });

  return { getCartItems: getCartItemsQuery };
}

export function useRemoveCartItem() {
  const { removeFromCart } = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: number) => {
      await removeFromCart(cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });
}

export function useUpdateCartItem() {
  const { updateCart } = useCartService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cartItemId,
      quantity,
      newProductDetailId,
    }: {
      cartItemId: number;
      quantity: number;
      newProductDetailId?: number;
    }) => {
      await updateCart(cartItemId, quantity, newProductDetailId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });
}
