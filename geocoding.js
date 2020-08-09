var address;
var zip;
var city;
var state;
var startAddress = true;        // starting address location. Should always be filled out.
var startLatLong;               // latitude and longitude calculated upon submittal of address.
var hikeLatLong;                // hike location, stored in local storage. Not necessarily set.
var goingOnHike = true;         // global variable that needs to be set on the results page.
var restaurantLatLong;          // restaurant location, which is stored in local storage. Not necessarily set.
var goingToRestaurant = true;   // global variable that needs to be set on the results page.
var hikeFirst = true            // Set to false if eating first, then hike. Important for results page.
var endLatLong;                 // final addresss location. Make sure final results page works even if this is null
var directionsListPopulated = false;        // set to true once the ajax call has been made and directions dropdown has been populated

const APIKEY = "AIzaSyC4PdU4Cj3uxCX3ocD5Z_c5b_3lFIM9qL0"; // API KEY GOES HERE. THIS SHOULD BE SECURED!

// MAIN CONTROLLER AND STORAGE FUNCTIONS
//-------------------------------------

/** Main controller function. Gets stored addresses and puts them into input fields.
 * Gets stored coordinates for the hike and restaurant.
 * Gets stored coordinates for start and end addresses.
 * Then adds event listeners to the address submittal buttons. */
function main() {
    // only need to do these for the address pages
    getStartAddress();
    getEndAddress();
    // only get these next 3 for the final page
    getHikeAddress();
    getRestaurantAddress();
    getStoredLatLong();
    // only need certain buttons
    addLocationButtonEventListeners();
    var mapFrame = $("#journeyrendered-map");
    // render the embedded map, but only if the iframe is present
    if (mapFrame !== undefined) {
        embedMap();
    }
}
$(document).ready(main);

/** Get previously entered start address from local storage */
function getStartAddress() {
    var storedAddress = localStorage.getItem("startAddressObj");
    // First check if there is an address in storage.
    if (storedAddress === null) {
        console.log("null")
        storedAddress = {
            address: "",
            zip: "",
            city: "",
            state: ""
        }
    }
    // If an address is in storage, fill out the values.
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

//* Retrieves the address of a hike from storage.
function getHikeAddress() {
    hikeLatLong = JSON.parse(localStorage.getItem("hikeAddress"));
    if (hikeLatLong === null) {
        goingOnHike = false;
    }
}

function getRestaurantAddress() {
    restaurantLatLong = JSON.parse(localStorage.getItem("restaurantAddress"));
    if (restaurantLatLong === null) {
        goingToRestaurant = false;
    }
}

/** retrieves latitudes and longitudes of the start and end addresses from storage. These will be null if nothing is in storage. */
function getStoredLatLong() {
    startLatLong = JSON.parse(localStorage.getItem("startLatLong"));
    endLatLong = JSON.parse(localStorage.getItem("endLatLong"));
}

/** adds event listeners to the address submittal buttons, as well as the get travel time button */
function addLocationButtonEventListeners() {
    // Upon button click, store new address. Set query url to the address. Make the ajax call for that address.
    $("#submitaddress").on("click", function(event) {
        event.preventDefault()
        address = $("#address").val();
        zip = $("#zip").val();
        city = $("#city").val();
        state = $("#state").val();
        localStorage.setItem("startAddressObj", JSON.stringify({address, zip, city, state}));
        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=" + APIKEY;
        // have to only set startLatLong once the call is actually returned. Instead of doing this true / false flag
        startAddress = true;
        makeCall(queryURL);
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
        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=" + APIKEY;
        startAddress = false;
        makeCall(queryURL);
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
        embedMap();
    });
}


// GOOGLE MAPS API FUNCTIONS
// -------------------------

/** Converts an address to latitude/longitude using ajax call to geocoding service.
 * Then stores the latitude/longitude in local storage. */
function makeCall(queryURL) {
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

        if (startAddress) {
            startLatLong = latLongObj;
            localStorage.setItem("startLatLong", JSON.stringify(startLatLong));
        }
        // if final address:
        else {
            endLatLong = latLongObj;
            localStorage.setItem("endLatLong", JSON.stringify(endLatLong));
        }
    });
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


