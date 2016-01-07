angular.module('management').controller('manageAdsCtrl', function($scope, $location, adsService) {
    
    $scope.ads = [];

    $scope.loadAds = function() {
        adsService.getAds().then(function(results) {
           $scope.ads = results.data;
        });
    };
    
    $scope.add = function() {
          $location.path("/editAd");
    };
});