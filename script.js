var markerMap, crimeRateHeatMap, crimeWeightHeatMap, featureLayer;
var crimeCoords = [], weightedCoords = [];
const boundaryLocation = "ChIJh6O4gzUytokRc2ipdwYZC3g", metersInOneMile = 1609.34, defaultRadius = 3, milesInLatLine = 69, milesInLngLine = 55;
var groupAMap, groupBMap, groupACoords = [], groupBCoords = [];

function createMap() {
    options = {
        center: {lat: 39.15, lng: -77.2},
        zoom: 10.5,
        mapId: "838b9a3d29242a9c",
        gestureHandling: "greedy",
    };

    markerMap = new google.maps.Map(document.getElementById("markerMap"), options);
    crimeRateHeatMap = new google.maps.Map(document.getElementById("crimeRateHeatMap"), options);
    crimeWeightHeatMap = new google.maps.Map(document.getElementById("crimeWeightHeatMap"), options);
    groupAMap = new google.maps.Map(document.getElementById("groupAMap"), options);
    groupBMap = new google.maps.Map(document.getElementById("groupBMap"), options);

    addBoundary(markerMap);
    createMarkerMap(markerMap);

    createHeatMap(crimeRateHeatMap, crimeCoords);
    createHeatMap(crimeWeightHeatMap, weightedCoords);
    createHeatMap(groupAMap, groupACoords);
    createHeatMap(groupBMap, groupBCoords);

    addBoundary(crimeRateHeatMap);
    addBoundary(crimeWeightHeatMap);
    addBoundary(groupAMap);
    addBoundary(groupBMap);
}

function createMarkerMap(markerMap) {
    var script = document.createElement('script');
    script.src = "data.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    let prevItems = [];

    //reset center button
    button = document.getElementById("reset-map-button");
    markerMap.controls[google.maps.ControlPosition.TOP_CENTER].push(button);

    button.addEventListener("click", () => {
      prevItems.forEach((item) => {
        item.setMap(null);
      });
      prevItems = [];
      markerMap.setCenter({lat: 39.15, lng: -77.2});
      markerMap.setZoom(10.5);
    });

    // change radius
    markerMap.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById("change-radius"));
    
    //search bar
    input = document.getElementById("search-bar");
    markerMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
    
    const searchBox = new google.maps.places.SearchBox(input);
    markerMap.addListener("bounds_changed", () => {
      searchBox.setBounds(markerMap.getBounds());
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

      prevItems.forEach((item) => {
        item.setMap(null);
      });
      prevItems = [];

      markerMap.setCenter(places[0].geometry.location);

      marker = new google.maps.Marker({
        position: places[0].geometry.location,
        map: markerMap,
        icon: {url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", scaledSize: new google.maps.Size(50, 50)},
        title: places[0].name
      })

      prevItems.push(marker);

      radius = document.getElementById("radius").value;
      radius = (radius >= 0 && radius <= 50) ? radius : defaultRadius;

      circle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: markerMap,
        center: marker.position,
        radius: metersInOneMile * radius,
      });

      prevItems.push(circle);

      bounds = new google.maps.LatLngBounds();
        
      southwest = {lat: marker.position.lat() - radius/milesInLatLine, lng: marker.position.lng() - radius/milesInLngLine};
      northeast = {lat: marker.position.lat() + radius/milesInLatLine, lng: marker.position.lng() + radius/milesInLngLine};
      bounds.extend(southwest);
      bounds.extend(northeast);
      markerMap.fitBounds(bounds);
      
    });

}

function createHeatMap(map, data) {
    var heatMap = new google.maps.visualization.HeatmapLayer({
      data: data
    });
    const options = {
      radius: 10,
      map: map,
      opacity: 0.7
    };
    heatMap.setOptions(options);
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
        weightedCoords.push({location: latLng, weight: info.weight});
        if(info.weight == 1) {
          groupBCoords.push(latLng);
          url = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        } else {
          groupACoords.push(latLng);
          url = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }

        const icon = {
          url: url, // url
          scaledSize: new google.maps.Size(40, 40), // scaled size
      };

        const marker = new google.maps.Marker({
          position: latLng,
          map: markerMap,
          title: 'Crime type: ' + info.NIBRS_CrimeName + '\n' + info.Offense_Name,
          icon: icon
        });

        marker.addListener("click", () => {
          infoWindow.close();
          infoWindow.setContent("<p><b>Date occurred: </b>" + info.start_date + "</p>" +
                                "<p><b>Time occurred: </b>" + info.start_time + "</p>" + 
                                "<p><b>Crime type: </b>" + info.NIBRS_CrimeName + "</p>" + 
                                "<p><b>Location type: </b>" + info.place + "</p>");
          infoWindow.open(marker.map, marker);
        })
    }
}

window.createMap = createMap;
//window.eqfeed_callback = eqfeed_callback;
