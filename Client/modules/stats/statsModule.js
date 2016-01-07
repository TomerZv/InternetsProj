var statsModule = angular.module('stats', ['ngRoute', 'AngularD3BarGraph']);

statsModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/stats', {
        templateUrl: '/Client/modules/stats/stats.html'
      });
}]);