
var api = "https://cors-anywhere.herokuapp.com/https://www.hikingproject.com/data/get-trails?"
var apiKey = "&key=200864090-764e2e9a9ec41f0f0c20df4a95a39fc6"

var myResponse = JSON.parse(localStorage.getItem ("hikeOption1"))


// var queryTrailURL = api + latLongObj + distance + apiKey
// console.log(queryTrailURL)
var hikeOption1 = document.getElementById("hikeoption1")
var hikeOption2 = document.getElementById("hikeoption2")
var hikeOption3 = document.getElementById("hikeoption3")

var hikeImage1 = document.getElementById("hikeimage1")
var hikeImage2 = document.getElementById("hikeimage2")
var hikeImage3 = document.getElementById("hikeimage3")

if (hikeOption1 !== null) {
    console.log("hello!")
    hikeOption1.textContent = myResponse.trails[0].difficulty
}
if (hikeOption2 !== null) {
    hikeOption2.textContent = myResponse.trails[1].difficulty
}
if (hikeOption3 !== null) {
    hikeOption3.textContent = myResponse.trails[2].difficulty
}
if (hikeImage1 !== null) {
    hikeImage1.textContent = myResponse.trails[0].summary
}
if (hikeImage2 !== null) {
    hikeImage2.textContent = myResponse.trails[1].summary
}
if (hikeImage3 !== null) {
    hikeImage3.textContent = myResponse.trails[2].summary
}

function APICall(){

    var inputDistance = $("#distance").val()
    var latLongObj = JSON.parse(localStorage.getItem("startLatLong"));
    var inputLat = latLongObj.latitude;
    var inputLon = latLongObj.longitude;
    var maxDistance =  "&maxDistance=" + inputDistance
    var hikeLatLong = "lat=" + inputLat + "&" + "lon=" + inputLon
    var queryURL = api + hikeLatLong + maxDistance + apiKey

    console.log(queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log("API call successful heres your data - ", response)
        for(var i=0; i < response.trails.length; i++) {
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
            localStorage.setItem("hikeOption1", JSON.stringify(response));

            var hikeImage1 = document.getElementById("#hikeimage1")
            var hikeImage2 = document.getElementById("#hikeimage2")
            var hikeImage3 = document.getElementById("#hikeimage3")

            // hikeOption1 = response.trails[0].difficulty
            // hikeOption2 = response.trails[1].difficulty
            // hikeOption3 = response.trails[2].difficulty

            hikeImage1= response.trails[0].summary
            hikeImage2 = response.trails[1].summary
            hikeImage3 = response.trails[2].summary

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

