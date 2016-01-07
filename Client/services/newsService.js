displayModule.factory('newsService', function ($http) {

    var newsService = {};
    
    var news = [];
    
    var loadTopNews = function(callback) {        
        $http.jsonp('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=http%3A%2F%2Fnews.google.com%2Fnews%3Foutput%3Drss&callback=JSON_CALLBACK').
        success(function(data) {   
            var topNews = [];
            data.responseData.feed.entries.forEach(function(entry) {
                topNews.push({ title : entry.title });
            });
            
            news = topNews;
            callback();
        });
    }
    
    
    newsService.getTopNews = function (callback) {
        loadTopNews(function() {
            callback(news);
        });
    };
    
    return newsService;
});



