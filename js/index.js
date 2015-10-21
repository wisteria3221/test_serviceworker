(function() {
	"use strict";

	if (location.protocol == "http:") {
		location.replace(location.href.replace("http:", "https:"));
		return;
	}

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("/test_serviceworker/sw.js").then(function(registration) {
			// 登録成功
			console.log("ServiceWorker registration successful with scope: ", registration.scope);
		}).catch(function(err) {
			// 登録失敗
			console.warn("ServiceWorker registration failed: ", err);
		});
	}
})();
