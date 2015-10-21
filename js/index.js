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
		}).catch(function(error) {
			// 登録失敗
			var message = "ServiceWorker registration failed: " + error;
			console.warn(message);
			$("#result").text(message);
		});
	} else {
		alert("ブラウザが \"ServiceWorker\" に対応していません");
	}
})();
