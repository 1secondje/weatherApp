const apiKey = 'b546c1544638cced524b474a9d963bb4';

const searchInput = document.querySelector('.search__input')
const searchBtn = document.querySelector('.search__button')
const celsiusBtn = document.querySelector('.celsius')
const fahrenheitBtn = document.querySelector('.fahrenheit')
const nextDaysForecast = document.querySelectorAll('.nextday__forecast-degree')
const mainIcon = document.querySelector('.top__weather-icon img')
const cityName = document.querySelector('.top__weather-location')
const mainDate = document.querySelector('.date')
const mainDay = document.querySelector('.weekday')
const mainDegree = document.querySelector('.bottom__weather-degree')
const humidity = document.querySelector('.humidity')
const cloudness = document.querySelector('.cloudness')
const wind = document.querySelector('.wind')
let today = new Date();
let daysArr = []

function getLocation(city) {
	const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}&units=metric`;

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
			changeIcon(mainIcon, weatherStatus)
			displayDate(today);
		})

	const nextDaysForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

	fetch(nextDaysForecastUrl)
		.then(response => response.json())
		.then(data => {
			const nextDays = document.querySelectorAll(".nextday__forecast-block");
			let indexDays = 8;

			nextDays.forEach(element => {
				element.querySelector(".nextday__forecast-day").innerHTML = new Intl.DateTimeFormat('en-US', {
					weekday: 'long'
				}).format(new Date(data.list[indexDays].dt * 1000));
				changeIcon(element.querySelector(".nextday__forecast img"), data.list[indexDays].weather[0].main);
				element.querySelector(".nextday__forecast-degree").innerHTML = `${Math.round(data.list[indexDays].main.temp)}°`
				indexDays += 8;
				daysArr.push(element)

				console.log(data)
				element.addEventListener('click', function (e) {
					if (e.target == daysArr[0]) indexDays = 8
					if (e.target == daysArr[1]) indexDays = 16
					if (e.target == daysArr[2]) indexDays = 24
					if (e.target == daysArr[3]) indexDays = 32

					mainDate.innerHTML = new Intl.DateTimeFormat('en-US', {
						day: 'numeric',
						month: 'short'
					}).format(new Date(data.list[indexDays].dt * 1000));
					mainDay.innerHTML = new Intl.DateTimeFormat('en-US', {
						weekday: 'long'
					}).format(new Date(data.list[indexDays].dt * 1000));

					mainDegree.innerHTML = `${Math.round(data.list[indexDays].main.temp)}°`
					cloudness.innerHTML = `${data.list[indexDays].clouds.all}%`
					humidity.innerHTML = `${data.list[indexDays].main.humidity}%`
					wind.innerHTML = `${data.list[indexDays].wind.speed} km/h`
					let weatherStatus = data.list[indexDays].weather[0].main;
					changeIcon(mainIcon, weatherStatus)
				})
			});
		})
}

function changeIcon(icon, status) {
	switch (status) {
		case 'Clouds':
			icon.setAttribute('src', `img/Cloudy.svg`)
			break
		case 'Rain':
			icon.setAttribute('src', `img/Rain.svg`)
			break
		case 'Drizzle':
			icon.setAttribute('src', `img/Drizzle.svg`)
			break
		case 'Snow':
			icon.setAttribute('src', `img/Snow.svg`)
			break
		case 'Thunderstorm':
			icon.setAttribute('src', `img/Thunderstorm.svg`)
			break
		case 'Clear':
			icon.setAttribute('src', `img/Clear.svg`)
			break
	}
}


function displayDate(value) {
	let options = {
		month: "short",
		day: "numeric"
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
		nextDaysForecast.forEach(element => {
			element.innerHTML = `${Math.round((element.innerHTML.substr(0, element.innerHTML.length - 1) - 32) / 1.8)}°`
		})
	}
}

function displayFahrenheit() {
	if (celsiusBtn.classList.contains('active')) {
		celsiusBtn.classList.remove('active');
		fahrenheitBtn.classList.add('active')
		mainDegree.innerHTML = `${Math.round((mainDegree.innerHTML.substr(0, mainDegree.innerHTML.length - 1) * 1.8) + 32)}°`
		nextDaysForecast.forEach(element => {
			element.innerHTML = `${Math.round((element.innerHTML.substr(0, element.innerHTML.length - 1) * 1.8) + 32)}°`
		})
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