angular.module('management', ['ngRoute', 'checklist-model', 'bootstrap.fileField', 'ui.bootstrap']);

angular.module('management').controller('mainCtrl', function($scope){
  $scope.selectedTab = "Manage Ads";

  $scope.isTabSelected = function(tabName){
    return $scope.selectedTab === tabName;
  };

  $scope.filters = {};
});

angular.module('management').filter('adFilter', function() {
  return function(ads, filter) {

    var removeElementFromArray = function(array, element){
      var index = array.indexOf(element);

      if (index > -1){
        array.splice(index, 1);
      }
    }
    var doesArrayContainsElement = function(array, element){
      return (array.indexOf(element) > -1);
    }

    var filteredAds = ads.clone();

    // Check wether a filter is needed
    if ((filter.days.length != 0) || (filter.screenIds.length != 0) || (filter.text)){
      angular.forEach(ads, function(ad){
        var isFound = true;

        if (filter.days.length != 0){
          isFound = false;
          var array = [];

          // Changes array
          for (var index = 0; index < filter.days.length; index++){
            array.push(filter.days[index].value);
          }

          // Filter by days
          angular.forEach(ad.timeFrames, function(frame){
            angular.forEach(frame.days, function(day){
              if (doesArrayContainsElement(array, day)){
                isFound = true;
              }
            })
          });
        }

        if ((isFound) && (filter.screenIds.length != 0)){
          isFound = false;
          var array = [];

          // Changes array
          for (var index = 0; index < filter.screenIds.length; index++){
            array.push(filter.screenIds[index].name);
          }

          // Filter by screens
          angular.forEach(ad.screenIds, function(id){
            if (doesArrayContainsElement(array, id)){
              isFound = true;
            }
          });
        }

        if ((isFound) && (filter.text)){
          var filterText = filter.text.toLowerCase();
          isFound = ad.title.toLowerCase().indexOf(filterText) > -1;

          if (!isFound){
            angular.forEach(ad.textLines, function(line){
              if (line.toLowerCase().indexOf(filterText) > -1){
                isFound = true;
              }
            })
          }
        }

        if (!isFound){
          removeElementFromArray(filteredAds, ad);
        }
      });
    }

    return filteredAds;
  };
});

angular.module('management').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/management', {
      templateUrl: '/Client/views/management.html',
      //controller: 'manageAdsCtrl'
      controller: 'mainCtrl'
    }).
    when('/editAd/:adId?', {
      templateUrl: '/Client/modules/management/editAd.html',
      controller: 'editAdCtrl'
    });
  }]);