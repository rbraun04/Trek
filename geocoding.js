var address;
var zip;
var city;
var state;
var queryURL;
var exampleURL = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyB_ShRmKvw0k00jVd4WofFQVbEtdjV4T0c";
var startLatLong; // latitude and longitude calculated upon submittal of address
var endLatLong;   // put into local storage? 
var startAddress = true;

const APIKEY = "AIzaSyC4PdU4Cj3uxCX3ocD5Z_c5b_3lFIM9qL0"; // API KEY GOES HERE. THIS SHOULD NOT BE PUBLISHED ON GITHUB!

/** Main controller function. Gets stored addresses and puts them into input fields.
 * Then adds event listeners to the address submittal buttons. */
function main() {
    getStartAddress();
    getEndAddress();
    getStoredLatLong();
    addLocationButtonEventListeners();
}
$(document).ready(main);



/** Converts an address to latitude/longitude using ajax call to geocoding service */
function makeCall() {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log("latitude is " + response.results[0].geometry.location.lat)
        console.log("longitude is " + response.results[0].geometry.location.lng)
        var latitude = response.results[0].geometry.location.lat;
        var longitude = response.results[0].geometry.location.lng;
        var latLongObj = {
            latitude,
            longitude
        }
        // Return won't be successful because of the promised nature of this function
        // console.log(latLongObj)
        // return latLongObj;

        if (startAddress) {
            startLatLong = latLongObj;
            localStorage.setItem("startLatLong", JSON.stringify(startLatLong));
        }
        else {
            endLatLong = latLongObj;
            localStorage.setItem("endLatLong", JSON.stringify(endLatLong));
        }

        // Problem: cannot set a variable to makeCall(), because of asynchronous nature. Either must use global variables or promises

        // Possible solutions:
        // Can just chain ajax calls together to use values from the previous ajax call
        // const someurl = "jdsfdshgfkjds" + lat + long
        // $.ajax({
        //     url: someurl,
        //     method: "GET"
        // }).then(function(x) {
            
        // })

        // OR DO:
        // makeCall().then(function() {
        //     ;
        // })
        // Need to make sure data from promise exists before using it!
        // if(!data) return console.log("no data exists")
    });
}


/** After both start and end addresses have been submitted, can calculate the distance and travel time between them. */
function getTravelTime(startLatLong, endLatLong) {

    // defaulting to imperial units
    var exampleURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592&key=" + APIKEY;
    
    // // travel mode is driving by default
    // var otherTravelMode = false;
    // var transit = false;
    // var travelMode;
    // var transit_mode;
    // // travel mode can be set to these other options:
    // // mode = transit; transit_mode = bus, subway, train, tram, rail
    // // mode = driving, walking, bicycling

    // // if not driving, get the mode of travel from user input.
    // if (otherTravelMode) {
        //     travelMode = $("#travel-mode").val();
    //     queryURL += "&mode=" + travelMode
    //     if (travelMode === "transit") {
    //         transit = true;
    //         transit_mode = $("#transit-mode").val();
    //         queryURL += "&transit_mode=" + transit_mode;
    //     }
    
    // }
    
    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + startLatLong.latitude + "%2C" + startLatLong.longitude + "&destinations=" + endLatLong.latitude + "%2C" + endLatLong.longitude;
    // add the api key
    queryURL += "&key=" + APIKEY;

    // ajax call returns information such as distance and travel time.
    const DEST = 0;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(response);
        console.log(`destination ${DEST} is ${response.destination_addresses[DEST]}`);
        console.log("distance to " + response.destination_addresses[DEST] + " is " + response.rows[0].elements[DEST].distance.text);
        console.log("number of destinations is " + response.destination_addresses.length);
        console.log("origin address is " + response.origin_addresses[0]);
        console.log(`duration to destination ${DEST} is ${response.rows[0].elements[DEST].duration.text}`);
    });
}


/** Get previously entered start address from local storage */
function getStartAddress() {
    var storedAddress = localStorage.getItem("startAddressObj");
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
}


/** Get end location address from storage */
function getEndAddress() {
    var storedEndAddress = localStorage.getItem("endAddressObj");
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

    $("#end-address").val(endAddress);
    $("#end-zip").val(endZip);
    $("#end-city").val(endCity);
    $("#end-state").val(endState);
}

