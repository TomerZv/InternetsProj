angular.module('management').directive('templateContainer', function() {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/template/templateContainer.html',
        scope: {
            screens: '=',
            ad: '='
        }
    };
});