var statsModule = angular.module('stats', ['ngRoute']);

statsModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/stats', {
        templateUrl: '/Client/modules/stats/stats.html',
        controller: 'statsCtrl'
      });
}]);