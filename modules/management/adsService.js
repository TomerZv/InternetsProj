angular.module('management').factory('adsService', function ($http) {

    var adsService = {};
    
    adsService.getAds = function () {
        return $http.get('/ads/');
    };
    
    adsService.searchAds = function (days, screens, duration) {
        var query = '/ads/?days=' + days.join() + '&screenId=' + screens.join() + '&duration=' + duration;
        return $http.get(query);
    };
    
    adsService.insertAd = function (ad) {
        return $http.post('/ads/', ad);
    };
    
    adsService.updateAd = function (ad) {
        return $http.put('/ads/', ad);
    };
    
    adsService.deleteAd = function (id) {
        return $http.delete('/ads/' + id);
    };

    adsService.getAd = function (id) {
        return $http.get('/ads/' + id);
    };

    return adsService;
});