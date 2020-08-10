var queryURL = "https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&key=200864090-764e2e9a9ec41f0f0c20df4a95a39fc6"


var api = "https://www.hikingproject.com/data/get-trails?"
var hikeLatLong = "lat=" + inputLat + "&" + "lon=" + inputLon
var maxDistance =  "maxDistance=" + inputDistance
var apiKey = "key=200864090-764e2e9a9ec41f0f0c20df4a95a39fc6"

var inputDistance = $("#distance").val()
var inputLat = $("#latitude").val()
var inputLon = $("#longitude").val()

// var queryTrailURL = api + latLongObj + distance + apiKey
// console.log(queryTrailURL)


$.ajax({
	url: queryURL,
	method: "GET"
}).then(function(response) {
	console.log(response);
	console.log(response.trails[i].summary);
})

function main() {
	getHikeLatitude();
	getHikeLongitude();
	getHikeDistance();
	getHikeMaps();
	addSubmitBtnEventListeners();
}
$(document).ready(main);

function  getHikeLatLon() {
	hikeLatLong = localStorage.getItem("hikeLatLong")
}

function getHikeLatitude() {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    }
    

    }
    
}