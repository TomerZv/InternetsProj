angular.module('management').factory('adsService', function ($http) {

    var adsService = {};

    // Create
    adsService.insert = function (ad) {
        return $http.post('/ads/', ad);
    };

    // Read
    adsService.get = function (id) {
        return $http.get('/ads/' + id);
    };

    adsService.getAll = function () {
        return $http.get('/ads/');
    };

    // Update
    adsService.update = function (ad) {
        return $http.put('/ads/', ad);
    };

    // Delete
    adsService.delete = function (id) {
        return $http.delete('/ads/' + id);
    };

    return adsService;
});