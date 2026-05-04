import axios from "axios";

const DEFAULT_API_ORIGIN = "http://127.0.0.1";

function resolveApiOrigin() {
  const configuredOrigin = process.env.REACT_APP_API_ORIGIN || DEFAULT_API_ORIGIN;

  try {
    if (typeof window !== "undefined") {
      const frontendHost = window.location.hostname;
      const apiUrl = new URL(configuredOrigin);

      // Keep API host aligned with frontend host to avoid cookie/site mismatches.
      if ((frontendHost === "localhost" && apiUrl.hostname === "127.0.0.1") || (frontendHost === "127.0.0.1" && apiUrl.hostname === "localhost")) {
        apiUrl.hostname = frontendHost;
      }

      return apiUrl.toString();
    }
  } catch (_) {
    return configuredOrigin;
  }

  return configuredOrigin;
}

const API_ORIGIN = resolveApiOrigin().replace(/\/$/, "");
const BACKEND_BASE = `${API_ORIGIN}/Backend`;
const REQUEST_TIMEOUT_MS = Number(process.env.REACT_APP_API_TIMEOUT_MS || 12000);
const API_DEBUG_ENABLED = String(process.env.REACT_APP_API_DEBUG || "false").toLowerCase() === "true";

const LOCAL_BACKEND_PREFIX_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/Backend/i;
const LOCAL_ROOT_ENDPOINT_RE = /^\/(forgot-password|reset-password)(\/|$)/i;

function normalizeUrl(url) {
  if (typeof url !== "string") {
    return url;
  }

  // Support PHP endpoints that live at the web root (outside /Backend).
  // This avoids relying on CRA proxy configuration for these routes.
  if (LOCAL_ROOT_ENDPOINT_RE.test(url)) {
    const endpoint = url.match(/^\/(forgot-password|reset-password)(\/|$)/i)?.[1];
    if (!endpoint) {
      return url;
    }

    // Prefer the endpoints under /Backend to keep backend routes grouped.
    // Use index.php so Apache runs PHP for OPTIONS preflight and cors.php can emit headers.
    return `${API_ORIGIN}/Backend/${endpoint}/index.php`;
  }

  if (LOCAL_BACKEND_PREFIX_RE.test(url)) {
    return url.replace(LOCAL_BACKEND_PREFIX_RE, BACKEND_BASE);
  }

  if (url.startsWith("/Backend")) {
    if (url.includes(".index.php")) {
      url = url.replace(".index.php", "/index.php");
    }
    return `${API_ORIGIN}${url}`;
  }

  return url;
}

function logDebug(label, payload) {
  if (!API_DEBUG_ENABLED) {
    return;
  }

  console.log(label, payload);
}

function logDebugError(label, payload) {
  if (!API_DEBUG_ENABLED) {
    return;
  }

  console.error(label, payload);
}

function setupAxiosDiagnostics() {
  axios.defaults.timeout = REQUEST_TIMEOUT_MS;

  axios.interceptors.request.use(
    (config) => {
      const originalUrl = config.url;
      const normalizedUrl = normalizeUrl(originalUrl);

      if (normalizedUrl && normalizedUrl !== originalUrl) {
        config.url = normalizedUrl;
      }

      logDebug("[API][AXIOS][REQUEST]", {
        method: (config.method || "GET").toUpperCase(),
        originalUrl,
        url: config.url,
        timeout: config.timeout,
      });

      return config;
    },
    (error) => {
      logDebugError("[API][AXIOS][REQUEST][ERROR]", error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      logDebug("[API][AXIOS][RESPONSE]", {
        url: response.config?.url,
        status: response.status,
      });
      return response;
    },
    (error) => {
      const config = error?.config || {};
      logDebugError("[API][AXIOS][RESPONSE][ERROR]", {
        method: (config.method || "GET").toUpperCase(),
        url: config.url,
        status: error?.response?.status,
        message: error?.message,
        data: error?.response?.data,
      });
      return Promise.reject(error);
    }
  );
}

function setupFetchDiagnostics() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const rawUrl = typeof input === "string" ? input : input?.url;
    const normalizedUrl = normalizeUrl(rawUrl);

    const controller = new AbortController();
    const hasExternalSignal = Boolean(init.signal);

    let abortTimeoutId = null;
    if (!hasExternalSignal) {
      abortTimeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    }

    const finalInit = {
      ...init,
      signal: hasExternalSignal ? init.signal : controller.signal,
    };

    const finalInput =
      typeof input === "string"
        ? normalizedUrl || input
        : normalizedUrl && rawUrl !== normalizedUrl
        ? new Request(normalizedUrl, input)
        : input;

    logDebug("[API][FETCH][REQUEST]", {
      method: (finalInit.method || "GET").toUpperCase(),
      originalUrl: rawUrl,
      url: normalizedUrl || rawUrl,
      timeout: hasExternalSignal ? "external-signal" : REQUEST_TIMEOUT_MS,
    });

    try {
      const response = await originalFetch(finalInput, finalInit);
      logDebug("[API][FETCH][RESPONSE]", {
        url: normalizedUrl || rawUrl,
        status: response.status,
      });
      return response;
    } catch (error) {
      logDebugError("[API][FETCH][ERROR]", {
        url: normalizedUrl || rawUrl,
        message: error?.message,
        name: error?.name,
      });
      throw error;
    } finally {
      if (abortTimeoutId) {
        window.clearTimeout(abortTimeoutId);
      }
    }
  };
}

export default function setupApiRuntime() {
  logDebug("[API][RUNTIME] Config", {
    apiOrigin: API_ORIGIN,
    backendBase: BACKEND_BASE,
    timeoutMs: REQUEST_TIMEOUT_MS,
  });

  setupAxiosDiagnostics();
  setupFetchDiagnostics();
}
