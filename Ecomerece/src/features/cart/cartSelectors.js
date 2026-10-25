export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectTotalPrice = (state) =>
  Number(
    state.cart.items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2),
  );
export const selectShipping = (state) => {
  const subtotal = selectTotalPrice(state);
  return subtotal === 0 || subtotal >= 100 ? 0 : 5;
};
export const selectDiscount = (state) => {
  const subtotal = selectTotalPrice(state);
  const coupon = state.cart.coupon;
  if (!coupon || subtotal <= 0) return 0;
  return Number(
    (coupon.type === "percent"
      ? (subtotal * coupon.value) / 100
      : coupon.value
    ).toFixed(2),
  ) > subtotal
    ? subtotal
    : Number(
        (coupon.type === "percent"
          ? (subtotal * coupon.value) / 100
          : coupon.value
        ).toFixed(2),
      );
};
export const selectGrandTotal = (state) =>
  Number(
    Math.max(
      0,
      selectTotalPrice(state) + selectShipping(state) - selectDiscount(state),
    ).toFixed(2),
  );
