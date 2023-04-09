const apiKey = 'b546c1544638cced524b474a9d963bb4';

const searchInput = document.querySelector('.search__input')
const searchBtn = document.querySelector('.search__button')
const celsiusBtn = document.querySelector('.celsius')
const fahrenheitBtn = document.querySelector('.fahrenheit')
const mainIcon = document.querySelector('.top__weather-icon img')
const cityName = document.querySelector('.top__weather-location')
const mainDate = document.querySelector('.top__weather-date')
const mainDegree = document.querySelector('.bottom__weather-degree')
const humidity = document.querySelector('.humidity')
const cloudness = document.querySelector('.cloudness')
const wind = document.querySelector('.wind')
let today = new Date();

function getLocation(city) {
	const locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}&units=metric`;

	fetch(locationUrl)
		.then(response => response.json())
		.then(data => {
			const lat = data[0].lat;
			const lon = data[0].lon;
			getWeather(lat, lon);
			cityName.innerHTML = `${data[0].name},${data[0].country}`
		})
		.catch(error => console.log(error.message));
}


function getWeather(lat, lon) {
	const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

	fetch(weatherUrl)
		.then(response => response.json())
		.then(data => {
			mainDegree.innerHTML = `${Math.round(data.main.temp)}°`
			cloudness.innerHTML = `${data.clouds.all}%`
			humidity.innerHTML = `${data.main.humidity}%`
			wind.innerHTML = `${data.wind.speed} km/h`
			let weatherStatus = data.weather[0].main;
			changeIcon(weatherStatus)
		})
}

function changeIcon(status) {
	switch (status) {
		case 'Clouds':
			mainIcon.setAttribute('src', `img/Cloudy.svg`)
			break
		case 'Rain':
			mainIcon.setAttribute('src', `img/Rain.svg`)
			break
		case 'Drizzle':
			mainIcon.setAttribute('src', `img/Drizzle.svg`)
			break
		case 'Snow':
			mainIcon.setAttribute('src', `img/Snow.svg`)
			break
		case 'Thunderstorm':
			mainIcon.setAttribute('src', `img/Thunderstorm.svg`)
			break
		case 'Clear':
			mainIcon.setAttribute('src', `img/Clear.svg`)
			break
	}
}


function displayDate(value) {
	let options = {
		day: "numeric",
		month: "short",
		year: "numeric"
	}

	let optionWeekday = {
		weekday: "long"
	}

	document.querySelector(".weekday").innerHTML = value.toLocaleDateString("en-GB", optionWeekday);
	document.querySelector(".date").innerHTML = value.toLocaleDateString("en-GB", options);
}
displayDate(today);

function displayCelsius() {
	if (!celsiusBtn.classList.contains('active')) {
		fahrenheitBtn.classList.remove('active');
		celsiusBtn.classList.add('active')
		mainDegree.innerHTML = `${Math.round((mainDegree.innerHTML.substr(0, mainDegree.innerHTML.length - 1) - 32) / 1.8)}°`
	}
}

function displayFahrenheit() {
	if (celsiusBtn.classList.contains('active')) {
		celsiusBtn.classList.remove('active');
		fahrenheitBtn.classList.add('active')
		mainDegree.innerHTML = `${Math.round((mainDegree.innerHTML.substr(0, mainDegree.innerHTML.length - 1) * 1.8) + 32)}°`
	}
}
window.addEventListener('load', function () {
	getLocation('Krakow')
})

searchBtn.addEventListener('click', function () {
	if (searchInput.value != '') {
		getLocation(searchInput.value)
		searchInput.value = '';
	}
})

searchInput.addEventListener('keydown', function (e) {
	if (searchInput.value != '') {
		if (e.code == 'Enter') {
			getLocation(searchInput.value)
			searchInput.value = '';
		}
	}
})

celsiusBtn.addEventListener('click', displayCelsius)
fahrenheitBtn.addEventListener('click', displayFahrenheit)