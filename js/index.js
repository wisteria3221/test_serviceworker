(function() {

	// HTTPでページにアクセスされた場合、HTTPSでリダイレクト
	if (location.protocol == "http:") {
		location.replace(location.href.replace("http:", "https:"));
		return;
	}

	var isPushEnabled = false;

	$(document).ready(function() {
		// Push通知登録ボタンクリック処理
		$("#register").on("click", function() {
			if (isPushEnabled) {
				unsubscribe();
			} else {
				subscribe();
			}
		});

		// ServiceWorkerがサポートされている場合Push通知サポートを追加し、
		// サポートされていない場合処理をせずに続行
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("./sw.js").then(function(registration) {
				// 登録成功
				var message = "ServiceWorker registration successful with scope: " + registration.scope;
				console.log(message);
				showResultMessage(message);

				initialiseState();
			}).catch(function(error) {
				// 登録失敗
				var message = "ServiceWorker registration failed: " + error;
				console.warn(message);
				showResultMessage(message, true);
			});
		} else {
			var message = "Service workers aren't supported in this browser.";
			console.warn(message);
			showResultMessage(message, true);
		}
	});

	// ServiceWorkerが登録された時、初期状態を設定
	function initialiseState() {
		// Are Notifications supported in the service worker?
		if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
			var message = "Notifications aren't supported.";
			console.warn(message);
			showResultMessage(message, true);
			return;
		}

		// Check the current Notification permission.
		// If its denied, it's a permanent block until the
		// user changes the permission
		if (Notification.permission === "denied") {
			var message = "The user has blocked notifications.";
			console.warn(message);
			showResultMessage(message, true);
			return;
		}

		// Check if push messaging is supported
		if (!("PushManager" in window)) {
			var message = "Push messaging isn't supported.";
			console.warn(message);
			showResultMessage(message, true);
			return;
		}

		// サブスクリプションを確認するためにはServiceWorkerの登録が必要
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			// Push通知のサブスクリプションを持っているか
			serviceWorkerRegistration.pushManager.getSubscription().then(function(subscription) {
				// Push通知のsubscribes / unsubscripes のUIを有効化
				var pushButton = $("#register");
				pushButton.prop("disabled", false);

				if (!subscription) {
					// Pushが予約されていない場合、
					// Pushを有効化できるようにUIを設定
					return;
				}

				// Keep your server in sync with the latest subscriptionId
				// sendSubscriptionToServer(subscription);

				// Set your UI to show they have subscribed for push messages
				pushButton.text("Disable Push Messages");
				isPushEnabled = true;
			}).catch(function(error) {
				var message = "Error during getSubscription()" + error;
				console.warn(message);
				showResultMessage(message, true);
			});
		});
	}

	function subscribe() {
		// Disable the button so it can't be changed while
		// we process the permission request
		var pushButton = $("#register");
		pushButton.prop("disabled", true);

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.subscribe().then(function(subscription) {
				// The subscription was successful
				isPushEnabled = true;
				pushButton.text("Disable Push Messages");
				pushButton.prop("disabled", false);

				console.dir(subscription);

				// TODO: Send the subscription.endpoint to your server
				// and save it to send a push message at a later date
				// return sendSubscriptionToServer(subscription);
			}).catch(function(error) {
				if (Notification.permission === "denied") {
					// The user denied the notification permission which
					// means we failed to subscribe and the user will need
					// to manually change the notification permission to
					// subscribe to push messages
					var message = "Permission for Notifications was denied";
					console.warn(message);
					showResultMessage(message, true);

					pushButton.prop("disabled", true);
				} else {
					// A problem occurred with the subscription; common reasons
					// include network errors, and lacking gcm_sender_id and/or
					// gcm_user_visible_only in the manifest.
					var message = "Unable to subscribe to push." + error;
					console.warn(message);
					showResultMessage(message, true);

					pushButton.prop("disabled", false);
					pushButton.text("Enable Push Messages");
				}
			});
		});
	}

	function unsubscribe() {
		var pushButton = $("#register");
		pushButton.prop("disabled", true);

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			// To unsubscribe from push messaging, you need get the
			// subscription object, which you can call unsubscribe() on.
			serviceWorkerRegistration.pushManager.getSubscription().then(function(pushSubscription) {
				// Check we have a subscription to unsubscribe
				if (!pushSubscription) {
					// No subscription object, so set the state
					// to allow the user to subscribe to push
					isPushEnabled = false;
					pushButton.prop("disabled", false);
					pushButton.text("Enable Push Messages");
					return;
				}

				var subscriptionId = pushSubscription.subscriptionId;
				// TODO: Make a request to your server to remove
				// the subscriptionId from your data store so you
				// don't attempt to send them push messages anymore

				// We have a subscription, so call unsubscribe on it
				pushSubscription.unsubscribe().then(function(successful) {
					pushButton.prop("disabled", false);
					pushButton.text("Enable Push Messages");
					isPushEnabled = false;
				}).catch(function(e) {
					// We failed to unsubscribe, this can lead to
					// an unusual state, so may be best to remove
					// the users data from your data store and
					// inform the user that you have done so

					console.log("Unsubscription error: ", e);
					pushButton.prop("disabled", false);
					pushButton.text("Enable Push Messages");
				});
			}).catch(function(e) {
				console.error("Error thrown while unsubscribing from push messaging.", e);
			});
		});
	}

}());







(function() {
	"use strict";
	return;

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

	function showResultMessage(message, isError) {
		var $messageElement = null;

		$messageElement = $("<p></p>");
		if (isError) {
			$messageElement.addClass("errorMessage");
		}

		$messageElement.text(message);
		$("#result").append($messageElement);
	}
})();
