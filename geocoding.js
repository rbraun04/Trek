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

    // If on last page:
    if (document.getElementsByTagName("body")[0].getAttribute("class") === "resultspage") {
        getHikeAddress();
        getRestaurantAddress();
        getStoredLatLong();
        console.log("retrieved")
    }

    addLocationButtonEventListeners();

    if (goingOnHike === false && goingToRestaurant === false && endLatLong === null) {
        ;  // should code for this case
    }

    // render the embedded map, but only if the iframe is present
    if (document.getElementById("journeyrendered-map") !== null) {
        embedMap();
    }
}

$(document).ready(main);

/** Get previously entered start address from local storage. Fills out the values of the address form. */
function getStartAddress() {
    var storedAddress = JSON.parse(localStorage.getItem("startAddressObj"));
    // First check if there is an address in storage.
    if (storedAddress === null) {
        storedAddress = {
            address: "",
            zip: "",
            city: "",
            state: ""
        }
    }
    // Set global starting address variables.
    address = storedAddress.address;
    zip = storedAddress.zip;
    city = storedAddress.city;
    state = storedAddress.state;

    // Enter stored address into text fields.
    $("#address").val(address);
    $("#zip").val(zip);
    $("#city").val(city);
    $("#state").val(state);
}

/** Get end location address from storage. Fills out the end address form. */
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
    // Fill out the address form:
    $("#end-address").val(storedEndAddress.address);
    $("#end-zip").val(storedEndAddress.zip);
    $("#end-city").val(storedEndAddress.city);
    $("#end-state").val(storedEndAddress.state);
}

/** Retrieves the address of a hike from storage. */
function getHikeAddress() {
    hikeLatLong = JSON.parse(localStorage.getItem("hikeAddress"));
    if (hikeLatLong === null) {
        goingOnHike = false;
    }
}

/** Retrieves the restaurant address from storage. */
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


/** adds event listeners to the various buttons. TODO: only load certain listeners for particular pages.*/
function addLocationButtonEventListeners() {
    // Upon button click, store new address. Set query url to the address. Make the ajax call for that address.
    $("#submitaddress").on("click", function(event) {
        event.preventDefault()
        address = $("#address").val();
        zip = $("#zip").val();
        city = $("#city").val();
        state = $("#state").val();
        localStorage.setItem("startAddressObj", JSON.stringify({address, zip, city, state}));
        address = removeSpaces(address);
        zip = removeSpaces(zip);
        city = removeSpaces(city);
        state = removeSpaces(state);

        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=" + APIKEY;
        // have to only set startLatLong once the call is actually returned. Instead of doing this true / false flag
        startAddress = true;
        geocodeAddressUrl(queryURL);
    });

    // Button for end location address. Set query url to the address. Make the ajax call for that address.
    $("#submitfinaladdress").on("click", function(event) {
        event.preventDefault()
        address = $("#end-address").val();
        zip = $("#end-zip").val();
        city = $("#end-city").val();
        state = $("#end-state").val();
        localStorage.setItem("endAddressObj", JSON.stringify({address, zip, city, state}));
        address = removeSpaces(address);
        zip = removeSpaces(zip);
        city = removeSpaces(city);
        state = removeSpaces(state);

        var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "," + city + "," + state + "," + zip + "&key=" + APIKEY;
        startAddress = false;
        geocodeAddressUrl(queryURL);
    });

    // If on last page add these even listeners:
    if (document.getElementsByTagName("body")[0].getAttribute("class") === "resultspage") {
        // button that returns distance and travel time on click
        $("#travel-time").on("click", function(event) {
            getTravelTime(startLatLong, endLatLong);
        })

        // button that returns directions on click
        $("#get-directions").on("click", function() {
            getDirections();
        });

        // button to embed map
        $("#embed-map").on("click", function() {
            embedMap();
        });

        // button that gives a satellite photo view
        $("#end-address-photo").on("click", function() {
            satelliteViewEmbed(endLatLong);
        })
    }

    // Hike and restaurant choice event listeners. Hike listeners also bring user to next page.
    $("#hikeselection1").on("click", function() {
        localStorage.setItem("hikechoice", 1);
        location.href="TrekStartYelpQuestions.html";
    });

    $("#hikeselection2").on("click", function() {
        localStorage.setItem("hikechoice", 2);
        location.href="TrekStartYelpQuestions.html";
    });

    $("#hikeselection3").on("click", function() {
        localStorage.setItem("hikechoice", 3);
        location.href="TrekStartYelpQuestions.html";
    });

    $("#restaurantchoice1").on("click", function() {
        localStorage.setItem("restaurantchoice", 1);
    });

    $("#restaurantchoice2").on("click", function() {
        localStorage.setItem("restaurantchoice", 2);
    });

    $("#restaurantchoice3").on("click", function() {
        localStorage.setItem("restaurantchoice", 3);
    });
}


/** Removes spaces from a string and replaces them with "%20" for use in Google URLs */
function removeSpaces(str) {
    if (str === null) {
        return;
    }
    str = str.trim();
    for (let i = 0; i < str.length; i++)
        if (str[i] === " ") {
            var leftStr = str.slice(0, i);
            var rightStr = str.slice(i + 1,);
            str = leftStr + "%20" + rightStr;
        }
    return str;
}


// GOOGLE MAPS API FUNCTIONS
// -------------------------

