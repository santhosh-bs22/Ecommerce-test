import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import {
  selectTotalItems,
  selectGrandTotal,
} from "../features/cart/cartSelectors";
import {
  setLastOrder,
  showToast,
} from "../features/preferences/preferencesSlice";
export default function Checkout() {
  const dispatch = useDispatch();
  const count = useSelector(selectTotalItems);
  const total = useSelector(selectGrandTotal);
  const order = useSelector((s) => s.preferences.lastOrder);
  if (!count && !order) return <Navigate to="/cart" replace />;
  const placeOrder = () => {
    const demoOrder = {
      number: `CT-${Date.now().toString().slice(-7)}`,
      total,
      createdAt: new Date().toISOString(),
    };
    dispatch(setLastOrder(demoOrder));
    dispatch(clearCart());
    dispatch(showToast({ message: "Demo order placed successfully" }));
  };
  if (order && !count)
    return (
      <section className="page-container">
        <div className="empty-cart order-success">
          <div className="success-circle">✓</div>
          <p className="eyebrow">ORDER CONFIRMED</p>
          <h1>That's a wrap.</h1>
          <p>
            Your demo order <strong>{order.number}</strong> has been placed. No
            payment was taken.
          </p>
          <div className="confirmation-total">
            <span>Order total</span>
            <strong>${Number(order.total).toFixed(2)}</strong>
          </div>
          <Link to="/" className="btn btn-primary">
            Back to exploring →
          </Link>
        </div>
      </section>
    );
  return (
    <section className="page-container">
      <div className="checkout-card">
        <p className="eyebrow">FINAL STEP</p>
        <h1>Ready when you are.</h1>
        <p className="muted">
          This is a frontend checkout demo. It does not collect payment or
          personal details.
        </p>
        <div className="checkout-summary">
          <span>
            {count} {count === 1 ? "item" : "items"} in your bag
          </span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <button
          className="btn btn-primary checkout-button"
          onClick={placeOrder}
        >
          Place demo order →
        </button>
        <Link to="/cart" className="back-to-cart">
          ← Back to bag
        </Link>
      </div>
    </section>
  );
}
