const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const weatherDisplay = document.querySelector(".weather-container");
const searchForm = document.querySelector(".form-container");
const userInfoContainer = document.querySelector(".user-info-container");
const loading = document.querySelector(".loading-container");

//initially
const API_KEY = "fe378fdc600c0450c7361d59904b8c45";
let currentTab = searchTab;
currentTab.classList.add("active");    
getFromSessionStorage();

function switchTab(clickedTab) {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("active");
        currentTab = clickedTab;
        currentTab.classList.add("active");

        if(clickedTab == searchTab) {
            //pehle userTab me tha ab search tab active hoga
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active"); 
        }
        else {
            //pehle searchTab me tha ab user tab active hoga
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();

        }
        
    }
}

userTab.addEventListener("click" , () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

//check if coordinates are already present in session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        //use local coordiinates
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates; 
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loading.classList.add("active");

    //API call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loading.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loading.classList.remove("active");
        //HW
    }

}

function renderWeatherInfo(data) {
    //firstly we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    console.log("Fetch7");
    //fetch values from data and put in UI
    
    cityName.innerText = data?.city?.name;
    console.log("Fetch8");
    countryIcon.src = `https://flagcdn.com/144x108/${data?.city?.country.toLowerCase()}.png`;
    console.log("Fetch9");
    desc.innerText = data?.list?.[0]?.weather?.[0]?.description;
    console.log("Fetch10");
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.list?.[0]?.weather?.[0]?.icon}.png`;
    console.log("Fetch11");
    temp.innerText = `${data?.list?.[0]?.main?.temp} °C`;
    windSpeed.innerText = `${data?.list?.[0]?.wind?.speed} m/s`;
    humidity.innerText = `${data?.list?.[0]?.main?.humidity}%`;
    cloudiness.innerText = `${data?.list?.[0]?.clouds?.all}%`;

}

//Storing location coordinates in session storage using geolocation API
const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click" , getLocation());

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition) ;
    }
    else {

    }
}

function showPosition(position) {

    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(cityName) {
    loading.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        console.log("Fetch1");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`
        );
        console.log("Fetch2");
        const data = await response.json();
        console.log("Fetch3");
        loading.classList.remove("active");
        console.log("Fetch4");
        userInfoContainer.classList.add("active");
        console.log("Fetch5");
        renderWeatherInfo(data); 
        console.log("Fetch6");
    }
    catch(e) {
        console.log("Not available");
    }
}