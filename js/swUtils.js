var swUtils = (function() {
	/**
	 * Push通知をGCMに登録する
	 */
	function _subscribe(onsuccess, onerror) {
		// ServiceWorker登録完了後に実行
		navigator.serviceWorker.ready.then(function(registration) {
			// Push通知を登録
			registration.pushManager.subscribe({
				userVisibleOnly: true
			}).then(function(subscription) {
				// Push通知登録IDを取得
				var endpointParts = subscription.endpoint.split("/");
				registrationId = endpointParts[endpointParts.length - 1];

				// 成功時処理が指定されている場合、Push通知登録IDを渡して実行
				if (typeof onsuccess == "function") {
					onsuccess(registrationId);
				}
			}).catch(function(error) {
				// 失敗時処理が指定されている場合、エラーオブジェクトを渡して実行
				if (typeof onerror == "function") {
					onerror(error);
				}
			});
		});
	}

	/**
	 * Push通知の登録を解除する
	 */
	function _unsubscribe(onsuccess, onerror) {
		// ServiceWorker登録完了後に実行
		navigator.serviceWorker.ready.then(function(registration) {
			// Push通知登録情報を取得
			registration.pushManager.getSubscription().then(function(subscription) {
				// Push通知が登録されていない場合
				if (!subscription) {
					// 成功時処理が指定されている場合、Push通知登録IDを渡して実行
					if (typeof onsuccess == "function") {
						onsuccess();
					}
					return;
				}

				subscription.unsubscribe().then(function(successful) {
					// 成功時処理が指定されている場合、Push通知登録IDを渡して実行
					if (typeof onsuccess == "function") {
						onsuccess();
					}
				}).catch(function(error) {
					// 失敗時処理が指定されている場合、エラーオブジェクトを渡して実行
					if (typeof onerror == "function") {
						onerror(error);
					}
				});
			}).catch(function(error) {
				// 失敗時処理が指定されている場合、エラーオブジェクトを渡して実行
				if (typeof onerror == "function") {
					onerror(error);
				}
			});
		});
	}

	return {
		subscribe: _subscribe,
		unsubscribe: _unsubscribe
	};
})();
