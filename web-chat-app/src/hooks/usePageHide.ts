import { useEffect } from "react";

export function usePageHide(onHide: () => void) {
  useEffect(() => {
    const handler = () => onHide();
    // pagehide is best for all dismissals (incl. bfcache)
    window.addEventListener("pagehide", handler);
    // Fallback: if browser/tab becomes hidden and soon closes
    const onVis = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", handler);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [onHide]);
}
