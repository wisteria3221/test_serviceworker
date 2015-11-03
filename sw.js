// Pushメッセージのリクエスト先URL
var PUSH_MESSAGES_REQUEST_URL = "/test_serviceworker/requestpushmessages/";

// GCM URL
var GCM_URL = "https://android.googleapis.com/gcm/send/";

// installイベント
self.addEventListener("install", function(event) {
	console.info(">>>>> onInstall <<<<<")
});

// activateイベント
self.addEventListener("activate", function(event) {
	console.info(">>>>> onActivate <<<<<")
});

// fetchイベント
self.addEventListener("fetch", function(event) {
	console.info(">>>>> onFetch <<<<<")
	console.dir(event);

	var requestURL = new URL(event.request.url);
	if (requestURL.pathname != PUSH_MESSAGES_REQUEST_URL) {
		return;
	}

	var gcmHeaders = new Headers();
	gcmHeaders.append("Authorization", "key=AIzaSyA19D7_W40E0NRTlE4zHirnrp5nFtar1a4");
	gcmHeaders.append("Content-Type", "application/json");

	var gcmInitObject = {
		method: "POST",
		headers: gcmHeaders,
		mode: "cors",
		cache: "default"
	};
	var gcmRequest = new Request(GCM_URL, gcmInitObject);

	event.respondWith(
		fetch(gcmRequest).then(function(response) {
			return response;
		}).catch(function(error) {
			return new Response("{\"message\":\"Request failed.\"}", {
				headers: {
					"Content-Type": "application/json"
				}
			})
		})
	);
});

// pushイベント
self.addEventListener("push", function(event) {
	console.info(">>>>> onPush <<<<<")

	var title = "ServiceWorker Test";
	var body = "メッセージを受信しました。";
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
