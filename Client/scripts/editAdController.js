angular.module('management').controller('editAdCtrl', function($scope, $location, adsService, $window, $routeParams) {
    $scope.screens = [1,2,3];
    $scope.ad = {   templateId: 1,
                    textLines: {},
                    images: [],
                    videos: [],
                    timeFrames: [{days: []}] };
    $scope.cities = ['Ashkelon','Tel Aviv','Jerusalem','Haifa','Eilat'];
    $scope.selectedCity;
    $scope.latitude;
    $scope.longtitdue;
    $scope.selectedTab = "New Ad";
    $scope.pageTitle = "New Ad";

    $scope.initialize = function() {
        // Edit ad
        if ($routeParams.adId) {
            $scope.selectedTab = "Manage Ads";
            adsService.get($routeParams.adId).then(function(results) {
                $scope.ad = results.data[0];
                $scope.pageTitle = "Edit Ad: " + $scope.ad.title;
                $scope.ad.timeFrames.forEach(function(timeFrame) {
                    initializeFrame(timeFrame);
                });
            });
        }
     };
    
    var initializeFrame = function(frame) {
        frame.modelStartDate =  new Date(frame.startDate);
        frame.modelEndDate =  new Date(frame.endDate);
        frame.modelFrom = new Date();
        frame.modelFrom.setHours(parseInt(frame.from.substr(0,2)), parseInt(frame.from.substr(3,5)), 0, 0);
        frame.modelTo = new Date();
        frame.modelTo.setHours(parseInt(frame.to.substr(0,2)), parseInt(frame.to.substr(3,5)), 0, 0);
    };

    var reinitializeFrame = function(timeFrame) {
        timeFrame.startDate =  dateToString(timeFrame.modelStartDate);
        timeFrame.endDate =  dateToString(timeFrame.modelEndDate);
        timeFrame.from = hourToString(timeFrame.modelFrom);
        timeFrame.to = hourToString(timeFrame.modelTo);

        timeFrame.days = [];
        for (var index = 0; index < timeFrame.outputDays.length; index++){
            timeFrame.days.push(timeFrame.outputDays[index].value);
        }
    };
    
    var dateToString = function (date){
        var string = (date) ? date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() : "";
        return string;
    };

    var hourToString = function (date){
        var hour = date.getHours().toString();
        hour = hour.length === 1 ? "0" + hour : hour;
        var mins = date.getMinutes().toString();
        mins = mins.length === 1 ? "0" + mins : mins;

        return hour + ":" + mins;
    };

    $scope.addTimeFrame = function() {
        $scope.ad.timeFrames.push({days:[]});
    };

    $scope.validateTimeFrames = function() {
        var isValid = true;

        for (var index = 0; ((index < $scope.ad.timeFrames.length) && (isValid)); index++){
            isValid = $scope.validateTimeFrame($scope.ad.timeFrames[index]);
        }

        return isValid;
    };

    $scope.validateTimeFrame = function(frame){
        return  ((frame.outputDays) &&
                 (frame.outputDays.length != 0) &&
                 (frame.modelEndDate > frame.modelStartDate) &&
                 (frame.modelTo > frame.modelFrom))
    };
    
    $scope.save = function() {
        // No errors on the form, all the ad aspects are initialized and no dates problems.
        if ($scope.adForm.$valid &&
            $scope.ad.screenIds && $scope.ad.screenIds.length != 0 &&
            $scope.validateTimeFrames()) {

            $scope.ad.timeFrames.forEach(function (timeFrame) {
                reinitializeFrame(timeFrame);
            });

            for (var imageIndex = 0; imageIndex < $scope.ad.images.length; imageIndex++) {
                var image = $scope.ad.images[imageIndex];
                $scope.ad.images[imageIndex] = (image.name) ? './images/' + image.name : image;
            }

            if ($scope.ad._id) {
                adsService.update($scope.ad);
            } else {
                adsService.insert($scope.ad);
            }

            $location.path("/management");
        }
        else{
            alert('Errors were found while submitting, please check the fields marked with asterisks.')
        }
    }

    $scope.screenWasChanged = function()
    {
        $scope.screenChanged = true;
    };

    $scope.deleteFrame = function (index){
        $scope.ad.timeFrames.splice(index,1);
    };
});