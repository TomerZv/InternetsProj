angular.module('adsApp', ['ngRoute', 'display', 'management', 'stats']);

angular.module('adsApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.otherwise('/management');
}]);