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

	/**
	 * Push通知の初期設定
	 */
	function initialisePushNotification() {
		// ServiceWorkerが通知に対応しているか判定
		if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
			alert("\"ServiceWorker\" が通知に対応していません");
			return;
		}

		// 通知が拒否されているか判定
		if (Notification.permission === 'denied') {
			alert("通知が拒否しています");
			return;
		}

		// ブラウザがPushAPIに対応しているか判定
		if (!('PushManager' in window)) {
			alert("ブラウザが \"Push API\" に対応していません");
			return;
		}
	}
})();
