API_KEY="pk.eyJ1IjoidG9yYXVkOTYiLCJhIjoiY2s4Z2ptMzlsMDJhaTNvcnlwb3RxeDB3NCJ9.sD0jutz0gAEnpMbpbvD9YA"
// Creating map object
var myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 4
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  
  var baseUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(baseUrl, function(data) {
  
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "red";
      case magnitude > 4:
        return "orange";
      case magnitude > 3:
        return "yellow";
      case magnitude > 2:
        return "green";
      case magnitude > 1:
        return "blue";
      default:
        return "purple";
    }
  }
  
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  
  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);
  
  var legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    magnitude = [0, 1, 2, 3, 4, 5]
    colors = ["red", "orange", "yellow", "green", "blue", "purple"]
    for (var i = 0; i < magnitude.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
    }
    return div;
  }
  legend.addTo(myMap);
  })