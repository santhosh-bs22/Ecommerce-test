import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  increase,
  decrease,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
} from "../features/cart/cartSlice";
import {
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  selectShipping,
  selectDiscount,
  selectGrandTotal,
} from "../features/cart/cartSelectors";
import { showToast } from "../features/preferences/preferencesSlice";
import QuantityStepper from "../components/QuantityStepper";
export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems),
    totalItems = useSelector(selectTotalItems),
    subtotal = useSelector(selectTotalPrice),
    shipping = useSelector(selectShipping),
    discount = useSelector(selectDiscount),
    total = useSelector(selectGrandTotal),
    coupon = useSelector((s) => s.cart.coupon);
  const [couponInput, setCouponInput] = useState("");
  const progress = Math.min(100, (subtotal / 100) * 100);
  const apply = () => {
    const code = couponInput.trim().toUpperCase();
    const coupons = {
      CART10: { code: "CART10", type: "percent", value: 10, label: "10% off" },
      WELCOME5: { code: "WELCOME5", type: "fixed", value: 5, label: "$5 off" },
    };
    if (!coupons[code]) {
      dispatch(
        showToast({ message: "That coupon code isn't valid", kind: "error" }),
      );
      return;
    }
    if (subtotal <= 0) {
      dispatch(
        showToast({
          message: "Add an item before applying a coupon",
          kind: "error",
        }),
      );
      return;
    }
    dispatch(applyCoupon(coupons[code]));
    dispatch(showToast({ message: `Coupon ${code} applied` }));
    setCouponInput("");
  };
  return (
    <section className="page-container cart-page">
      <div className="cart-heading">
        <div>
          <p className="eyebrow">ALMOST YOURS</p>
          <h1>
            Your bag{" "}
            <span>
              ({totalItems} {totalItems === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>
        {items.length > 0 && (
          <Link to="/" className="continue-link">
            ← Keep exploring
          </Link>
        )}
      </div>
      {!items.length ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">▣</div>
          <h2>Your bag is taking a little break.</h2>
          <p>
            There’s nothing in here yet. Find something you love and it’ll show
            up right here.
          </p>
          <Link to="/" className="btn btn-primary">
            Explore Cartly →
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-panel">
            <div className="cart-panel-heading">
              <span>YOUR ITEMS</span>
              <button
                className="text-button"
                onClick={() => {
                  dispatch(clearCart());
                  dispatch(showToast({ message: "Your bag is clear" }));
                }}
              >
                Clear bag
              </button>
            </div>
            {items.map((item) => (
              <article className="cart-row" key={item.id}>
                <Link to={`/product/${item.id}`} className="cart-item-image">
                  <img src={item.image} alt={item.title} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} className="cart-item-title">
                    {item.title}
                  </Link>
                  <p className="category-label">{item.category}</p>
                  <p className="muted">${Number(item.price).toFixed(2)} each</p>
                </div>
                <QuantityStepper
                  quantity={item.quantity}
                  onDecrease={() => dispatch(decrease(item.id))}
                  onIncrease={() => dispatch(increase(item.id))}
                  label={`${item.title} quantity`}
                />
                <strong className="line-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
                <button
                  className="remove-button"
                  aria-label={`Remove ${item.title}`}
                  onClick={() => {
                    dispatch(removeFromCart(item.id));
                    dispatch(showToast({ message: "Item removed from bag" }));
                  }}
                >
                  ×
                </button>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <div className="summary-title">
              <h2>Order summary</h2>
              <span>DEMO CHECKOUT</span>
            </div>
            <div className="shipping-progress">
              <div className="shipping-progress-copy">
                <span>
                  {shipping === 0
                    ? "You've unlocked free shipping!"
                    : `$${(100 - subtotal).toFixed(2)} away from free shipping`}
                </span>
                <strong>{Math.round(progress)}%</strong>
              </div>
              <div className="progress-track">
                <div style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="summary-row">
              <span>Items ({totalItems})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong className={shipping === 0 ? "free-shipping" : ""}>
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </strong>
            </div>
            <div className="coupon-box">
              <label htmlFor="coupon-code">Have a coupon?</label>
              {coupon ? (
                <div className="applied-coupon">
                  <span>
                    ✓ {coupon.code} · {coupon.label}
                  </span>
                  <button
                    onClick={() => {
                      dispatch(removeCoupon());
                      dispatch(showToast({ message: "Coupon removed" }));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="coupon-input">
                  <input
                    id="coupon-code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter code"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), apply())
                    }
                  />
                  <button onClick={apply}>Apply</button>
                </div>
              )}
              <p>
                Try{" "}
                <button onClick={() => setCouponInput("CART10")}>CART10</button>{" "}
                or{" "}
                <button onClick={() => setCouponInput("WELCOME5")}>
                  WELCOME5
                </button>
              </p>
            </div>
            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount</span>
                <strong>−${discount.toFixed(2)}</strong>
              </div>
            )}
            <div className="summary-total">
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button
              className="btn btn-primary checkout-button"
              onClick={() => navigate("/checkout")}
            >
              Continue to checkout →
            </button>
            <p className="persist-note">✓ Your bag is saved automatically.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
