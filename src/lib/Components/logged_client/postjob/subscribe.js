import { apiUrl } from "@Shared/constants";

require("browser-env")(["window", "navigator", "document"]);

const convertedVapidKey = urlBase64ToUint8Array(
  "BMSMy4iVHJXAqq1f4L5o-xvRlUJQ900EkfI-kft-lBjbvyqkIX5lm_nU8XibDYnbRhUEUQr6e0Gdk0aYd7SRoUo",
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function sendSubscription(subscription, data) {
  process.env.NODE_ENV === "development" &&
    console.log("@@@@@@@@*******helloworld", subscription, data);
  return fetch(apiUrl.SEND_NOTIFICATION, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscription: subscription, post: data }),
  });
}

export function subscribeUser(basis) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then(function(registration) {
        if (!registration.pushManager) {
          process.env.NODE_ENV === "development" && console.log("Push manager unavailable.");
          return;
        }

        registration.pushManager.getSubscription().then(function(existedSubscription) {
          if (existedSubscription === null) {
            process.env.NODE_ENV === "development" &&
              console.log("No subscription detected, make a request.");
            registration.pushManager
              .subscribe({
                applicationServerKey: convertedVapidKey,
                userVisibleOnly: true,
              })
              .then(function(newSubscription) {
                sendSubscription(newSubscription, basis);
              })
              .catch(function(e) {
                if (Notification.permission !== "granted") {
                  process.env.NODE_ENV === "development" &&
                    console.log("Permission was not granted.");
                } else {
                  console.error("An error ocurred during the subscription process.", e);
                }
              });
          } else {
            sendSubscription(existedSubscription, basis);
          }
        });
      })
      .catch(function(e) {
        console.error("An error ocurred during Service Worker registration.", e);
      });
  }
}
