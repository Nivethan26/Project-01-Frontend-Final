import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import "./ProtectedRoute.css";

const normalizeRole = (role) => (typeof role === "string" ? role.toLowerCase() : "");

const writeSessionAuthCache = (user) => {
  if (!user || typeof user !== "object") return;

  if (user.id != null) {
    sessionStorage.setItem("user-id", String(user.id));
  }

  if (user.username) {
    sessionStorage.setItem("username", String(user.username));
  }

  if (user.email) {
    sessionStorage.setItem("email", String(user.email));
  }

  if (user.role) {
    sessionStorage.setItem("user-role", String(user.role).toLowerCase());
  }
};

const clearSessionAuthCache = () => {
  sessionStorage.removeItem("user-id");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("user-role");
};

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  allowedRoles,
}) {
  const location = useLocation();
  const allowed = useMemo(() => {
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return null;
    return allowedRoles.map(normalizeRole);
  }, [allowedRoles]);

  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch(`/Backend/api/check-auth/index.php`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          clearSessionAuthCache();
          if (!cancelled) setState({ loading: false, ok: false });
          return;
        }

        const data = await res.json();
        const user = data?.user;
        const role = normalizeRole(user?.role);

        if (allowed && !allowed.includes(role)) {
          clearSessionAuthCache();
          if (!cancelled) setState({ loading: false, ok: false });
          return;
        }

        writeSessionAuthCache(user);
        if (!cancelled) setState({ loading: false, ok: true });
      } catch (_) {
        clearSessionAuthCache();
        if (!cancelled) setState({ loading: false, ok: false });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [allowed]);

  if (state.loading) {
    return (
      <div className="protected-route-loading" role="status" aria-live="polite">
        <div className="protected-route-spinner" />
        <div className="protected-route-loading-text">Checking session…</div>
      </div>
    );
  }

  if (!state.ok) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  return children;
}
