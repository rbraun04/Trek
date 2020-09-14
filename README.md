# Welcome to TREK!

Choose your own adventure! The TREK app is designed to be a single stop app for planning a day's outing. Access the deployed app at https://rbraun04.github.io/Trek/. Plan out a route to a nearby hiking spot, then find local restaurants and shops to stop at along the way. This project was the result of colloboration between several programmers (in alphabetical order): David Oyeyemi, Kevin Miller, Richard Antolin, Ryan Braun, and Sulada Sudjai.

![image](https://user-images.githubusercontent.com/64618290/89943408-019efb00-dbd3-11ea-89dc-e987c4a44b6d.png)

## App Functionality


The app is designed to be simple to use. Enter your starting address and optional ending address. Based on these, the app then offers hiking and eating suggestions. At any time, the Trek logo can be clicked to check out the weather, or to start the process over. Options for hiking and eating include difficulty of the hike, and price of the restaurant. Finally, based on input, the app will give you a list of directions and a map to help guide you.


### App Design, Goals, and Future Direction

In order to present the user with relevant information, the app pulls data from several different API databases. Among these API databases are Google Cloud Platform and Maps Services, Yelp Fusion, the Hiking Project, and OpenWeather. Asynchronous JavaScript and jQuery functions are used to gather relevant results for the user. The app interface is designed to present all this information in a single place.

The app was a joint project between several programmers. David worked with the Yelp Fusion API. Kevin did work with the Google Cloud Platform API. Richard took care of the hiking portion. Sulada managed the weather API. And finally, Ryan was in charge of presenting the front-end code for the project. Several programming challenges were met during the project. One such challenge was passing data from one page of the app to the next. This was accomplished through the local storage feature of browsers, which allowed data like addresses and restaurant choices to be stored for a session. Another such example of a technical problem is the inherent wait time in making a receivign a response to an API database request. This wait time has to be handled through asynchronous JavaScript promises, but the app could communicate this better to the user. This could be done through the use of utilities such as loading spinners or progress bars. There is also plenty of additional functionality that a deeper dive into the APIs could offer. For example, the Google Maps API services offer a wide variety of options and parameters that could be implemented. A few examples of additional maps functionality are the ability to select multiple modes of transportation, the ability to append a list of directions to the HTML document, or the ability to display satellite photos of the input locations. Yelp and hiking API functionality could also be improved - by offering more detail and choices, for example. The Yelp API in particular has a wider variety of parameters that could be queried in an API call. The weather API could also be connected to the main user address, through the browser local storage. All of these could certainly be implemented, given more time and work. But overall, the app in its current state demonstrates useful functionality for an end-user. The app ultimately demonstrates how the power of big data can be harnessed, all through asynchronous JavaScript programming.

The design and front-end portion of the app was also carefully designed through several iterations. Similar to how the user is planning a Trek, the styling choices of the app were meant to reflect a journey from start to finish. We believe that we have accomplished the goal of designing a useful and engaging experience for an end user.

### Questions and Contributions

Questions may be directed to any programmers listed as joint collaborators on GitHub -  David Oyeyemi, Kevin Miller, Richard Antolin, Ryan Braun, and Sulada Sudjai.