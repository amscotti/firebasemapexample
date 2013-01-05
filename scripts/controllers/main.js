'use strict';

MapApp.controller('MainCtrl', function($scope, firebase) {

  $scope.myMarkers = [];
   
  $scope.mapOptions = {
    center: new google.maps.LatLng(35.784, -78.670),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 10,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}
  };
   
  $scope.addMarker = function(message) {
    var foundItem = _.find($scope.myMarkers, function(item) { 
      return item.id === message.id; 
    });
    if(foundItem === undefined){
      var marker = new google.maps.Marker({
        map: $scope.myMap,
        title: message.id,
        position: new google.maps.LatLng(message.latitude, message.longitude)
      });
      $scope.myMarkers.push({"id": message.id, "marker": marker});
    }
  };

  $scope.removeMarker = function(id) {
    var foundItem = _.find($scope.myMarkers, function(item) { 
      return item.id === id; 
    });
    if(foundItem !== undefined){
      foundItem.marker.setMap(null);
      $scope.myMarkers = _.reject($scope.myMarkers, function(item) { 
        return item.id === id; 
      });
  }
  };

  $scope.updateMarker = function(message) {
    var foundItem = _.find($scope.myMarkers, function(item) { 
      return item.id === message.id; 
    });
    foundItem.marker.setPosition(new google.maps.LatLng(message.latitude, message.longitude));
  };


  firebase.on('child_added', function(snapshot) {
    var id = snapshot.name(), message = snapshot.val();
    message.id = id;
    console.log(id);
    $scope.addMarker(message);
  });

  firebase.on('child_removed', function(snapshot) {
    var id = snapshot.name()
    console.log(id);
    $scope.removeMarker(id);
  });

  $scope.getPosition = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          firebase.push({'latitude' : position.coords.latitude, 'longitude' : position.coords.longitude});
          /*
          socket.on('connect', function(){
            socket.emit("add", {'latitude' : position.coords.latitude, 'longitude' : position.coords.longitude});
          });
          */
          $scope.myMap.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          /*
          setInterval ( function() {

            socket.emit("add", {
              'latitude' : position.coords.latitude,
              'longitude' : position.coords.longitude
            });
        }, 10000);
        */
        }, function() {}, {maximumAge: 75000}
      );
    }
  };
});