var map;

function createMap() {
    var options = {
        center: {lat: 39.1547, lng: -77.2405},
        zoom: 12
    };

    map = new google.maps.Map(document.getElementById("map"), options);

    var script = document.createElement('script');
    script.src = "data.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    //search bar

}

//display markers
function eqfeed_callback (results) {
    // map.data.addGeoJson(results);
    const infoWindow = new google.maps.InfoWindow();
    for (let i = 0; i < results.features.length; i++) {
        const coords = results.features[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[1], coords[0]);
        const info = results.features[i].properties;

        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: 'Crime type: ' + info.crimename2 + '\n' + info.crimename3
        });

        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent("<p>" + info.crimename2 + "</p>" + 
                                "<p>" + info.crimename3 + "</p>");
          infoWindow.open(marker.map, marker);
        })
    }
}

window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;
