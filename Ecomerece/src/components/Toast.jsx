import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearToast } from "../features/preferences/preferencesSlice";
export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.preferences.toast);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(clearToast()), 2800);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.kind}`} role="status">
      <span>{toast.kind === "error" ? "!" : "✓"}</span>
      {toast.message}
      <button
        onClick={() => dispatch(clearToast())}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
