var mapModule = angular.module('map', ['ngRoute']);

mapModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/map', {
        templateUrl: '/Client/modules/map/map.html',
        controller: 'mapCtrl'
  });
}]);
