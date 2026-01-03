import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("Notification" in window);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported in your browser");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        toast.success("Push notifications enabled!");
        // Show a test notification
        new Notification("FF Events", {
          body: "You'll now receive alerts for new events!",
          icon: "/favicon.ico",
        });
        return true;
      } else if (result === "denied") {
        toast.error("Notifications were denied. Enable them in browser settings.");
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
      return false;
    }
  }, [isSupported]);

  const showNotification = useCallback((title: string, body: string, onClick?: () => void) => {
    if (permission !== "granted") return;

    const notification = new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: "ff-event",
    });

    if (onClick) {
      notification.onclick = () => {
        window.focus();
        onClick();
        notification.close();
      };
    }
  }, [permission]);

  return {
    isSupported,
    permission,
    isEnabled: permission === "granted",
    requestPermission,
    showNotification,
  };
};
