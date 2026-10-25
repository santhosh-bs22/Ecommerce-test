import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store";
import App from "./App";
import "./index.css";

function ThemedApp() {
  const theme = useSelector((state) => state.preferences.theme);
  return (
    <div className={`app theme-${theme}`}>
      <App />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={<div className="boot-screen">Loading Cartly…</div>}
        persistor={persistor}
      >
        <BrowserRouter>
          <ThemedApp />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
