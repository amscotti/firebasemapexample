'use strict'

const MapApp = angular.module('MapApp', ['ngRoute', 'ui'])
  .config(['$routeProvider', ($routeProvider) => {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      })
  }])
