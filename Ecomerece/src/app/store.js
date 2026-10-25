import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageModule from "redux-persist/lib/storage";
import productsReducer from "../features/products/productsSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import preferencesReducer from "../features/preferences/preferencesSlice";

const storage =
  storageModule && typeof storageModule.getItem === "function"
    ? storageModule
    : storageModule?.default && typeof storageModule.default.getItem === "function"
      ? storageModule.default
      : {
          getItem: (key) =>
            Promise.resolve(
              typeof window !== "undefined" ? window.localStorage.getItem(key) : null,
            ),
          setItem: (key, value) =>
            Promise.resolve(
              typeof window !== "undefined"
                ? window.localStorage.setItem(key, value)
                : undefined,
            ),
          removeItem: (key) =>
            Promise.resolve(
              typeof window !== "undefined"
                ? window.localStorage.removeItem(key)
                : undefined,
            ),
        };

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  preferences: preferencesReducer,
});
const persistedReducer = persistReducer(
  {
    key: "cartly",
    version: 1,
    storage,
    whitelist: ["cart", "wishlist", "preferences"],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