/** Converts an address to latitude/longitude using ajax call to geocoding service.
 * Then stores the latitude/longitude in local storage. */
function geocodeAddressUrl(queryURL) {
    console.log(queryURL)
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
            location.href="TrekFinalAddress.html";
        }
        // if final address:
        else {
            endLatLong = latLongObj;
            localStorage.setItem("endLatLong", JSON.stringify(endLatLong));
            location.href="TrekStartHikeQuestions.html";
        }
    });
}



/** After both start and end addresses have been submitted, can calculate the distance and travel time between them.
 * Unused in current iteration of program. */
function getTravelTime(startLatLong, endLatLong) {

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


/** Prints out verbal directions from a start to an end point. Directions are appended onto a div with id='directions'. Unused in current program iteration. */
function getDirections() {
    // This function can only be called once per page:
    if (directionsListPopulated) {
        return;
    }
    directionsListPopulated = true;

    // Build query url:
    var queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?units=imperial&origin=" + startLatLong.latitude + "%2C" + startLatLong.longitude;
    queryURL = addWaypointsToQueryURL(queryURL);
    queryURL += "&key=" + APIKEY;

    // Make a call to google directions. Append the result to the list of directions in the html.
    var directionsList = $("#directions");
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // Remove loading icon once response is successful.
        $(".spinner-border").attr("style", "display:none");
        // Make sure that a valid response is returned. If not, print an error message.
        if (response.status !== "OK") {
            let newli = $("<li>");
            newli.attr("class", "list-group-item");
            newli.text("Error - directions cannot be found.");
            directionsList.append(newli);
        }
        // If successful response, append response onto $("#directions")
        else {
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
    var hikeChoice = localStorage.getItem("hikechoice");
    var hikeLatLong = JSON.parse(localStorage.getItem("hikeLocation" + hikeChoice));
    console.log(hikeLatLong);
    var restaurantChoice = localStorage.getItem("restaurantchoice");
    var restaurantLatLong = JSON.parse(localStorage.getItem("restaurantLocation" + restaurantChoice));


    waypointsArray.push(hikeLatLong);
    waypointsArray.push(restaurantLatLong);

    // CODE FOR LOGIC USED IF ONLY GOING TO ONE OR THE OTHER, OR OUT OF ORDER
    // if (goingOnHike && goingToRestaurant) {
    //     if (hikeFirst) {
    //         waypointsArray.push(hikeLatLong);
    //         waypointsArray.push(restaurantLatLong);
    //     }
    //     else {
    //         waypointsArray.push(restaurantLatLong);
    //         waypointsArray.push(hikeLatLong);
    //     }
    // }
    // else if (goingOnHike) {
        //     waypointsArray.push(hikeLatLong);
    // }
    // else if (goingToRestaurant) {
        //     waypointsArray.push(restaurantLatLong);
    // }
    if (endLatLong !== null) {
        waypointsArray.push(endLatLong);
    }
    for (let i = 0, j = waypointsArray.length; i < j; i++) {
        if (waypointsArray[i] === null) {
            waypointsArray.splice(i, 1);
        }
    }
    return waypointsArray;
}


/** Build a custom query URL for use in the embed maps Google service. */
function addWaypointsToQueryURL(queryURL) {
    // First, populate an array with the waypoints in order.
    var waypointsArray = populateWaypointsArray();
    console.log(waypointsArray)
    // Then, add each waypoint to the queryURL, in order. Should have at least one waypoint.
    if (waypointsArray.length === 0) {
        console.log("no endpoints set!");
    }
    if (waypointsArray.length > 1) {
        queryURL += "&waypoints=";
    }
    // After each waypoint is added as a parameter, remove it from the array. Finish when there are no waypoints left to add.
    while (waypointsArray.length > 0) {
        // if (waypointsArray[0] === null) {
        //     waypointsArray.shift();
        //     continue;
        // }
        
        if (waypointsArray.length === 1) {
            queryURL += "&destination=" + waypointsArray[0].latitude + "%2C" + waypointsArray[0].longitude;
            waypointsArray.shift();
        }
        if (waypointsArray.length > 1) {
            queryURL += waypointsArray[0].latitude + "%2C" + waypointsArray[0].longitude;
            waypointsArray.shift();
            if (waypointsArray.length > 1) {
                queryURL += "|";
            }
        }
    }
    console.log(queryURL)
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


/** Given an object with latitude and longitude, embed a satellite view of the coordinates. Unused in current iteration. */
function satelliteViewEmbed(place) {
    // Note: dont' use heroku CORS fixer in the queryURL.
    var mode = "view";

    // First, put the API key and starting location into the queryURL.
    var queryURL = "https://www.google.com/maps/embed/v1/" + mode + "?key=" + APIKEY;
    queryURL += "&center=" + place.latitude + "%2C" + place.longitude;
    queryURL += "&zoom=20&maptype=satellite";

    // Finally, embed the map.
    $("#satellite-photo").attr("src", queryURL);
}


// TODO:
/*
Add loading spinners to submit buttons (need to wait for ajax calls before next page loads)
if no waypoints, then tell user they must select a waypoint (with a modal?)
add satellite photos service? - "view" mode for embed, with parameter "center"
animate directions droplist
display travel time somewhere?
clear button for addrss form?
general organization
Customize event listeners per page
account for edge cases of no stored addresses (although this should never be properly reached)
*/
