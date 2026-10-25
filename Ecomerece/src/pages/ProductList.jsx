import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import ProductCard from "../components/ProductCard";

const categories = [
  "All",
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing",
];
const PAGE_SIZE = 8;
export default function ProductList({ search }) {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.products);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState("0");
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);
  useEffect(() => {
    setPage(1);
  }, [category, sort, maxPrice, minRating, search]);
  const filtered = useMemo(() => {
    let result = [...items];
    if (category !== "All")
      result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    result = result.filter(
      (p) => p.price <= maxPrice && (p.rating?.rate || 0) >= Number(minRating),
    );
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "rating")
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    return result;
  }, [items, category, search, maxPrice, minRating, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  if (status === "loading")
    return (
      <div className="status-panel">
        <div className="loader" />
        <p className="eyebrow">CONNECTING TO CATALOGUE</p>
        <h2>Scanning the grid…</h2>
        <p>Pulling the latest products from Fake Store API.</p>
      </div>
    );
  if (status === "failed")
    return (
      <div className="status-panel">
        <div className="status-icon">!</div>
        <h2>Connection interrupted</h2>
        <p>{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(fetchProducts())}
        >
          Retry connection ↗
        </button>
      </div>
    );
  return (
    <section className="page-container shop-page">
      <div className="tech-hero compact-hero">
        <div className="hero-meta-bar">
          <span className="hero-edition">ARCHIVE COLLECTION</span>
        </div>
        <div className="hero-main-row">
          <div className="hero-text-content">
            <h1>
              Good gear. <span>Zero noise.</span>
            </h1>
            <p>
              A refined edit of everyday tech, apparel, and lifestyle essentials crafted for purpose and longevity.
            </p>
          </div>
          <div className="hero-action-group">
            <a href="#catalogue" className="btn btn-primary hero-cta-btn">
              Browse collection <span>↘</span>
            </a>
          </div>
        </div>
        <div className="hero-metrics-bar">
          <div className="metric-item">
            <strong className="metric-val">{items.length > 0 ? items.length : "20"}+</strong>
            <span className="metric-lbl">Curated Items</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <strong className="metric-val">{categories.length - 1}</strong>
            <span className="metric-lbl">Collections</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <strong className="metric-val">100%</strong>
            <span className="metric-lbl">Verified Gear</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <strong className="metric-val">24h</strong>
            <span className="metric-lbl">Fast Dispatch</span>
          </div>
        </div>
      </div>
      <div id="catalogue" className="catalogue-top">
        <div>
          <p className="eyebrow">01 / THE DROP</p>
          <h2>
            Shop the grid{" "}
            <span className="result-count">
              [{filtered.length.toString().padStart(2, "0")}]
            </span>
          </h2>
        </div>
        <label className="sort-control">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>
      <div className="filter-bar">
        <div className="filter-categories" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              className={`category-chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c === "All" ? "All products" : c}
            </button>
          ))}
        </div>
        <div className="filter-controls">
          <label>
            <span>MAX PRICE</span>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            >
              <option value="1000">Any price</option>
              <option value="50">Under $50</option>
              <option value="100">Under $100</option>
              <option value="250">Under $250</option>
              <option value="500">Under $500</option>
            </select>
          </label>
          <label>
            <span>RATING</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="0">Any rating</option>
              <option value="3">3★ and up</option>
              <option value="4">4★ and up</option>
              <option value="4.5">4.5★ and up</option>
            </select>
          </label>
          <button
            className="reset-filters"
            onClick={() => {
              setCategory("All");
              setMaxPrice(1000);
              setMinRating("0");
              setSort("featured");
            }}
          >
            RESET ↺
          </button>
        </div>
      </div>
      <div className="grid-meta">
        <span>
          <span className="live-dot" /> LIVE CATALOGUE
        </span>
        <span>
          SHOWING {visible.length.toString().padStart(2, "0")} OF{" "}
          {filtered.length.toString().padStart(2, "0")}
        </span>
      </div>
      {visible.length ? (
        <div className="product-grid">
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="status-panel compact">
          <h2>No signal found.</h2>
          <p>Try another search or loosen the filters.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setCategory("All");
              setMaxPrice(1000);
              setMinRating("0");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      {filtered.length > PAGE_SIZE && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => {
              setPage((p) => p - 1);
              document
                .getElementById("catalogue")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ← PREVIOUS
          </button>
          <span>
            PAGE <strong>{String(page).padStart(2, "0")}</strong> /{" "}
            {String(pages).padStart(2, "0")}
          </span>
          <button
            disabled={page === pages}
            onClick={() => {
              setPage((p) => p + 1);
              document
                .getElementById("catalogue")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            NEXT →
          </button>
        </div>
      )}
      <RecentlyViewed />
    </section>
  );
}
function RecentlyViewed() {
  const recent = useSelector((s) => s.preferences.recentlyViewed);
  if (!recent.length) return null;
  return (
    <section className="recent-section">
      <div className="catalogue-top">
        <div>
          <p className="eyebrow">02 / YOUR HISTORY</p>
          <h2>Recently viewed</h2>
        </div>
      </div>
      <div className="recent-grid">
        {recent.slice(0, 4).map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="recent-card">
            <img src={p.image} alt={p.title} />
            <span>{p.title}</span>
            <strong>
              ${Number(p.price).toFixed(2)} <b>↗</b>
            </strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
