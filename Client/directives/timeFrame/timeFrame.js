angular.module('management').directive('timeFrame', function() {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/timeFrame/timeFrame.html',
        scope: {
            ad: '=',
            frame: '=',
            deleteFrameFunction: '&',
            index: '@'
        },
        controller: function($scope){
            $scope.daysInput =
                [{name: 'Sunday', value:1, selected: false},
                 {name: 'Monday', value:2, selected: false},
                 {name: 'Tuesday', value:3, selected: false},
                 {name: 'Wednesday', value:4, selected: false},
                 {name: 'Thursday', value:5, selected: false},
                 {name: 'Friday', value:6, selected: false},
                 {name: 'Saturday', value:7, selected: false}];

            for (var index = 0; index < $scope.frame.days.length; index++){
                $scope.daysInput[$scope.frame.days[index] - 1].selected = true;
            }

            $scope.isDateValid = function(date) {
                return (Object.prototype.toString.call(date) === "[object Date]") && (!isNaN(date.getTime()));
            };
        }
    };
});