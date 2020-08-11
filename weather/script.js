const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "d7201dda80f3552702d151fb4f10e857";

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `The weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      } is showing right now`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather, coord} = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      <h4><span>humidity ${main.humidity}</span></h4>
      
      `;
      li.innerHTML = markup;
      list.appendChild(li);

      // localStorage.setItem("country", JSON.stringify(sys.country));
      localStorage.setItem("temp", JSON.stringify(main.temp));
      localStorage.setItem("lat", JSON.stringify(coord.lat));
      localStorage.setItem("lon", JSON.stringify(coord.lon));
      
      // var country = JSON.parse(responsegetItem("country"));
      //  temp = JSON.parse(responsegetItem("temp"));
      // var lat = JSON.parse(responsegetItem("lat"));
      // var lon = JSON.parse(responsegetItem("lon"));

    })
    .catch(() => {
      msg.textContent = "Your city name is incorrect";
    });

  msg.textContent = "";
  form.reset();
  input.focus();


  

});





 
 
    
//===================================================================================
