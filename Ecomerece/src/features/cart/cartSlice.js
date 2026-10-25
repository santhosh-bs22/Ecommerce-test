import { createSlice } from "@reduxjs/toolkit";
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], coupon: null },
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload || {};
      if (!product || !Number.isInteger(quantity) || quantity < 1) return;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) existing.quantity += quantity;
      else state.items.push({ ...product, quantity });
    },
    increase(state, action) {
      const item = state.items.find((p) => p.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrease(state, action) {
      const item = state.items.find((p) => p.id === action.payload);
      if (!item) return;
      if (item.quantity <= 1)
        state.items = state.items.filter((p) => p.id !== action.payload);
      else item.quantity -= 1;
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
  },
});
export const {
  addToCart,
  increase,
  decrease,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;
export default cartSlice.reducer;
