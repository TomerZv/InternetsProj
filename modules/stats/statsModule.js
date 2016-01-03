var statsModule = angular.module('stats', ['ngRoute', 'AngularD3BarGraph']);

statsModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/stats', {
        templateUrl: 'modules/stats/stats.html'
      });
}]);