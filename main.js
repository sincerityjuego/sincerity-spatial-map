// Initialize map
var map = L.map('map').setView([14.3294, 121.0839], 12); // Biñan, Laguna

// Base map layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
);
var terrain = L.tileLayer(
  'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg'
);

street.addTo(map);

L.control.layers({
    "Street": street,
    "Satellite": satellite,
    "Terrain": terrain
}).addTo(map);

// Fake sensor + AI generator
function analyzeLocation(lat, lng) {
    var motion = Math.random() > 0.5 ? "ACTIVE" : "STABLE";
    var flood = Math.random() * 100;
    var quake = Math.random() * 100;
    var landslide = Math.random() * 100;

    var risk = (flood + quake + landslide) / 3;

    return {
        motion,
        flood,
        quake,
        landslide,
        risk
    };
}

// Click event
map.on("click", function(e) {
    var data = analyzeLocation(e.latlng.lat, e.latlng.lng);

    var riskLevel =
        data.risk > 70 ? "HIGH" :
        data.risk > 40 ? "MEDIUM" : "LOW";

    document.getElementById("info").innerHTML = `
        <b>Coordinates:</b> ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}<br><br>

        <b>Motion Status:</b> ${data.motion}<br><br>

        <b>Flood Risk:</b> ${data.flood.toFixed(1)}%<br>
        <b>Earthquake Risk:</b> ${data.quake.toFixed(1)}%<br>
        <b>Landslide Risk:</b> ${data.landslide.toFixed(1)}%<br><br>

        <b>Overall Risk:</b>
        <span class="risk-${riskLevel === "HIGH" ? "high" : riskLevel === "MEDIUM" ? "mid" : "low"}">
            ${riskLevel}
        </span>
    `;

    var color = riskLevel === "HIGH" ? "red" : riskLevel === "MEDIUM" ? "orange" : "green";

    L.circle(e.latlng, {
        radius: 300,
        color: color,
        fillOpacity: 0.3
    }).addTo(map);
});
