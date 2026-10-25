import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increase, decrease } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { showToast } from "../features/preferences/preferencesSlice";
import QuantityStepper from "./QuantityStepper";
export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const wishlist = useSelector((s) => s.wishlist.items);
  const quantity =
    cartItems.find((item) => item.id === product.id)?.quantity || 0;
  const saved = wishlist.some((item) => item.id === product.id);
  const add = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(showToast({ message: "Added to your bag", kind: "success" }));
  };
  const wish = () => {
    dispatch(toggleWishlist(product));
    dispatch(
      showToast({
        message: saved ? "Removed from wishlist" : "Saved to wishlist",
        kind: "success",
      }),
    );
  };
  return (
    <article className="product-card">
      <div className="product-media">
        <Link
          to={`/product/${product.id}`}
          className="product-image-wrap"
          aria-label={`View ${product.title}`}
        >
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        </Link>
        <button
          className={`wishlist-button ${saved ? "is-saved" : ""}`}
          onClick={wish}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          title={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          {saved ? "♥" : "♡"}
        </button>
        {product.rating?.rate >= 4.5 && (
          <span className="product-tag">TOP RATED</span>
        )}
      </div>
      <div className="product-card-body">
        <p className="category-label">{product.category}</p>
        <Link to={`/product/${product.id}`} className="product-title">
          {product.title}
        </Link>
        <div className="rating">
          <span>★</span>
          <strong>{product.rating?.rate ?? "—"}</strong>
          <span className="review-count">({product.rating?.count ?? 0})</span>
        </div>
        <div className="product-card-bottom">
          <strong className="price">${Number(product.price).toFixed(2)}</strong>
          {quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              onDecrease={() => dispatch(decrease(product.id))}
              onIncrease={() => dispatch(increase(product.id))}
              label={`${product.title} quantity`}
            />
          ) : (
            <button className="btn btn-primary btn-small" onClick={add}>
              Add to bag <span>+</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
