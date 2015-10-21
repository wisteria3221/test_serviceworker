// installイベント
self.addEventListener("install", function(e) {
	console.info(">>>>> onInstall <<<<<")
});

// activateイベント
self.addEventListener("activate", function(e) {
	console.info(">>>>> onActivate <<<<<")
});

// pushイベント
self.addEventListener("push", function(e) {
	console.info(">>>>> onPush <<<<<")

	e.waitUntil(
		self.registration.showNotification("Push Notification Title", {
			body: "(・∀・)",
			icon: "/test_serviceworker/icon_192x192.png",
			tag: "push-notification-tag"
		})
	);
});
