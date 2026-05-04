import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAlertHandlers } from "../../utils/modernAlert";
import "./AppAlertsProvider.css";

const defaultConfirm = {
  open: false,
  title: "Confirm Action",
  message: "Are you sure you want to continue?",
  confirmText: "Confirm",
  cancelText: "Cancel",
};

export default function AppAlertsProvider({ children }) {
  const [confirmState, setConfirmState] = useState(defaultConfirm);
  const [resolver, setResolver] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handlers = useMemo(
    () => ({
      notify: (type, message) => {
        if (type === "success") {
          toast.success(message, { autoClose: 2800 });
          return;
        }
        if (type === "error") {
          toast.error(message, { autoClose: 3200 });
          return;
        }
        toast.info(message, { autoClose: 2600 });
      },
      loading: (message) => toast.loading(message || "Processing..."),
      dismiss: (id) => {
        if (id) {
          toast.dismiss(id);
          return;
        }
        toast.dismiss();
      },
      confirm: (config) =>
        new Promise((resolve) => {
          setConfirmState({
            open: true,
            title: config.title || "Confirm Action",
            message:
              config.text || config.message || "Are you sure you want to continue?",
            confirmText: config.confirmButtonText || "Confirm",
            cancelText: config.cancelButtonText || "Cancel",
          });
          setIsClosing(false);
          setResolver(() => resolve);
        }),
    }),
    []
  );

  useEffect(() => {
    registerAlertHandlers(handlers);
    return () => registerAlertHandlers(null);
  }, [handlers]);

  const closeWithResult = (result) => {
    if (!resolver) {
      setConfirmState(defaultConfirm);
      return;
    }

    setIsClosing(true);
    window.setTimeout(() => {
      resolver(result);
      setResolver(null);
      setIsClosing(false);
      setConfirmState(defaultConfirm);
    }, 180);
  };

  return (
    <>
      {children}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: "12px",
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          padding: "12px 14px",
          boxShadow: "0 10px 24px rgba(17, 24, 39, 0.12)",
        }}
        progressStyle={{ background: "#da1727" }}
      />

      {confirmState.open && (
        <div className={`app-confirm-overlay ${isClosing ? "closing" : ""}`}>
          <div className={`app-confirm-modal ${isClosing ? "closing" : ""}`}>
            <h3>{confirmState.title}</h3>
            <p>{confirmState.message}</p>
            <div className="app-confirm-actions">
              <button
                type="button"
                className="app-confirm-cancel"
                onClick={() => closeWithResult(false)}
              >
                {confirmState.cancelText}
              </button>
              <button
                type="button"
                className="app-confirm-ok"
                onClick={() => closeWithResult(true)}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
