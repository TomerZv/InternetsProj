angular.module('management').directive('managementMenuItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/managementMenu/menuItem.html',
        require: '^managementMenu',
        scope:{
            name: '@'
        },
        link: function (scope, element, attrs, controller) {
            scope.select = function(){
                controller.setSelected(scope.name);
            };

            scope.isSelected = function(){
                return controller.isSelected(scope.name);
            }
        }
    };
});