angular.module('management').directive('ad', function() {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/ad/ad.html',
        scope:{
            ad: '='
        },
        controller: function($scope, $location, adsService, modalService){
            var ad = $scope.ad;
            var printArray = function(array) {
                var output = "";

                for (var index = 0; index < array.length; index++){
                    output += array[index] + ", ";
                }

                return output.substring(0, output.length - 2);
            };
            $scope.isSelected = false;

            $scope.clickAd = function(){
                $scope.isSelected = !$scope.isSelected;
            };

            $scope.printScreenIds = function(){
                return printArray(ad.screenIds);
            }

            $scope.printDays = function(timeFrame){
                return printArray(timeFrame.days);
            }

            $scope.edit = function(ad) {
                $location.path("/editAd/" + ad._id);
            };

            $scope.deleteAd = function(ad) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Delete Ad',
                    headerText: 'Delete ' + ad.title + '?',
                    bodyText: 'Are you sure you want to delete this ad?'
                };

                modalService.showModal({}, modalOptions).then(function (result) {
                    adsService.delete(ad._id).then(function(results) {
                        $scope.ad = null;
                    });
                });
            };
        }
    };
});