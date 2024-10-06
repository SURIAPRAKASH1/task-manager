self.addEventListener("push", function (event) {
  const data = event.data.json();
  // console.log("Push received", data);

  self.registration.showNotification(data.title, {
    body: data.body,
  });

  // Send data to the client (React component)
  self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage(data);
    });
  });
});
