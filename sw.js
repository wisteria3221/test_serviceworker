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

	var title = "Yay a message.";
	var body = "We have received a push message.";
	var icon = "/test_serviceworker/icon_192x192.png"
	var tag = "simple-push-demo-notification-tag";

	event.waitUntil(
		self.registration.showNotification(title, {
			body: body,
			icon: icon,
			tag: tag
		})
	);
});
