const p_temp = document.querySelector(".temp")
const p_feelTemp = document.querySelector(".feel_temp")
const p_Mintemp = document.querySelector(".min_temp")
const p_Maxtemp = document.querySelector(".max_temp")
const p_humidity = document.querySelector(".humidity")
const p_weather = document.querySelector(".weather")
const p_weatherDesc = document.querySelector(".weather_desc")
const p_wind = document.querySelector(".wind")
const p_windDeg = document.querySelector(".wind_deg")
const p_pressure = document.querySelector(".pressure")
const icon_img = document.querySelector(".icon_img")
const p_time = document.querySelector(".time")
const p_city = document.querySelector(".city") 
const p_country = document.querySelector(".country")

function getPositionSuccess(pos) {
    var geoLat = pos.coords.latitude.toFixed(5);
    var geoLng = pos.coords.longitude.toFixed(5);
    var geoAcc = pos.coords.accuracy.toFixed(1);

    let url = getApiUrl(geoLat, geoLng)
    getWeather(url)
}

function getPositionErr(err) {
    switch (err.code) {
        case err.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case err.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case err.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        default:
            alert("An unknown error occurred.");
        }
}

function getWeather(url){
    //API call
    //var URLRequest = 'https://api.openweathermap.org/data/2.5/weather?lat='+ String(geoLat) +'&lon='+ String(geoLng) +'&appid=ced9d0aa8fa67d44b536a557457f9091'
    var URLRequest = url
    //Make the jQuery.getJSON request
    $.getJSON(URLRequest)
        //Success promise
        .done(function(data) {
            console.log(data);
            p_temp.innerHTML = Math.round(data.main.temp - 273) + "&#xb0;C"
            p_weather.innerHTML = "Weather: " + data.weather[0].main
            p_weatherDesc.innerHTML = "Detail: " + data.weather[0].description
            p_feelTemp.innerHTML = "Feel Temperature: " + Math.round(data.main.feels_like - 273) + "&#xb0;C "
            p_Mintemp.innerHTML = "Min Temperature: " + Math.round(data.main.temp_min - 273) + "&#xb0;C "
            p_Maxtemp.innerHTML = "Max Temperature: " + Math.round(data.main.temp_max - 273) + "&#xb0;C "
            p_humidity.innerHTML = "Humidity: " + data.main.humidity + "%"
            p_wind.innerHTML = "Wind: " + data.wind.speed + "m/s "
            p_windDeg.innerHTML = "Wind Direction: " + data.wind.deg + "&#xb0;"+ degreeToDirection(data.wind.deg)
            p_pressure.innerHTML = "Pressure: " + data.main.pressure + "mb"
            const d = new Date() 
            p_time.innerHTML = "Time: " + d.toLocaleDateString() + " " + d.toLocaleTimeString()
            var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x" + ".png";
            icon_img.setAttribute('src', iconUrl)
            reverseGeoCoding(data.coord.lat, data.coord.lon)
        })
        //Error promise
        .fail(function() {
            alert('Sorry, something bad happened when retrieving the weather');
        }
    );
}

function reverseGeoCoding(geoLat, geoLng) {
    const baseUrl = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2'
    let URLRequest = baseUrl + '&lat=' + geoLat + '&lon=' + geoLng 

    $.getJSON(URLRequest)
    //Success promise
    .done((data) => {
        console.log(data)
        
        if(data.address.city) {
            p_city.innerHTML = data.address.city
        }
        else {
            p_city.innerHTML = data.address.province
        }

        p_country.innerHTML = data.address.country
    })
    //Error promise
    .fail((data) => {
        alert("Reverse geo location does not work!")
    })

}

function degreeToDirection(deg) {
    let val = parseInt((deg/22.5)+.5)
    let arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    return arr[(val % 16)]
}

function getApiUrl(inp1, inp2) {
    apiKey = '&appid=ced9d0aa8fa67d44b536a557457f9091'
    
    if (!inp2) {
        return 'https://api.openweathermap.org/data/2.5/weather?q='+ String(inp1) + apiKey
    }
    else {
        return 'https://api.openweathermap.org/data/2.5/weather?lat='+ String(inp1) +'&lon='+ String(inp2) + apiKey
    }
}

window.addEventListener('load', () => {
    geo = navigator.geolocation

    if (geo) {
        geo.getCurrentPosition(getPositionSuccess, getPositionErr);
    } 
    else {
        alert('geolocation not available?! What year is this?');
    }
})

const corBtn = document.querySelector(".cor-search")
const cityBtn = document.querySelector(".city-search")
const body = document.querySelector("body")

corBtn.addEventListener('click', () => {
    var divInput = document.querySelector(".inputs") 
    if(divInput) {
        body.removeChild(body.lastElementChild)
    }
    
    divInput = document.createElement("div")
    divInput.classList.add("inputs")
    
    const latInput = document.createElement("input")
    latInput.classList.add("Lat_input")
    latInput.type = "text"
    latInput.placeholder = "Lat"

    const lngInput = document.createElement("input")
    lngInput.classList.add("Lng_input")
    lngInput.type = "text"
    lngInput.placeholder = "Lng"

    const p = document.createElement("p")
    p.innerHTML = "press enter to search"
    
    divInput.appendChild(latInput)
    divInput.appendChild(lngInput)
    divInput.appendChild(p)
    body.appendChild(divInput)
})

cityBtn.addEventListener('click', () => {
    var divInput = document.querySelector(".inputs") 
    if(divInput) {
        body.removeChild(body.lastElementChild)
    }
    
    divInput = document.createElement("div")
    divInput.classList.add("inputs")
    
    const cityInput = document.createElement("input")
    cityInput.classList.add("city_name_input")
    cityInput.type = "text"
    cityInput.placeholder = "City name"

    const p = document.createElement("p")
    p.innerHTML = "press enter to search"

    divInput.appendChild(cityInput)
    divInput.appendChild(p)
    body.appendChild(divInput)
})

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        latInput = document.querySelector(".Lat_input")
        lngInput = document.querySelector(".Lng_input")
        cityInput = document.querySelector(".city_name_input")

        if (latInput && lngInput) {
            const lat = latInput.value
            const lng = lngInput.value

            if (lat == '' && lng == '') alert("Please enter values!")

            let url = getApiUrl(lat, lng)
            getWeather(url)
        } 

        if(cityInput) {
            const cityName = cityInput.value

            if (cityName == '') alert("Please enter values!")
            
            let url = getApiUrl(cityName)
            getWeather(url) 
        }
    }
})

