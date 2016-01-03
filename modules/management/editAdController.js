managementModule.controller('timeFrameCtrl', function($scope) {
        
    $scope.$watch('timeFrame.endDate', function (value) {
         
         $scope.timeFrame.validateAfterDates = false;
         
         if ($scope.timeFrame.endDate < $scope.timeFrame.startDate){
             $scope.timeFrame.validateAfterDates = true;
         }
     });
    
     $scope.$watch('timeFrame.startDate', function (value) {
         
         $scope.timeFrame.validateAfterDates = false;
         
         if ($scope.timeFrame.endDate < $scope.timeFrame.startDate){
             $scope.timeFrame.validateAfterDates = true;
         }
     });
    
     $scope.$watch('timeFrame.from', function (value) {
         
         $scope.timeFrame.validateAfterTime = false;
         
         if ($scope.timeFrame.to < $scope.timeFrame.from){
             $scope.timeFrame.validateAfterTime = true;
         }
     });
    
    $scope.$watch('timeFrame.to', function (value) {
         
         $scope.timeFrame.validateAfterTime = false;
         
         if ($scope.timeFrame.to < $scope.timeFrame.from){
             $scope.timeFrame.validateAfterTime = true;
         }
     }); 
});

managementModule.controller('editAdCtrl', function($scope, $location, adsService, $window, $routeParams) {
    $scope.templates = [];
    $scope.screens = [];
    $scope.images = [];
    
    $scope.init = function() {
        $scope.templates = [{name: "templateA", textRows: 4, images: 2, videos : 0},
                            {name: "templateB", textRows: 7, images: 2, videos : 0},
                            {name: "templateC", textRows: 0, images: 0, videos : 1}];
         
        $scope.screens = [1,2,3];
         
        var adId = $routeParams.adId;
         
        // Check if for edit
        if (adId) {
            
            adsService.getAd(adId).then(function(results) {
                
                  $scope.newAd = results.data[0];

                  // Init template
                  if ($scope.newAd.templateUrl == './templateA.html'){
                      $scope.selectedTemplae = 1;
                  } else if ($scope.newAd.templateUrl == './templateB.html'){
                       $scope.selectedTemplae = 2;
                  } else if ($scope.newAd.templateUrl == './templateC.html'){
                       $scope.selectedTemplae = 3;
                  }
                  
                
                  $scope.newAd.timeFrames.forEach(function(timeFrame) {
                        timeFrame = initTimeFrame(timeFrame);
                  });
                
                   // Init images
                   for(var imageIndex=0;
                           imageIndex< $scope.newAd.images.length; imageIndex++) {
                       $scope.images.push($scope.newAd.images[imageIndex]);
                    }

            });
        // new Ad
        } else 
        {
            $scope.selectedTemplae = 1;
            $scope.newAd = {};
            $scope.newAd.textLines = [];
            $scope.newAd.videos = [];
            $scope.newAd.timeFrames = [];
            $scope.newAd.timeFrames[0] = {};
            $scope.newAd.timeFrames[0].days=[];
            $scope.initTemplate(1);
        }
     };
    
    var initTimeFrame = function(timeFrame) {
          // Init Dates
          timeFrame.startDate =  new Date(timeFrame.startDate);
          timeFrame.endDate =  new Date(timeFrame.endDate);

          // Init Time
          var fromTime = setTimeFormat24(timeFrame.from);
          timeFrame.from = new Date(1970 , 0 , 1, parseInt
           (fromTime.substr(0.2)), parseInt(fromTime.substr(3.4)), 0);

          var toTime = setTimeFormat24(timeFrame.to);
          timeFrame.to =  new Date(1970 , 0 , 1, parseInt
           (toTime.substr(0.2)), parseInt(toTime.substr(3.4)), 0);
        
         return timeFrame;
    };
    
    $scope.initTemplate = function(number) {
        $scope.selectedTemplae = number;
        
        var strTemplate =  "./templateA.html";
        if (number == 1){
            strTemplate =  "./templateA.html";
        } else if (number == 2){
            strTemplate =  "./templateB.html";
        } else if (number == 3){
             strTemplate =  "./templateC.html";
        }
        
        $scope.newAd.templateUrl = strTemplate;
        
    };
    
    $scope.getNumberRows = function() {
        return new Array($scope.templates[$scope.selectedTemplae - 1].textRows);   
    };   
    
    $scope.getNumberImages = function() {
        return new Array($scope.templates[$scope.selectedTemplae - 1].images);   
    }; 
    
    $scope.getNumberVideos = function() {
        return new Array($scope.templates[$scope.selectedTemplae - 1].videos);   
    }; 
    
    var setDateFormat = function (date){
        
        var newDate = null;
        
        if (date != null){
        var tempStartDate = date; 
        var curr_start_year = tempStartDate.getFullYear();
        var curr_start_month = tempStartDate.getMonth() + 1; //Months are zero based
        var curr_start_day = tempStartDate.getDate();

        var newDate = curr_start_month + "/" + 
            curr_start_day + "/" + curr_start_year; 
        }

        return newDate;
    }
    
    var setTimeFormat = function (time){
        
        var newTime = null;
        
        if (time != null){
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            newTime = hours + ':' + minutes + ' ' + ampm;
        }

        return newTime;
    }
    
     var setTimeFormat24 = function (time){
        
        var hours = parseInt(time.substr(0, 2));
        if(time.indexOf('AM') != -1 && hours == 12) {
            time = time.replace('12', '0');
        }
        if(time.indexOf('PM')  != -1 && hours < 12) {
            time = time.replace(hours, (hours + 12));
        }
        return time.replace(/( AM| PM)/, '');
     }

    
    $scope.addTimeFrame = function() {
        var timeFrame = {};
        timeFrame.days = [];
        timeFrame.validateAfterDates = false;
        timeFrame.validateAfterTime = false;
        $scope.newAd.timeFrames.push(timeFrame);
    };
    
    var prepareTimeFrameForSave = function(timeFrame) {
        // Delete validate after time and dates temp variables
        delete timeFrame.validateAfterDates;
        delete timeFrame.validateAfterTime;
        
        // Date Format    
        timeFrame.startDate =  setDateFormat(timeFrame.startDate);
        timeFrame.endDate =  setDateFormat(timeFrame.endDate);
        
        // Time Format  
        timeFrame.from = setTimeFormat(timeFrame.from);
        timeFrame.to = setTimeFormat(timeFrame.to);
    };
    
    $scope.save = function() {
        if (!$scope.createOrEditAd.$valid ||
           !$scope.newAd.screenIds || $scope.newAd.screenIds.length == 0 ||
           !$scope.newAd.timeFrames[0].days || $scope.newAd.timeFrames[0].days.length == 0 ||
           $scope.validateAfterDates || $scope.validateAfterTime) {
            return;
        }
        
        $scope.newAd.timeFrames.forEach(function(timeFrame) {
            timeFrame = prepareTimeFrameForSave(timeFrame);
        });

        // Images Format
        $scope.newAd.images = [];
        for(var imageIndex=0; imageIndex< $scope.images.length; imageIndex++) {
            if ($scope.images[imageIndex].name) { // New image
                $scope.newAd.images.push('./images/' + $scope.images[imageIndex].name);
            } else { // Existing image, no update is needed
                $scope.newAd.images.push($scope.images[imageIndex]);
            }
        }     
        
        if ($scope.newAd._id){
             adsService.updateAd($scope.newAd);
        } else {
             adsService.insertAd($scope.newAd);
        }
        
        $location.path("/management");
     }
});