export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.detail) {
    if (typeof data.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => item.msg || item.detail || JSON.stringify(item))
        .join(", ");
    }
  }

  if (error?.code === "ERR_NETWORK" || (error?.request && !error?.response)) {
    return "Cannot reach the server. Make sure the FastAPI backend is running on http://localhost:8000.";
  }

  if (error?.response?.status === 400) {
    return "Request failed. This product ID may already exist.";
  }

  return error?.message || fallback;
}
