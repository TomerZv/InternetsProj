angular.module('management').directive('managementMenu', function() {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/managementMenu/menu.html',
        scope:{
            selected: '='
        },
        controller: function($scope){
            this.setSelected = function(menuItem){
                $scope.selected = menuItem;
            };

            this.isSelected = function(menuItem){
                return $scope.selected == menuItem;
            };
        }
    };
});