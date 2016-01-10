function initialize() {

    $.get("/ads").success(function(data) {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(31.40091, 34.994464),
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var map = new google.maps.Map(mapCanvas, mapOptions);

        var i;
        for (i = 0; i < data.length; i++) {
            var item = data[i];
            //var myLatLan = {lat: item.latitude, lan: item.longitude};

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(item.latitude),parseFloat(item.longitude)),
                map: map,
                title: item.title
            });
        }
    });

}