// console.log('sab badhiya hai');

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;

//     document.body.appendChild(newPara);
// }

// async function showWeather(){
// try{
//     let city = "goa";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data = await response.json();
//     console.log("Weather Data :-> " , data);

    
//     renderWeatherInfo(data);
// }
// catch(err){
//      // handle the error here
//      console.log('error hai bhaiya')
// }

// }

// async function getCustomWeatherDetails(){
//     try{
//         let latitude = lat;
//         let longitude = longi;

//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);

//         let data = await result.json();

//         console.log(data);


//     }

//     catch(e){
//         console.log('error found');
//     }

// }

// function getLocation(){
//     if(navigator.geolocation){
//        navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geoLocation Support");
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const noLocationFound = document.querySelector(".no-location-found");

// initially variables need??

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
                // kya search wala container is invisible, if yes then make it visible.
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active"); 
        }

        else{
            // main pehle search wale tab pr tha, ab your weather tab visible krna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather tab me agaya hu, toh weather bhi display krna padega, so lets check local storage first
            // for coordinates if we have saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as input parameter.
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    // pass clicked tab as input parameter.
    switchTab(searchTab);
})

// check if coordinates are already present in session storage
 
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local coordinates nhi mile then
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    // make grantlocationAccess invisible
    grantAccessContainer.classList.remove("active");
    // make laoder visible
    loadingScreen.classList.add("active");

    // API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // ek function banayenge jo dynamically values render kre UI par , data se lekar
        renderWeatherInfo(data);
    }

    catch(err){
        loadingScreen.classList.remove("active");
        // homework
        noLocationFound.classList.add("active");
    }


}

function renderWeatherInfo(weatherInfo){
    //  first we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weather Info object and put it into UI elements
     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText = weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText = `${weatherInfo?.main?.temp}°C`;
     windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
     humidity.innerText = `${weatherInfo?.main?.humidity}%`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); 
    }
    else {
        // HW show an alert for no geolocation support available
        noLocationFound.classList.add("active");
    }
}

function showPosition(position){
     const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
     }

     sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName==="")
    return;
    else{
        fetchUserWeatherInfo(cityName);
    }
} )

async function fetchUserWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err){
        noLocationFound.classList.add("active");
    }
}



