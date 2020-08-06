var address;
var zip;
var city;
var state;

var geocode;
var queryURL;
var exampleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyB_ShRmKvw0k00jVd4WofFQVbEtdjV4T0c";

// Get previously entered address from local storage
var storedAddress = localStorage.getItem("address");
if (storedAddress === null) {
    console.log("null")
    storedAddress = {
        address: "",
        zip: "",
        city: "",
        state: ""
    }
}
else {
    storedAddress = JSON.parse(storedAddress);
}
address = storedAddress.address;
zip = storedAddress.zip;
city = storedAddress.city;
state = storedAddress.state;

// Enter stored address into text fields
$("#address").val(address);
$("#zip").val(zip);
$("#city").val(city);
$("#state").val(state);

// Upon button click, store new address. Set query url to the address. Make the ajax call for that address.
$("#start-btn").on("click", function(event) {
    event.preventDefault()
    address = $("#address").val();
    zip = $("#zip").val();
    city = $("#city").val();
    state = $("#state").val();
    console.log(address, zip, city, state);
    localStorage.setItem("address", JSON.stringify({address, zip, city, state}));
    // this also works without the zip field
    queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=AIzaSyB_ShRmKvw0k00jVd4WofFQVbEtdjV4T0c";
    makeCall();
});    


function makeCall() {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log("latitude is " + response.results[0].geometry.location.lat)
        console.log("longitude is " + response.results[0].geometry.location.lng)
    });
}



// get end location address from storage
var storedEndAddress = localStorage.getItem("storedEndAddress");
if (storedEndAddress === null) {
    storedEndAddress= {
        address: "",
        zip: "",
        city: "",
        state: ""
    }
}
else {
    storedEndAddress = JSON.parse(storedEndAddress);
}
endAddress = storedEndAddress.address;
endZip = storedEndAddress.zip;
endCity = storedEndAddress.city;
endState = storedEndAddress.state;

// Button for end location address. Set query url to the address. Make the ajax call for that address.
$("#end-btn").on("click", function(event) {
    event.preventDefault()
    address = $("#end-address").val();
    zip = $("#end-zip").val();
    city = $("#end-city").val();
    state = $("#end-state").val();
    console.log(address, zip, city, state);
    localStorage.setItem("address", JSON.stringify({address, zip, city, state}));
    // this also works without the zip field
    queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=AIzaSyB_ShRmKvw0k00jVd4WofFQVbEtdjV4T0c";
    makeCall();
});    