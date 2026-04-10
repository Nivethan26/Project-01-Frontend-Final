let handlers = null;
let loadingToastId = null;

export const registerAlertHandlers = (nextHandlers) => {
  handlers = nextHandlers;
};

const getMessage = (options = {}) => {
  if (options.text) return options.text;
  if (options.title) return options.title;
  if (options.html) return options.html;
  return "Action completed.";
};

const normalizeType = (icon) => {
  if (icon === "success") return "success";
  if (icon === "error") return "error";
  return "info";
};

const fire = async (options = {}) => {
  if (!handlers) {
    return { isConfirmed: true };
  }

  if (options.showCancelButton) {
    const isConfirmed = await handlers.confirm(options);
    return { isConfirmed };
  }

  if (typeof options.didOpen === "function") {
    options.didOpen();
  }

  const message = getMessage(options);
  const type = normalizeType(options.icon);

  // For loading-like popups, prefer loading toasts.
  if (options.allowOutsideClick === false && !options.icon) {
    loadingToastId = handlers.loading(message || "Processing...");
    return { isConfirmed: true };
  }

  handlers.notify(type, message);
  return { isConfirmed: true };
};

const showLoading = (message = "Processing...") => {
  if (!handlers) return;
  loadingToastId = handlers.loading(message);
};

const close = () => {
  if (!handlers) return;
  handlers.dismiss(loadingToastId);
  loadingToastId = null;
};

const Swal = {
  fire,
  showLoading,
  close,
};

export default Swal;
