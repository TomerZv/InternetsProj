var statsModule = angular.module('stats', ['ngRoute']);

statsModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/stats', {
        templateUrl: '/Client/views/stats.html',
        controller: 'statsCtrl'
      });
}]);