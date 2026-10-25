export default function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  label = "Quantity",
}) {
  return (
    <div className="quantity-stepper" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" onClick={onDecrease}>
        −
      </button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={onIncrease}>
        +
      </button>
    </div>
  );
}
