const apiKey = "4c1a01c57bb24da786855cca3bd3cb1c";
const newsContainer = document.getElementById("newsContainer");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const weatherInfoContainer = document.getElementById("weather-info");

document.addEventListener('DOMContentLoaded', function () {
    fetchAndDisplayNews("https://newsapi.org/v2/top-headlines?country=us&apiKey=4c1a01c57bb24da786855cca3bd3cb1c");
});

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchQuery = searchInput.value;
    fetchAndDisplayNews(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}`);
});

const categoryButtons = document.querySelectorAll('.category-button');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
           
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');

            const selectedCategory = this.value;

         const categoryURL = `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&apiKey=${apiKey}`;
            fetchAndDisplayNews(categoryURL);
        });
    });

async function fetchAndDisplayNews(url) {
    newsContainer.innerHTML = "";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            data.articles.forEach((article) => {
                const newsItem = document.createElement("div");
                newsItem.classList.add("news-item");

                const title = document.createElement("h2");
                title.textContent = article.title;

                const image = document.createElement("img");
                image.src = article.urlToImage;
                image.alt = "News Image";
                image.classList.add("news-image");

                const description = document.createElement("p");
                description.textContent = article.description;

                const link = document.createElement("a");
                link.href = article.url;
                link.textContent = "For more, visit the link:";

                newsItem.appendChild(title);
                newsItem.appendChild(image);
                newsItem.appendChild(description);
                newsItem.appendChild(link);

                newsContainer.appendChild(newsItem);
            });
        } else {
            newsContainer.innerHTML += `<p>No information available.</p>`;
        }
    } catch (error) {
        console.error("ERROR", error);
        newsContainer.innerHTML += "<p>ERROR</p>";
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const weatherApiKey = "6cb14eb6b45ff7cc4444402f801c7f9c";
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;

        try {
            const weatherResponse = await fetch(weatherApiUrl);
            const weatherData = await weatherResponse.json();

            // Update the UI with weather information
            updateWeatherUI(weatherData);
        } catch (error) {
            console.error("Weather API Error", error);
            weatherInfoContainer.innerHTML = "<p>Unable to fetch weather information.</p>";
        }
    });
} else {
    weatherInfoContainer.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
}

function updateWeatherUI(weatherData) {
    const weatherDescription = weatherData.weather[0].description;
    const temperature = Math.round(weatherData.main.temp - 273.15); // Convert temperature to Celsius

    const weatherInfoHTML = `
        <p>Weather: ${weatherDescription}</p>
        <p>Temperature: ${temperature}°C</p>
    `;

    weatherInfoContainer.innerHTML = weatherInfoHTML;
}