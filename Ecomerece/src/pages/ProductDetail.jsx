import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import {
  addRecentlyViewed,
  showToast,
} from "../features/preferences/preferencesSlice";
import QuantityStepper from "../components/QuantityStepper";
import ProductCard from "../components/ProductCard";
export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.products);
  const {
    selectedProduct: product,
    detailStatus,
    detailError,
  } = useSelector((s) => s.products);
  const saved = useSelector((s) =>
    s.wishlist.items.some((p) => p.id === Number(id)),
  );
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    setQuantity(1);
    setImageIndex(0);
    dispatch(fetchProductById(id));
  }, [dispatch, id]);
  useEffect(() => {
    if (product) dispatch(addRecentlyViewed(product));
  }, [dispatch, product]);
  if (detailStatus === "loading" || detailStatus === "idle")
    return (
      <div className="status-panel">
        <div className="loader" />
        <h2>Loading product…</h2>
      </div>
    );
  if (detailStatus === "failed" || !product)
    return (
      <div className="status-panel">
        <div className="status-icon">!</div>
        <h2>Product unavailable</h2>
        <p>{detailError || "We couldn't find this item."}</p>
        <Link to="/" className="btn btn-primary">
          Back to explore
        </Link>
      </div>
    );
  const related = items
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const gallery = [product.image, product.image, product.image, product.image];
  const add = () => {
    dispatch(addToCart({ product, quantity }));
    dispatch(
      showToast({
        message: `${quantity} item${quantity > 1 ? "s" : ""} added to your bag`,
        kind: "success",
      }),
    );
  };
  return (
    <section className="page-container">
      <div className="breadcrumbs">
        <Link to="/">Explore</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="breadcrumb-current">{product.title}</span>
      </div>
      <div className="detail-card">
        <div className="detail-gallery">
          <div className="detail-image-wrap">
            <img src={gallery[imageIndex]} alt={product.title} />
            <span className="gallery-count">
              {imageIndex + 1} / {gallery.length}
            </span>
          </div>
          <div className="thumbnail-row">
            {gallery.map((img, i) => (
              <button
                key={i}
                className={`thumbnail ${imageIndex === i ? "active" : ""}`}
                onClick={() => setImageIndex(i)}
                aria-label={`View product image ${i + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
          <p className="gallery-note">
            Product images provided by Fake Store API.
          </p>
        </div>
        <div className="detail-info">
          <span className="category-label category-pill">
            {product.category}
          </span>
          <button
            className={`detail-wishlist ${saved ? "is-saved" : ""}`}
            onClick={() => {
              dispatch(toggleWishlist(product));
              dispatch(
                showToast({
                  message: saved
                    ? "Removed from wishlist"
                    : "Saved to wishlist",
                }),
              );
            }}
          >
            {saved ? "♥ Saved" : "♡ Save item"}
          </button>
          <h1>{product.title}</h1>
          <div className="rating detail-rating">
            <span>★</span>
            <strong>{product.rating?.rate ?? "—"}</strong>
            <span className="review-count">
              {product.rating?.count ?? 0} customer reviews
            </span>
          </div>
          <p className="detail-price">${Number(product.price).toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-quantity">
            <span>Quantity</span>
            <QuantityStepper
              quantity={quantity}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => q + 1)}
            />
          </div>
          <div className="detail-actions">
            <button className="btn btn-primary" onClick={add}>
              Add to bag <span>→</span>
            </button>
            <Link to="/cart" className="btn btn-outline">
              View bag
            </Link>
          </div>
          <div className="benefits">
            <p>
              <span>✦</span> Free shipping on orders of $100 or more
            </p>
            <p>
              <span>↻</span> Easy 30-day returns
            </p>
            <p>
              <span>♧</span> Carefully selected everyday finds
            </p>
          </div>
        </div>
      </div>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MORE TO LOVE</p>
            <h2>Related finds</h2>
          </div>
          <Link to="/" className="subtle-link">
            View all →
          </Link>
        </div>
        {related.length ? (
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="muted">Explore our collection for more finds.</p>
        )}
      </section>
    </section>
  );
}
