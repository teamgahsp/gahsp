var markerMap, crimeRateHeatMap
var crimeCoords = [], featureLayer;
var boundaryLocation = "ChIJh6O4gzUytokRc2ipdwYZC3g";

function createMap() {

    markerMap = new google.maps.Map(document.getElementById("markerMap"), {
        center: {lat: 39.15, lng: -77.2},
        zoom: 10.25,
        mapId: "838b9a3d29242a9c"
    });

    crimeRateHeatMap = new google.maps.Map(document.getElementById("crimeRateHeatMap"), {
      center: {lat: 39.15, lng: -77.2},
      zoom: 10.25,
      mapId: "838b9a3d29242a9c"
    });
    addBoundary(markerMap);
    createMarkerMap(markerMap);
    createHeatMap(crimeRateHeatMap);
    addBoundary(crimeRateHeatMap);
}

function createMarkerMap(markerMap) {
    var script = document.createElement('script');
    script.src = "data.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    
    //search bar
    input = document.getElementById("pac-input");
    const searchBox = new google.maps.places.SearchBox(input);
    markerMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
    
    markerMap.addListener("bounds_changed", () => {
      searchBox.setBounds(markerMap.getBounds());
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      markerMap.setCenter(places[0].geometry.location);
      markerMap.setZoom(15);
    });

}

function createHeatMap(map) {
    var heatMap = new google.maps.visualization.HeatmapLayer({
      data: crimeCoords
    });
    heatMap.setMap(map);
}

function addBoundary(map) {
    featureLayer = map.getFeatureLayer("ADMINISTRATIVE_AREA_LEVEL_2");
    //region lookup
    const featureStyleOptions = {
      strokeColor: "#810FCB",
      strokeOpacity: 1.0,
      strokeWeight: 2.0,
      fillColor: "#810FCB",
      fillOpacity: 0.2,
    };
    
    // Apply the style to MoCo's boundaries.
    //@ts-ignore
    featureLayer.style = (options) => {
      if (options.feature.placeId == boundaryLocation) {
        return featureStyleOptions;
      }
    };
}

//display markers
function eqfeed_callback (results) {
    // map.data.addGeoJson(results);

    const infoWindow = new google.maps.InfoWindow();
    for (let i = 0; i < results.features.length; i++) {
        const coords = results.features[i].geometry.coordinates;
        const latLng = new google.maps.LatLng(coords[1], coords[0]);
        crimeCoords.push(latLng);

        const info = results.features[i].properties;

        const marker = new google.maps.Marker({
          position: latLng,
          map: markerMap,
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
