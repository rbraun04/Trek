
var api = "https://www.hikingproject.com/data/get-trails?"
var apiKey = "&key=200864090-764e2e9a9ec41f0f0c20df4a95a39fc6"


// var queryTrailURL = api + latLongObj + distance + apiKey
// console.log(queryTrailURL)


function APICall(){

var inputDistance = $("#distance").val()
var inputLat = $("#latitude").val()
var inputLon = $("#longitude").val()
var maxDistance =  "&maxDistance=" + inputDistance
var hikeLatLong = "lat=" + inputLat + "&" + "lon=" + inputLon
var queryURL = api + hikeLatLong + maxDistance + apiKey

console.log(queryURL)
$.ajax({
	url: queryURL,
	method: "GET"
}).then(function(response) {
console.log("API call successful heres your data - ", response)
for(var i=0; i < response.trails.length; i++){
	var trail = response.trails[i];
	console.log(trail);
//do DOM manipulation here and put on page...
//do work here...



}
}).catch(function(err){
	console.log("err - "+err)
})

}

//...
$("#submit").on("click", function(){
	APICall()
})

// function main() {

// }
// $(document).ready(main);

// function  getHikeLatLon() {
// 	hikeLatLong = localStorage.getItem("hikeLatLong")
// }
