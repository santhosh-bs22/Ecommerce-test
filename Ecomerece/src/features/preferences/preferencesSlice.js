import { createSlice } from "@reduxjs/toolkit";
const preferencesSlice = createSlice({
  name: "preferences",
  initialState: {
    theme: "dark",
    recentlyViewed: [],
    toast: null,
    lastOrder: null,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme(state, action) {
      state.theme = action.payload === "dark" ? "dark" : "light";
    },
    addRecentlyViewed(state, action) {
      state.recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter((item) => item.id !== action.payload.id),
      ].slice(0, 8);
    },
    showToast(state, action) {
      state.toast = {
        id: Date.now(),
        message: action.payload.message || action.payload,
        kind: action.payload.kind || "success",
      };
    },
    clearToast(state) {
      state.toast = null;
    },
    setLastOrder(state, action) {
      state.lastOrder = action.payload;
    },
  },
});
export const {
  toggleTheme,
  setTheme,
  addRecentlyViewed,
  showToast,
  clearToast,
  setLastOrder,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
