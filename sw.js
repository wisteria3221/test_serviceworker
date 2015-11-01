// installイベント
self.addEventListener("install", function(event) {
	console.info(">>>>> onInstall <<<<<")
});

// activateイベント
self.addEventListener("activate", function(event) {
	console.info(">>>>> onActivate <<<<<")
});

// pushイベント
self.addEventListener("push", function(event) {
	console.info(">>>>> onPush <<<<<")

	var title = "ServiceWorker Test";
	var body = "メッセージを受信しました。<br>";
	var icon = "/test_serviceworker/webAppIcon_192x192.png"
	var tag = "push-notification-tag";

	event.waitUntil(
		self.registration.showNotification(title, {
			body: body,
			icon: icon,
			tag: tag
		})
	);
});
