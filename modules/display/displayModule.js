var displayModule = angular.module('display', ['ngRoute']);

displayModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/display/:screenId', {
        templateUrl: 'modules/display/display.html',
        controller: 'displayAdsCtrl'
      });
}]);