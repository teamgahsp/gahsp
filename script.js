var map;

function createMap() {
    var options = {
        center: {lat: 39.1547, lng: -77.2405},
        zoom: 5
    };

    map = new google.maps.Map(document.getElementById("map"), options);

    var script = document.createElement('script');
    script.src = "./data.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

function eqfeed_callback (geojson) {
    map.data.addGeoJson(geojson);
}

window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;
