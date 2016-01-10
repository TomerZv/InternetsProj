statsModule.controller('statsCtrl', function($scope, $http) {

    $scope.loadGraph = function() {
        loadBarGraph();
        loadPieChart();
    };

});