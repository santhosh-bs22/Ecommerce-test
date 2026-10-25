import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Link to="/" className="footer-brand">
            cartly<span>.</span>
          </Link>
          <p>Good finds. Better everyday.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Explore</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Your bag</Link>
        </div>
        <span className="copyright">
          © {new Date().getFullYear()} Cartly · Demo storefront
        </span>
      </div>
    </footer>
  );
}
