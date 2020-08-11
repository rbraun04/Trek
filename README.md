# Welcome to T-R-E-K!

Choose your own adventure! The TREK app is designed to be a single stop app for planning a day's outing. Plan out a route to a nearby hiking spot, then find local restaurants and shops to stop at along the way. This project was the result of colloboration between several programmers (in alphabetical order): David Oyeyemi, Kevin Miller, Richard Antolin, Ryan Braun, and Sulada Sudjai.

![image](https://user-images.githubusercontent.com/64618290/89943408-019efb00-dbd3-11ea-89dc-e987c4a44b6d.png)

## App Functionality

The app is designed to be simple to use. Enter your starting address, and enter how far you would like to travel to a hiking spot. Decide whether or not you'd like to shop or eat along the way. The app will give you a list of directions and a map to help guide you. Weather conditions will let you know what to expect on the hike.

### App Design, Goals, and Future Direction

In order to present the user with relevant information, the app pulls data from several different API databases. Among these API databases are Google Cloud Platform and Maps Services, Yelp Fusion, the Hiking Project, and OpenWeather. Asynchronous JavaScript and jQuery functions are used to gather relevant results for the user. The app interface is designed to present all this information in a single place.

Although the app works as given, additional functionality and improvements can be added. One example of a technical problem is the inherent wait time in making a request to an API database, and waiting for a response. This wait time has to be handled through asynchronous JavaScript promises, but the app could communicate this better to the user. This could be done through the use of utilities such as loading spinners or progress bars. There is also plenty of additional functionality that a deeper dive into the APIs could offer. For example, the Google Maps API services offer a wide variety of options and parameters that could be implemented. A few examples of additional maps functionality are the ability to select multiple modes of transportation, the ability to append a list of directions to the HTML document, or the ability to display satellite photos of the input locations. Yelp and hiking API functionality could also be improved - by offering more detail and choices, for example. All of these could certainly be implemented, given more time and work. But overall, the app in its current state demonstrates useful functionality for an end-user. The app ultimately demonstrates how the power of big data can be harnessed, all through asynchronous JavaScript programming.
