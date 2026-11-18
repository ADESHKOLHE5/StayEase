import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // ← keeps auth headers & base URL

export default function useFetch<T = any>(url: string): {
  data: T | null;
  loading: boolean;
  error: string;
} {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string>("");

  useEffect(() => {
    if (!url) {
      setLoading(true);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError("");

    async function fetchData() {
      const startTime = Date.now();
      try {
        const response = await axiosInstance.get<T>(url, { signal });
        setData(response.data);
      } catch (err: any) {
        if (err.code === "ERR_CANCELED" || err.name === "AbortError" || err.name === "CanceledError") {
          // Request was cancelled — do nothing
          return;
        } else if (err.response) {
          const msg = err.response.data?.message || "";
          // Treat 404 "Not found" type messages as empty data instead of a hard error
          const isNotFound = err.response.status === 404 || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("no property") || msg.toLowerCase().includes("no booking");
          
          if (isNotFound) {
            setData(null);
            setError("");
          } else {
            setError(msg || `Server error: ${err.response.status}`);
          }
        } else if (err.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError(err.message || "Something went wrong. Please try again.");
        }
      } finally {
        //Keep loader visible for at least 700ms so PageLoader is always seen
        const elapsed = Date.now() - startTime;
        if (elapsed < 1500) {
          await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed));
        }
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort(); // Cancel request on cleanup
    };
  }, [url]);

  return { data, loading, error };
}
