angular.module('management').directive('adTemplate', function() {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/template/template.html',
        scope: {
            ad: '='
        },
        controller: function($scope){
            $scope.templates =
                [{name: "template1", textRows: 4, images: 2, videos : 0},
                 {name: "template2", textRows: 7, images: 2, videos : 0},
                 {name: "template3", textRows: 0, images: 0, videos : 1}];

            $scope.getTextNumber = function() {
                return new Array($scope.templates[$scope.ad.templateId - 1].textRows);
            };

            $scope.getImagesNumber = function() {
                return new Array($scope.templates[$scope.ad.templateId - 1].images);
            };

            $scope.getVideosNumber = function() {
                return new Array($scope.templates[$scope.ad.templateId - 1].videos);
            };
        }
    };
});