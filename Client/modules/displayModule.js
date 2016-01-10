var displayModule = angular.module('display', ['ngRoute']);

displayModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/display/:screenId', {
        templateUrl: '/Client/views/display.html',
        controller: 'displayAdsCtrl'
      });
}]);