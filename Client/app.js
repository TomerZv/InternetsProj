angular.module('adsApp', ['ngRoute', 'display', 'management', 'stats', 'isteven-multi-select']);

angular.module('adsApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.otherwise('/management');
}]);