/** retrieves last entered latitudes and longitudes from storage. These will be null if nothing is in storage. */
function getStoredLatLong() {
    startLatLong = JSON.parse(localStorage.getItem("startLatLong"));
    endLatLong = JSON.parse(localStorage.getItem("endLatLong"));
}


function getDirections(startLatLong, endLatLong) {
    console.log(startLatLong);
    console.log(endLatLong);

    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?units=imperial&origin=" + startLatLong.latitude + "%2C" + startLatLong.longitude + "&destination=" + endLatLong.latitude + "%2C" + endLatLong.longitude;
    // add the api key
    queryURL += "&key=" + APIKEY;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        // Make sure that a valid response is returned
        if (response.status !== "OK") {
            console.log("error - directions not found");
            console.log(response.status);
        }
        else {
            directionsPara = $("#directions");
            var steps_array = response.routes[0].legs[0].steps
            for (let i = 0, j = steps_array.length; i < j; i++) {
                console.log(steps_array[i].html_instructions)
                let newPara = $("<p>");
                newPara.html(steps_array[i].html_instructions);
                directionsPara.append(newPara);
            }
        }
    });
}

function embedMap(startLatLong, endLatLong) {
    console.log(startLatLong);
    console.log(endLatLong);

    // request format: https://www.google.com/maps/embed/v1/MODE?key=YOUR_API_KEY&parameters
    // mode can be place, search, view, direction, or streetview
    var mode = "directions"
    // note: dont' use heroku CORS fixer
    var queryURL = "https://www.google.com/maps/embed/v1/" + mode + "?key=" + APIKEY;
    // add the api key
    queryURL += "&origin="  + startLatLong.latitude + "%2C" + startLatLong.longitude + "&destination=" + endLatLong.latitude + "%2C" + endLatLong.longitude;


    console.log(queryURL)
    $("#rendered-map").attr("src", queryURL);
    // $.ajax({
    //     url:queryURL,
    //     method: "GET"
    // }).then(function(response) {
    //     console.log(response);
    // });
}

/** Stores an address in local storage.
 * @param keyName {string} : the name of the local storage key for the object */
function storeAddress(keyName) {
    address = $("#address").val();
    zip = $("#zip").val();
    city = $("#city").val();
    state = $("#state").val();
    localStorage.setItem(keyName, JSON.stringify({address, zip, city, state}));
}



/** adds event listeners to the address submittal buttons, as well as the get travel time button */
function addLocationButtonEventListeners() {
    // Upon button click, store new address. Set query url to the address. Make the ajax call for that address.


    $("#submitaddress").on("click", function(event) {
        event.preventDefault()
        storeAddress("startAddressObj")
        // this also works without the zip field
        queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=" + APIKEY;
        // have to only set startLatLong once the call is actually returned. Instead of doing this true / false flag
        startAddress = true;
        makeCall();
        location.href="TrekFinalAddress.html";
    });

    // Button for end location address. Set query url to the address. Make the ajax call for that address.
    $("#submitfinaladdress").on("click", function(event) {
        event.preventDefault()
        address = $("#end-address").val();
        zip = $("#end-zip").val();
        city = $("#end-city").val();
        state = $("#end-state").val();
        localStorage.setItem("endAddressObj", JSON.stringify({address, zip, city, state}));
        // this also works without the zip field
        queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=" + APIKEY;
        startAddress = false;
        var lat = makeCall();
        location.href="TrekStartHikeQuestions.html";
        // makeCall().then(function(result) {
        //     endLatLong = latLongObj;
        //     localStorage.setItem("endLatLong", JSON.stringify(endLatLong));
        // });
    });

    // button that returns distance and travel time on click
    $("#travel-time").on("click", function(event) {
        getTravelTime(startLatLong, endLatLong);
    })

    // button that returns directions on click
    $("#get-directions").on("click", function() {
        getDirections(startLatLong, endLatLong);
    });

    // button to embed map
    $("#embed-map").on("click", function() {
        embedMap(startLatLong, endLatLong);
    });
}