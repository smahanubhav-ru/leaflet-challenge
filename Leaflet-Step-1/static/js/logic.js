var apiKey = "Your API Key";
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data) {
var map = L.map("map", {center: [35, -100], zoom: 4.5});
var mapbox = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18, id: "mapbox.streets", accessToken: apiKey });
mapbox.addTo(map);

function markerRadius(magnitude) {if (magnitude === 0) {return 1;}return magnitude * 5;}
function markerColor(magnitude) {
if (magnitude < 1) {return "#ccff33"}
else if (magnitude < 2) {return "#ffff33"}
else if (magnitude < 3) {return "#ffcc33"}
else if (magnitude < 4) {return "#ff9933"}
else if (magnitude < 5) {return "#ff6633"}
else {return "#ff3333"}
}
function markerStyle(feature) {
return {
color: "#000000", opacity: 1, fillOpacity: 1,
fillColor: markerColor(feature.properties.mag),
radius: markerRadius(feature.properties.mag),
stroke: true, weight: 0.5};
}

L.geoJson(data, {
pointToLayer: function(feature, latlng) {return L.circleMarker(latlng);},
style: markerStyle,
onEachFeature: function(feature, layer) {layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);}
}).addTo(map);

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
var div = L.DomUtil.create("div", "info legend");
var grades = [0, 1, 2, 3, 4, 5];
var colors = ["#98ee00","#d4ee00","#eecc00","#ee9c00","#ea822c","#ea2c2c"];

for (var i = 0; i < grades.length; i++) {
div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
}
return div;
};

legend.addTo(map);
});