/* ═══════════════════════════════════════════════════════
   useOnlineStatus — Detects network connectivity changes.
   Triggers toast notifications and exposes isOnline state.
   ═══════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored", {
        description: "Ark comms array back online.",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Connection lost", {
        description: "Some features may be unavailable until reconnected.",
        duration: Infinity,
        id: "offline-toast",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
