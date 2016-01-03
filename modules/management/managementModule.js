var managementModule = angular.module('management', ['ngRoute', 'checklist-model', 'bootstrap.fileField']);

managementModule.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/management', {
        templateUrl: 'modules/management/management.html',
        controller: 'manageAdsCtrl'
      }).
      when('/editAd/:adId?', {
        templateUrl: 'modules/management/editAd.html',
        controller: 'editAdCtrl'
      });
}]);