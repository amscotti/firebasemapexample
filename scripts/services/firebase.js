'use strict'

MapApp.factory('firebase', ($rootScope) => {
  // Initialize Firebase
  const config = {
    apiKey: 'AIzaSyBs8yv-YdRHPtNZT2i8VXfVxUWHwluBcCk',
    authDomain: 'fir-map-1530919060444.firebaseapp.com',
    databaseURL: 'https://fir-map-1530919060444.firebaseio.com',
    projectId: 'firebase-map-1530919060444',
    storageBucket: 'firebase-map-1530919060444.appspot.com',
    messagingSenderId: '679294726844'
  }

  firebase.initializeApp(config)

  const database = firebase.database()
  const databaseRef = database.ref('users')

  return {
    on: (eventName, callback) => {
      databaseRef.on(eventName, function () {
        $rootScope.$apply(() => callback.apply(databaseRef, arguments))
      })
    },
    push: (data) => databaseRef.push(data).onDisconnect().remove()
  }
})
