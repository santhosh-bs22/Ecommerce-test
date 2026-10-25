import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
function App() {
  const [search, setSearch] = useState("");
  return (
    <>
      <Header search={search} onSearchChange={setSearch} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProductList search={search} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="*"
            element={
              <div className="status-panel">
                <h2>Page not found</h2>
                <p>Let's get you back to something good.</p>
                <a href="/" className="btn btn-primary">
                  Back to Cartly
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
export default App;
