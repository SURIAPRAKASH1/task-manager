import { useSelector } from "react-redux";

const publicVapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;

function urlBase64ToUnit8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function subscribeUser(token) {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("Service Worker registered:", registration);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission not granted");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUnit8Array(publicVapidKey),
      });

      console.log("User subscribed:", subscription);

      await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/push-subscribe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  } else {
    console.warn("Push messaging is not supported in this browser");
  }
}

export default subscribeUser;
