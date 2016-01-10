angular.module('management').directive('managementMenuItem', ['$location', function($location) {
    return {
        restrict: 'E',
        templateUrl: '/Client/directives/managementMenu/menuItem.html',
        require: '^managementMenu',
        scope:{
            name: '@',
            link: '@'
        },
        link: function (scope, element, attrs, controller) {
            scope.select = function(){
                controller.setSelected(scope.name);
                $location.path(scope.link);
            };

            scope.isSelected = function(){
                return controller.isSelected(scope.name);
            }
        }
    };
}]);