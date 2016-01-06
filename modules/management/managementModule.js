angular.module('management', ['ngRoute', 'checklist-model', 'bootstrap.fileField']);

angular.module('management').controller('mainCtrl', function($scope){
  $scope.selectedTab = "New Ad";

  $scope.isTabSelected = function(tabName){
    return $scope.selectedTab === tabName;
  };
});

angular.module('management').filter('adFilter', function() {
      return function(ads, params) {
        input = input || '';
        var out = "";
        for (var i = 0; i < input.length; i++) {
          out = input.charAt(i) + out;
        }
        // conditional based on optional argument
        if (uppercase) {
          out = out.toUpperCase();
        }
        return out;
      };
    })
    .controller('MyController', ['$scope', function($scope) {
      $scope.greeting = 'hello';
    }]);

angular.module('management').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/management', {
        templateUrl: 'modules/management/management.html',
        //controller: 'manageAdsCtrl'
      controller: 'mainCtrl'
      }).
      when('/editAd/:adId?', {
        templateUrl: 'modules/management/editAd.html',
        controller: 'editAdCtrl'
      });
}]);