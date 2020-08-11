
var api = "https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/get-trails?"
var apiKey = "&key=200864090-764e2e9a9ec41f0f0c20df4a95a39fc6"


// var queryTrailURL = api + latLongObj + distance + apiKey
// console.log(queryTrailURL)


function APICall(){

var inputDistance = $("#distance").val()
var inputLat = 40.0274 
var inputLon = -105.2519
var maxDistance =  "&maxDistance=" + inputDistance
var hikeLatLong = "lat=" + inputLat + "&" + "lon=" + inputLon
var queryURL = api + hikeLatLong + maxDistance + apiKey

var hikeOption1 = document.getElementById("#hikeoption1")
var hikeOption2 = document.getElementById("#hikeoption2")
var hikeOption3 = document.getElementById("#hikeoption3")
var hikeImage1 = document.getElementById("#hikeoption1")
var hikeImage2 = document.getElementById("#hikeoption2")
var hikeImage3 = document.getElementById("#hikeoption3")

hikeOption1 = response.trails[0].difficulty
hikeOption2 = response.trails[1].difficulty
hikeOption3 = response.trails[2].difficulty

hikeImage1= response.trails[0].url
hikeImage2 = response.trails[1].url
hikeImage3 = response.trails[2].url


console.log(queryURL)
$.ajax({
	url: queryURL,
	method: "GET"
}).then(function(response) {
console.log("API call successful heres your data - ", response)
for(var i=0; i < response.trails.length; i++){
    var trail = response.trails[i];
	console.log(response.trail);
//do DOM manipulation here and put on page...
//do work here...
$("#difficulty").val(length);
$("#hikeDistance").val(length);
$("#hikeMap").val(URL);
// inputLat = response.trails[0].latitude
// inputLat = response.trails[1].latitude
// inputLat = response.trails[2].latitude
// inputLat = response.trails[0].longitude
// inputLat = response.trails[1].longitude
// inputLat = response.trails[2].longitude
// var latLongObj1 = {
//     inputLat1, inputLat2, inputLat3,
//     inputLong1, inputLong2, inputLong3,
var latitude = response.trails[0].latitude
var longitude = response.trails[0].longitude
var latLongObj1 = {
    latitude, longitude
}
latitude = response.trails[1].latitude
longitude = response.trails[1].longitude
var latLongObj2 = {
    latitude, longitude
    }
 latitude = response.trails[2].latitude
 longitude = response.trails[2].longitude
var latLongObj3 = {
    latitude, longitude
    }
}
    localStorage.setItem("hikeLocation1", JSON.stringify(latLongObj1));
    localStorage.setItem("hikeLocation2", JSON.stringify(latLongObj2));
    localStorage.setItem("hikeLocation3", JSON.stringify(latLongObj3));

location.href="TrekHikeResult.html";


}).catch(function(err){
	console.log("err - "+err)
})

}

$("#submitHike").on("click", function(){
	APICall()
})

