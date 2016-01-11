displayModule.controller('displayAdsCtrl', function($scope, $location, $routeParams, socket, $http) {
    var ads = [];
    
    socket.on('connect', function (data) {
        socket.emit('register:screen', { screenId: $routeParams.screenId });
    });

    socket.on('ad:added', function (data) {
        console.log(data);
        if (data.screenIds && data.screenIds.indexOf(parseInt($routeParams.screenId)) > -1) {
            // Add only ads relevant to this specific screen
            ads.push(data);
        }
    });
    
    socket.on('ad:updated', function (data) {
        console.log(data);
        // Find the updated ad in the screen's ads
        var adToUpdate = findAd(data._id); 
        // Find out if the updated ad need to be displayed on this screen
        var displayOnThisScreen = data.screenIds.indexOf(parseInt($routeParams.screenId)) > -1;
        
        if (displayOnThisScreen && adToUpdate != -1) {
             ads[adToUpdate] = data; // Perform an update of an existing ad
        } else if (adToUpdate != -1) {
            ads.splice(adToUpdate, 1); // Remove from screen's ads
        } else if (displayOnThisScreen) {
            ads.push(data); // Add to screen's ads
        }
    });
    
    var findAd = function(id) {
        for (var i = 0, len = ads.length; i < len; i++) {
            if (ads[i]._id === id)
                return i; // Return as soon as the object is found
        }
        return -1; // The object was not found
    }
    
    function scheduleAds() {
        var duration = displayAds();
        setTimeout(scheduleAds, duration * 1000);
    }

    $scope.loadAds = function() {
        $http.get("/screen/" + $routeParams.screenId).success(function(data) {
          ads = data;
          scheduleAds();
        });
    }

    function displayAds() {
        var chosenAd;

        $.each(ads, function(index, ad) {
            if (isInTimeFrame(ad.timeFrames)) {
                
                $( "#result" ).load('./client/views/Templates/' + ad.templateId + '.html', function() {
                    
                    $( "#title" ).html(ad.title);
                    $( "#location" ).html('(' + ad.location + ')');

                    if (ad.textLines) {
                        $.each(ad.textLines, function (lineIndex, line) {
                            $("#line" + (lineIndex + 1)).html(line);
                        });
                    }

                    if (ad.images) {
                        $.each(ad.images, function (imgIndex, img) {
                            $("#image" + (imgIndex + 1)).attr("src", img);
                        });
                    }

                    if (ad.videos) {
                        $.each(ad.videos, function (videoIndex, video) {
                            $("#video" + (videoIndex + 1)).attr("src", video);
                        });
                    }

                    var a = 5;

                    var url = 'http://api.openweathermap.org/data/2.5/find?q=' + ad.location + '&units=metric&appid=2de143494c0b295cca9337e1e96b00e0';
                    $.get(url, function(data, status){
                        $("#temperature").html(Math.round(data.list[0].main.temp));
                    });

                });

                chosenAd = ad;
                
                var stat = { screenId: $routeParams.screenId, duration : chosenAd.duration,
                                        shownAt : new Date(), adId : chosenAd._id, adTitle : chosenAd.title };
                console.log(stat);
                socket.emit('ad:shown', stat);
                
                // Move the chosen ad to the end of the ads array.
                // Prevents showing the same ad twice in a row
                ads.push(ads.splice(index, 1)[0]);
                return false;
            }
        });
        
        if (chosenAd) {
            return (chosenAd.duration);
        } else {
            $( "#result" ).html('<div style="text-align:center;">No ads to display :)</div>');
            return 10; // Try to load ads again in 10 seconds
        }
    }

    function isInTimeFrame(timeFrames) {
        var isIn = false;
        var today = new Date();
        $.each(timeFrames, function(index, frame) {
            var from = new Date();
            from.setHours(parseInt(frame.from.substr(0,2)), parseInt(frame.from.substr(3,5)), 0, 0);
            var to = new Date();
            to.setHours(parseInt(frame.to.substr(0,2)), parseInt(frame.to.substr(3,5)), 0, 0);
            if (today >= new Date(frame.startDate) &&
                today <= new Date(frame.endDate) &&
                today.getTime() > from.getTime() &&
                today.getTime() < to.getTime() &&
                frame.days.indexOf(today.getDay() + 1) > -1) {
                    isIn = true;
            }
        });

        return isIn;
    }
});