import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectTotalItems } from "../features/cart/cartSelectors";
import { toggleTheme } from "../features/preferences/preferencesSlice";
export default function Header({ search, onSearchChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalItems = useSelector(selectTotalItems);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const theme = useSelector((state) => state.preferences.theme);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">c</span>
          <span>cartly</span>
          <i>.</i>
        </Link>
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <span className="search-icon">⌕</span>
          <input
            type="search"
            placeholder="Search products, brands and more..."
            aria-label="Search products"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </form>
        <nav className="header-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Explore
          </NavLink>
          <NavLink to="/wishlist" className="icon-nav">
            <span aria-hidden="true">♡</span>
            <span className="nav-label">Wishlist</span>
            {wishlistCount > 0 && <b className="mini-badge">{wishlistCount}</b>}
          </NavLink>
          <NavLink to="/cart" className="cart-link">
            <span aria-hidden="true">▣</span>
            <span className="nav-label">Bag</span>
            <span className="cart-badge">{totalItems}</span>
          </NavLink>
          <button
            className="theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {/* {theme === "light" ? "☾" : "☀"} */}
            <span className="nav-label">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