/** Prints out verbal directions from a start to an end point. Directions are appended onto a div with id='directions' */
function getDirections(startLatLong, endLatLong) {
    // this function can only be called once per page:
    if (directionsListPopulated) {
        return;
    }
    directionsListPopulated = true;

    var waypointsArray = populateWaypointsArray();
    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?units=imperial&origin=" + startLatLong.latitude + "%2C" + startLatLong.longitude + "&destination=" + endLatLong.latitude + "%2C" + endLatLong.longitude;
    // add the api key
    queryURL += "&key=" + APIKEY;
    var directionsList;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // Remove loading icon once response is successful.
        $(".spinner-border").attr("style", "display:none");
        // Make sure that a valid response is returned. If not, print an error message.
        if (response.status !== "OK") {
            directionsList = $("#directions");
            let newli = $("<li>");
            newli.attr("class", "list-group-item");
            newli.text("Error - directions cannot be found.");
            directionsList.append(newli);
        }
        // Append response onto $("#directions")
        else {
            directionsList = $("#directions");
            var steps_array = response.routes[0].legs[0].steps
            for (let i = 0, j = steps_array.length; i < j; i++) {
                let newli = $("<li>");
                newli.attr("class", "list-group-item");
                newli.html(steps_array[i].html_instructions);
                directionsList.append(newli);
            }
        }
    });
}

/** Create an empty array to hold all waypoints, and the final destination, in order. Starting address not included. */
function populateWaypointsArray() {
    // Since the only possible waypoints are hiking, restaurant, and a final destination, 
    // use conditional logic to put them in order.
    var waypointsArray = [];
    if (goingOnHike && goingToRestaurant) {
        if (hikeFirst) {
            waypointsArray.push(hikeLatLong);
            waypointsArray.push(restaurantLatLong);
        }
        else {
            waypointsArray.push(restaurantLatLong);
            waypointsArray.push(hikeLatLong);
        }
    }
    else if (goingOnHike) {
        waypointsArray.push(hikeLatLong);
    }
    else if (goingToRestaurant) {
        waypointsArray.push(restaurantLatLong);
    }
    if (endLatLong !== null) {
        waypointsArray.push(endLatLong);
    }
    return waypointsArray;
}


function addWaypointsToQueryURL(queryURL) {
    // First, populate an array with the waypoints in order.
    var waypointsArray = populateWaypointsArray();

    // Then, add each waypoint to the queryURL, in order. Should have at least one waypoint.
    if (waypointsArray.length === 0) {
        console.log("no endpoints set!");
    }
    if (waypointsArray.length > 1) {
        queryURL += "&waypoints=";
    }
    // After each waypoint is added as a parameter, remove it from the array. Finish when there are no waypoints left to add.
    while (waypointsArray.length > 0) {
        if (waypointsArray.length === 1) {
            queryURL += "&destination=" + waypointsArray[0].latitude + "%2C" + waypointsArray[0].longitude;
            waypointsArray.shift();
        }
        if (waypointsArray.length > 1) {
            queryURL += waypointsArray[0].latitude + "%2C" + waypointsArray[0].longitude;
            waypointsArray.shift();
        }
    }
    return queryURL;
}


/** Given starting and ending coordinates, embeds a map of directions in an iframe with id='rendered-map' */
function embedMap() {
    // Notes: dont' use heroku CORS fixer in the queryURL.
    // general request format is: https://www.google.com/maps/embed/v1/MODE?key=YOUR_API_KEY&parameters
    // mode is set to 'directions' here, but can be place, search, view, direction, or streetview
    var mode = "directions";

    // First, put the API key and starting location into the queryURL.
    var queryURL = "https://www.google.com/maps/embed/v1/" + mode + "?key=" + APIKEY;
    queryURL += "&origin=" + startLatLong.latitude + "%2C" + startLatLong.longitude;
    // Next, add the waypoints to the URL.
    queryURL = addWaypointsToQueryURL(queryURL);

    // Finally, embed the map.
    $("#journeyrendered-map").attr("src", queryURL);
}

// TODO:
/* 
order directions list
only call directions service once (and add loading?). also a bug: will keep appending new directions.
only get variables from local storage on results page
check on hike and restaurant waypoints
if no waypoints, then tell user they must select a waypoint (with a modal?)
improve embed map
add photos service
animate directions droplist
add directions waypoints to query url
display travel time somewhere?
organize makeCall()
general organization
*/
