'use strict'

MapApp.controller('MainCtrl', function ($scope, firebase) {
  $scope.myMarkers = []

  $scope.mapOptions = {
    center: new google.maps.LatLng(35.784, -78.670),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 10,
    mapTypeControl: false,
    navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL }
  }

  $scope.findMarker = (markerId) => $scope.myMarkers.find((item) => item.id === markerId)

  $scope.addMarker = (key, message) => {
    const foundItem = $scope.findMarker(key)
    if (!foundItem) {
      const marker = new google.maps.Marker({
        map: $scope.myMap,
        title: key,
        position: new google.maps.LatLng(message.latitude, message.longitude)
      })
      $scope.myMarkers.push({ 'id': key, 'marker': marker })
    }
  }

  $scope.removeMarker = (id) => {
    const foundItem = $scope.findMarker(id)
    if (foundItem) {
      foundItem.marker.setMap(null)
      $scope.myMarkers = $scope.myMarkers.filter((item) => item.id !== id)
    }
  }

  $scope.updateMarker = (key, message) => {
    const foundItem = $scope.findMarker(key)
    if (foundItem) {
      foundItem.marker.setPosition(new google.maps.LatLng(message.latitude, message.longitude))
    }
  }

  firebase.on('child_added', (snapshot) => $scope.addMarker(snapshot.key, snapshot.val()))
  firebase.on('child_changed', (snapshot) => $scope.updateMarker(snapshot.key, snapshot.val()))
  firebase.on('child_removed', (snapshot) => $scope.removeMarker(snapshot.key))

  $scope.getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          firebase.push({ 'latitude': position.coords.latitude, 'longitude': position.coords.longitude })
          $scope.myMap.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
        }, () => {
        }, { maximumAge: 75000 }
      )
    }
  }
})
