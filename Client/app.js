angular.module('adsApp', ['ngRoute', 'display', 'management', 'stats', 'map','isteven-multi-select', 'png.timeinput']);

angular.module('adsApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.otherwise('/management');
}]);