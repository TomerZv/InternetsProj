var displayModule = angular.module('display', ['ngRoute']);

displayModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/display/:screenId', {
        templateUrl: '/Client/modules/display/display.html',
        controller: 'displayAdsCtrl'
      });
}]);