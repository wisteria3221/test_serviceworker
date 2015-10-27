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

	// Push通知を初期化
	initialisePushNotification();

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

	function subscribe() {
		// Disable the button so it can't be changed while we process the permission request
		var pushButton = document.querySelector('.js-push-button');
		pushButton.disabled = true;

		navigator.serviceWorker.ready.then(function(registration) {
			registration.pushManager.subscribe().then(function(subscription) {
				// The subscription was successful
				isPushEnabled = true;
				pushButton.textContent = 'Disable Push Messages';
				pushButton.disabled = false;

				// TODO: Send the subscription.endpoint to your server
				// and save it to send a push message at a later date
				return sendSubscriptionToServer(subscription);
			}).catch(function(e) {
				if (Notification.permission === 'denied') {
					// The user denied the notification permission which
					// means we failed to subscribe and the user will need
					// to manually change the notification permission to
					// subscribe to push messages
					console.warn('Permission for Notifications was denied');
					pushButton.disabled = true;
				} else {
					// A problem occurred with the subscription; common reasons
					// include network errors, and lacking gcm_sender_id and/or
					// gcm_user_visible_only in the manifest.
					console.error('Unable to subscribe to push.', e);
					pushButton.disabled = false;
					pushButton.textContent = 'Enable Push Messages';
				}
			});
		});
	}
})();
