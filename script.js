// API key
const apiKey = "4c1a01c57bb24da786855cca3bd3cb1c";

// Get reference to the news container
const newsContainer = document.getElementById("newsContainer");

// Get references to the search form and input
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Get reference to the weather info container
const weatherInfoContainer = document.getElementById("weather-info");

// Function to fetch and display news
async function fetchAndDisplayNews(url) {
    // Clear the existing news container
    newsContainer.innerHTML = "";

    try {
        // Fetch news data from the provided URL
        const response = await fetch(url);
        const data = await response.json();

        // Check if articles are available in the response
        if (data.articles && data.articles.length > 0) {
            // Filter out the removed articles
            const filteredArticles = data.articles.filter(article => article.title !== "[Removed]");

            // Loop through each filtered article and create corresponding HTML elements
            filteredArticles.forEach((article) => {
                // Create a container for each news item
                const newsItem = document.createElement("div");
                newsItem.classList.add("news-item");

                // Create title element
                const title = document.createElement("h2");
                title.textContent = article.title;

                // Inside the forEach loop where you create the image element
                const image = document.createElement("img");
                // Check if the article has a valid image URL, if not, use a default image
                if (article.urlToImage && article.urlToImage !== "null" && article.urlToImage !== null) {
                    image.src = article.urlToImage;
                } else {
                 // Provide a default image URL here
                    image.src = "default_image.jpg"; 
                }
                image.alt = "News Image";
                image.classList.add("news-image");


                // Create description element
                const description = document.createElement("p");
                description.textContent = article.description;

                // Create a link element to the original article
                const link = document.createElement("a");
                link.href = article.url;
                link.textContent = "For more, please click here";

                // Append elements to the news item container
                newsItem.appendChild(title);
                newsItem.appendChild(image);
                newsItem.appendChild(description);
                newsItem.appendChild(link);

                // Append news item container to the news container
                newsContainer.appendChild(newsItem);
            });
        } else {
            // Display a message if no articles are available
            newsContainer.innerHTML += `<p>No information available.</p>`;
        }
    } catch (error) {
        // Handle errors
        console.error("ERROR", error);
        newsContainer.innerHTML += "<p>ERROR</p>";
    }
}

// Event listener for form submission to search for news
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchQuery = searchInput.value;
    fetchAndDisplayNews(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}`);
});

// Function to update weather information in the UI
function updateWeatherUI(weatherData) {
    const weatherDescription = weatherData.weather[0].description;
    const temperature = Math.round(weatherData.main.temp - 273.15); // Convert temperature to Celsius

    const weatherInfoHTML = `
        <p>Weather: ${weatherDescription}</p>
        <p>Temperature: ${temperature}°C</p>
    `;

    weatherInfoContainer.innerHTML = weatherInfoHTML;
}

// Function to handle category filtering
function filterByCategory(category) {
    fetchAndDisplayNews(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`);
}

// Attach click event listeners to category buttons
const categoryButtons = document.querySelectorAll('.category-button');
categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        const category = this.value;
        filterByCategory(category);
    });
});

// Check if geolocation is supported
if (navigator.geolocation) {
    // Fetch weather information based on user's location
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const weatherApiKey = "6cb14eb6b45ff7cc4444402f801c7f9c";
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;

        try {
            // Fetch weather data from OpenWeatherMap API
            const weatherResponse = await fetch(weatherApiUrl);
            const weatherData = await weatherResponse.json();

            // Update the UI with weather information
            updateWeatherUI(weatherData);
        } catch (error) {
            // Handle errors
            console.error("Weather API Error", error);
            weatherInfoContainer.innerHTML = "<p>Unable to fetch weather information.</p>";
        }
    });
} else {
    // Display message if geolocation is not supported
    weatherInfoContainer.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
}

// Initial fetch of news when the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchAndDisplayNews("https://newsapi.org/v2/top-headlines?country=us&apiKey=4c1a01c57bb24da786855cca3bd3cb1c");
});
