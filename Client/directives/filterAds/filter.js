angular.module('management').directive('filterAds', function() {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/filterAds/filter.html',
        scope: {
            filters: '='
        },
        controller: function($scope){
            $scope.filters = {
                days : [],
                screenIds : [],
                text : ""
            };

            $scope.daysInput = [{name: 'Sunday', value:1, selected: false},
                            {name: 'Monday', value:2, selected: false},
                            {name: 'Tuesday', value:3, selected: false},
                            {name: 'Wednesday', value:4, selected: false},
                            {name: 'Thursday', value:5, selected: false},
                            {name: 'Friday', value:6, selected: false},
                            {name: 'Saturday', value:7, selected: false}];

            $scope.screenInput = [
                {name: 1, selected: false},
                {name: 2, selected: false},
                {name: 3, selected: false}];
        }
    };
});