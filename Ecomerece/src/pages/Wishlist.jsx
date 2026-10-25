import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearWishlist } from "../features/wishlist/wishlistSlice";
import ProductCard from "../components/ProductCard";
export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist.items);
  return (
    <section className="page-container">
      <div className="section-heading page-title-row">
        <div>
          <p className="eyebrow">YOUR PERSONAL SHORTLIST</p>
          <h1>
            Wishlist <span className="title-count">{items.length}</span>
          </h1>
          <p className="muted">Keep the things you love close.</p>
        </div>
        {items.length > 0 && (
          <button
            className="btn btn-outline"
            onClick={() => dispatch(clearWishlist())}
          >
            Clear wishlist
          </button>
        )}
      </div>
      {items.length ? (
        <div className="product-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-cart">
          <div className="empty-cart-icon heart-icon">♡</div>
          <h2>Nothing saved. Yet.</h2>
          <p>
            Tap the heart on anything that catches your eye. Your favourites
            will be waiting here.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore products →
          </Link>
        </div>
      )}
    </section>
  );
}
