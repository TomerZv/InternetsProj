angular.module('management').directive('manageAds', function() {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/manageAds/manageAds.html',
        scope:{
            name: '@'
        },
        controller: function($scope, $location, adsService) {

            $scope.ads = [];

            $scope.loadAds = function() {
                adsService.getAll().then(function(results) {
                    $scope.ads = results.data;
                });
            };

            $scope.add = function() {
                $location.path("/editAd");
            };
        }
    };
});