var app = angular.module('adsApp', ['ngRoute', 'display', 'management', 'stats']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.otherwise('/management');
}])

app.controller('appCtrl', function($scope, $location,$timeout) {
    $scope.whereami= function () {
        return $location.path();
    }
    
    $scope.isMouseOnNav = false;
    
    var mouseMovedTimeout;
    $scope.onMouseMove = function($event) { 
        $scope.hideNavbar = false;
        if (mouseMovedTimeout) {
            $timeout.cancel(mouseMovedTimeout);
        }
              
        mouseMovedTimeout = $timeout(function() {
            if (!$scope.isMouseOnNav) {
                $scope.hideNavbar = true;
            }
        }, 4000);
    }
});