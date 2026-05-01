self.addEventListener("push", (event) => {
    let title = "Notification";
    let body = "Default body";
    try {
        const data = event.data.json();
        title = data.title;
        body = data.body;
    } catch (error) {
        body = event.data?.text() || "No message";
    }
    event.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon: "/icon-192.png",
        })
    );
});
