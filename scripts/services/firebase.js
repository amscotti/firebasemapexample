MapApp.factory('firebase', function ($rootScope) {
	var databaseRef = new Firebase('https://mapexample.firebaseio.com/users');
	var userRef;
	return {
		on: function (eventName, callback) {
			databaseRef.on(eventName, function () {  
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(databaseRef, args);
				});
			});
		},
		push: function(data) {
			userId = databaseRef.push(data).name();
			userRef = new Firebase('https://mapexample.firebaseio.com/users/' + userId);
			userRef.removeOnDisconnect();
		}
	};
});