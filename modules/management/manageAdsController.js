managementModule.controller('manageAdsCtrl', function($scope, $location, adsService, $window) {
    
    $scope.ads = [];
    $scope.query = {
        days : [],
        screens : [],
        duration : 0
    };
    $scope.loadAds = function() {
        adsService.getAds().then(function(results) {
           $scope.ads = results.data;
        });
    };
    
    $scope.add = function() {
          $location.path("/editAd");
    };
    
    $scope.edit = function(ad) {
          $location.path("/editAd/" + ad._id);
    };
    
    $scope.deleteAd = function(ad) {
         adsService.deleteAd(ad._id).then(function(results) {
           $scope.ads.splice($scope.ads.indexOf(ad), 1);
        });
    };
    
    $scope.search = function() {
        adsService.searchAds($scope.query.days, $scope.query.screens, $scope.query.duration).then(function(results) {
           $scope.ads = results.data;
        });   
    };
});