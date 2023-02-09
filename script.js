var map;

function createMap() {
    var options = {
        center: {lat: 39.1547, lng: -77.2405},
        zoom: 10
    };

    map = new google.maps.Map(document.getElementById("map"), options);

    var script = document.createElement('script');
    script.src = "data.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    
    //search bar
    input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      map.setCenter(places[0].geometry.location);
      map.setZoom(15);
      // const bounds = new google.maps.LatLngBounds();

      // places.forEach((place) => {
      //   if (!place.geometry || !place.geometry.location) {
      //     console.log("Returned place contains no geometry");
      //     return;
      //   }

      //   if (place.geometry.viewport) {
      //     // Only geocodes have viewport.
      //     bounds.union(place.geometry.viewport);
      //   } else {
      //     bounds.extend(place.geometry.location);
      //   }
      // });
      // map.fitBounds(bounds);
    });

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
          infoWindow.setContent("<p><b>Date occurred: </b>" + info.start_date + "</p>" +
                                "<p><b>Time occurred: </b>" + info.start_time + "</p>" + 
                                "<p><b>Crime type: </b>" + info.crimename2 + "</p>" + 
                                "<p><b>Location type: </b>" + info.place + "</p>");
          infoWindow.open(marker.map, marker);
        })
    }
}

window.createMap = createMap;
//window.eqfeed_callback = eqfeed_callback;
