// Distance Matrix API: calulates distance and travel time
// General formatting:
// https://maps.googleapis.com/maps/api/distancematrix/outputFormat?parameters

// can search by latitude and longitude:
// origins=41.43206,-81.38992|-33.86748,151.20699
// or by address:
// origins=Bobcaygeon+ON|24+Sussex+Drive+Ottawa+ON

// required parameters: origins, destination, key

$(document).ready(function() {

    // an example with latitude and longitude for origin. %2C is a comma. %7C is a '|' in between different destinations
    // in the below example, latitude and longitude are origins=40.6655101,-73.89188969999998
    var exampleURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=AIzaSyB_ShRmKvw0k00jVd4WofFQVbEtdjV4T0c"
    var queryURL;
    queryURL = exampleURL;

    // travel mode is driving by default
    var otherTravelMode = false;
    // mode = transit; transit_mode = bus, subway, train, tram, rail
    // mode = driving, walking, bicycling

    if (otherTravelMode) {
        // set other travel mode to whatever user selects.
        ;
    }

    // CORS policy must be dealt with either through a developer plugin, or through use of a proxy server.

    // ajax call returns infor such as distance and travel time.
    const DEST = 0;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(`destination ${DEST} is ` + response.destination_addresses[DEST]);
        console.log("distance to " + response.destination_addresses[DEST] + " is " + response.rows[0].elements[DEST].distance.text);
        console.log("number of destinations is " + response.destination_addresses.length);
        console.log("origin address is " + response.origin_addresses[0]);
        console.log(`duration to destination ${DEST} is ` + response.rows[0].elements[DEST].duration.text);
    });


});