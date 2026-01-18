import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CartItem as ApiCartItem } from "@/types/cart";

// selectedItems lưu cả object ApiCartItem
interface CartState {
  selectedItems: ApiCartItem[];
}

const initialState: CartState = {
  selectedItems: [],
};

function isSameCartItem(a: ApiCartItem, b: ApiCartItem) {
  return String(a.id) === String(b.id);
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectItem: (state, action: PayloadAction<ApiCartItem>) => {
      if (
        !state.selectedItems.some((item) =>
          isSameCartItem(item, action.payload),
        )
      ) {
        state.selectedItems.push(action.payload);
      }
    },
    deselectItem: (state, action: PayloadAction<ApiCartItem>) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => !isSameCartItem(item, action.payload),
      );
    },
    selectAll: (state, action: PayloadAction<ApiCartItem[]>) => {
      state.selectedItems = [...action.payload];
    },
    deselectAll: (state) => {
      state.selectedItems = [];
    },
    setSelectedItems: (state, action: PayloadAction<ApiCartItem[]>) => {
      state.selectedItems = [...action.payload];
    },
  },
});

// Export actions
export const {
  selectItem,
  deselectItem,
  selectAll,
  deselectAll,
  setSelectedItems,
} = cartSlice.actions;

// Export selectors
export const selectCartSelectedItems = (state: RootState) =>
  state.cart.selectedItems;

// Export reducer
export default cartSlice.reducer;
