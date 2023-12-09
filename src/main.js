import "./style.css";
import {idList, requestDomain} from "./constants";


const citiesList = [];

// getIP().
//     then((ip)=>getCoordinates(ip)).
//     then(({cityName, ll})=> {
//         getWeather(cityName);
//         mapStatic(ll);
// });

if(!window.jest) startAll();

async function initApp(){
    const ip = await getIP();
    const {cityName, ll} = await getCoordinates(ip);
    getWeather(cityName);
    mapStatic(ll);
}

//initApp();

export async function getWeather(cityName) {
    const link = `https://${requestDomain.openWeather}/data/2.5/weather?q=${cityName}&appid=6dac2d983c4b4bff9266414437d14d5e`;
    const result = await fetch(link);
    const data = await result.json();
    console.log(data.weather[0].description, data.main.temp, data.weather[0].icon);

    const tempInF = `${data.main.temp}`;
    const numtempInF = Number(tempInF);
    const tempInC = Math.round(numtempInF - 273.15);

    const temperature = document.getElementById("temperature");
    temperature.innerText = `${tempInC}°C`;

    const weatherDescription = document.getElementById("weatherDescription");
    weatherDescription.textContent = data.weather[0].description;

    const city = document.getElementById("city");
    city.innerText = `${data.name}`;

    const weatherImage = document.getElementById("weatherImage");
    weatherImage.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

export async function getIP() {
    const res = await fetch(`https://${requestDomain.ipApi}/json/`);
    const data = await res.json();
    let ip = data.ip;
    console.log(ip);
    return ip;
}

async function getCoordinates(ip) {
    const res = await fetch(`https://${requestDomain.sypExGeo}/json/${ip}`);
    const data = await res.json();
    console.log(data.city.lat, data.city.lon, data.city.name_ru);
    let cityName = data.city.name_ru;
    let ll = data.city.lon + "," + data.city.lat;
    console.log(ll);
    return {cityName, ll};
}

function mapStatic(ll) {
    const map = document.getElementById("map");
    map.src = `https://static-maps.yandex.ru/v1?ll=${ll}&spn=0.016457,0.00619&apikey=220bcecd-2e57-4af8-9150-e82755be7199`;
}

async function cityCoordinatesByName(cityName) {
    const link = `https://${requestDomain.openWeather}/data/2.5/weather?q=${cityName}&appid=6dac2d983c4b4bff9266414437d14d5e`;
    const result = await fetch(link);
    const data = await result.json();
    console.log(data.coord.lon, data.coord.lat, data.name);
    return data.coord.lon + "," + data.coord.lat;
}

export async function addCityInList(){
    const list = document.getElementById(idList);
    const input = document.getElementById("input");
    const cityName = input.value;
    input.value = "";
    await getWeather(cityName);
    cityCoordinatesByName(cityName).then((ll)=>mapStatic(ll));
    const li = document.createElement("li");
    li.setAttribute("data-city", cityName);
    li.innerHTML = cityName;
    list.append(li);
    citiesList.push(cityName);
    console.log(citiesList);
    localStorage.setItem("cities", JSON.stringify(citiesList));
    if(list.childElementCount > 10) {
        list.childNodes[0].remove();
        citiesList.shift();
        localStorage.setItem("cities", JSON.stringify(citiesList));
    }

}

async function cityFromListClick(e){
    if(e.target.dataset && e.target.dataset.city){
        const city = e.target.dataset.city;
        await getWeather(city);
        cityCoordinatesByName(city).then((ll)=>mapStatic(ll));
    }
}

export async function startAll() {
    if (localStorage.getItem("cities") === null) {
        initApp();
    } else {
        initApp();
        citiesFromStorage();
    }
    const button = document.getElementById("button");
    button.addEventListener("click", addCityInList);
    document.getElementById(idList).addEventListener("click", cityFromListClick);
}

async function citiesFromStorage() {
    const allCitiesFromStorage = JSON.parse(localStorage.getItem("cities"));
    console.log(allCitiesFromStorage);
    const list = document.getElementById(idList);
    // localStorage.setItem("cities", JSON.stringify(allCitiesFromStorage));
    // думала вдруг тогда города и те и те сохр будут, но не сработало
    for(let i = 0; i < allCitiesFromStorage.length; i++) {
        const cityName = allCitiesFromStorage[i];
        const li = document.createElement("li");
        li.setAttribute("data-city", cityName);
        li.innerHTML = cityName;
        list.append(li);
        citiesList.push(cityName);
    }
}

