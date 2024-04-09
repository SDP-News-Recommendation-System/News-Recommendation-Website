// API key
const apiKey = "4c1a01c57bb24da786855cca3bd3cb1c";

// Get reference to the news container
const newsContainer = document.getElementById("newsContainer");

// Get references to the search form and input
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Get reference to the weather info container
const weatherInfoContainer = document.getElementById("weather-info");

const customSelect = document.querySelector(".custom-select");
const topicSelect = document.querySelector(".topic-select");

const selectBtn = document.querySelector(".select-button");
const selectBtn1 = document.querySelector(".sel-button");

const selectedValue = document.querySelector(".selected-value");
const selectedValue1 = document.querySelector(".sel-value");

const optionsList = document.querySelectorAll(".select-dropdown li");
const optionsList1 = document.querySelectorAll(".topic-dropdown li");


// add click event to select button
selectBtn.addEventListener("click", () => {
  // add/remove active class on the container element
  customSelect.classList.toggle("active");

  // update the aria-expanded attribute based on the current state
  selectBtn.setAttribute("aria-expanded",
    selectBtn.getAttribute("aria-expanded") === "true" ? "false" : "true"
  );
});
// add click event to select button
selectBtn1.addEventListener("click", () => {
    // add/remove active class on the container element
    topicSelect.classList.toggle("active");
  
    // update the aria-expanded attribute based on the current state
    selectBtn1.setAttribute("aria-expanded",
      selectBtn1.getAttribute("aria-expanded") === "true" ? "false" : "true"
    );
  });

optionsList.forEach((option) => {
  function handler(e) {
    // Click Events
    if (e.type === "click" && e.clientX !== 0 && e.clientY !== 0) {
      selectedValue.textContent = this.children[1].textContent;
      customSelect.classList.remove("active");
    }
    // Key Events
    if (e.key === "Enter") {
      selectedValue.textContent = this.textContent;
      customSelect.classList.remove("active");
    }
  }

  option.addEventListener("keyup", handler);
  option.addEventListener("click", handler);
});

optionsList1.forEach((option) => {
    function handler(e) {
      // Click Events
      if (e.type === "click" && e.clientX !== 0 && e.clientY !== 0) {
        selectedValue1.textContent = this.children[1].textContent;
        topicSelect.classList.remove("active");
      }
      // Key Events
      if (e.key === "Enter") {
        selectedValue1.textContent = this.textContent;
        topicSelect.classList.remove("active");
      }
    }
  
    option.addEventListener("keyup", handler);
    option.addEventListener("click", handler);
  });
// OUTSIDE BOX  Add mousedown event listener to the document
document.addEventListener("mousedown", function (event) {
    // Check if the clicked element is the select button or select dropdown
    const isSelectButton = event.target.closest(".select-button");
    const isSelectDropdown = event.target.closest(".select-dropdown");

    // Check if the clicked element is outside the custom select
    const isOutsideCustomSelect = !event.target.closest(".custom-select");
    // If the clicked element is outside the custom select, close all active select boxes
    if (isOutsideCustomSelect) {
        customSelect.classList.remove("active");

        // Update the aria-expanded attribute of the select button
        selectBtn.setAttribute("aria-expanded", "false");
    }
});
document.addEventListener("mousedown", function (event) {
    // Check if the clicked element is the select button or select dropdown
    const isSelectButton1 = event.target.closest(".sel-button");
    const isSelectDropdown1 = event.target.closest(".topic-dropdown");

    // Check if the clicked element is outside the custom select
    const isOutsideTopicSelect = !event.target.closest(".topic-select");
    // If the clicked element is outside the custom select, close all active select boxes

    if (isOutsideTopicSelect) {
        topicSelect.classList.remove("active");

        // Update the aria-expanded attribute of the select button
        selectBtn1.setAttribute("aria-expanded", "false");
    }
});


// HOVER     Add mouseenter event listener to the select button
selectBtn.addEventListener("mouseenter", () => {
    // Add active class to the custom select
    customSelect.classList.add("active");
    // Update the aria-expanded attribute of the select button
    selectBtn.setAttribute("aria-expanded", "true");
});

selectBtn1.addEventListener("mouseenter", () => {
    // Add active class to the custom select
    topicSelect.classList.add("active");
    // Update the aria-expanded attribute of the select button
    selectBtn1.setAttribute("aria-expanded", "true");
});

// Add mouseleave event listener to the custom select
customSelect.addEventListener("mouseleave", () => {
    // Remove active class from the custom select
    customSelect.classList.remove("active");

    // Update the aria-expanded attribute of the select button
    selectBtn.setAttribute("aria-expanded", "false");
});
topicSelect.addEventListener("mouseleave", () => {
    // Remove active class from the custom select
    topicSelect.classList.remove("active");

    // Update the aria-expanded attribute of the select button
    selectBtn1.setAttribute("aria-expanded", "false");
});


// Event listener for location selection
optionsList.forEach((option) => {
    option.addEventListener("click", function () {
        const location = this.children[1].textContent.toLowerCase();
        fetchNewsByLocation(location);
    });
});
optionsList1.forEach((option) => {
    option.addEventListener("click", function () {
        const topic = this.children[1].textContent.toLowerCase();
        fetchNewsByTopic(topic);
    });
});

// Function to fetch news based on location
async function fetchNewsByLocation(location) {
    try {
        // Construct the API URL based on the selected location
        let apiUrl = `https://newsapi.org/v2/top-headlines?q=${location}&apiKey=${apiKey}`;

        // Fetch and display news based on the selected location
        await fetchAndDisplayNews(apiUrl, "general");
    } catch (error) {
        // Handle errors
        console.error("ERROR", error);
        newsContainer.innerHTML = "<p>ERROR</p>";
    }
}
// Function to fetch news based on location
async function fetchNewsByTopic(topic) {
    try {
        // Construct the API URL based on the selected location
        let apiUrl = `https://newsapi.org/v2/top-headlines?q=${topic}&apiKey=${apiKey}`;

        // Fetch and display news based on the selected location
        await fetchAndDisplayNews(apiUrl, "general");
    } catch (error) {
        // Handle errors
        console.error("ERROR", error);
        newsContainer.innerHTML = "<p>ERROR</p>";
    }
}


// Function to truncate description text
function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
        return description.slice(0, maxLength) + "...";
    }
    return description;
}
function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.slice(0, maxLength) + "...";
    }
    return title;
}
// Function to fetch and display news
async function fetchAndDisplayNews(url, category) {
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
                title.textContent = truncateTitle(article.title, 70);

                // Create image element
                const image = document.createElement("img");
                // Check if the article has a valid image URL, if not, use a default image based on category
                if (article.urlToImage && article.urlToImage !== "null" && article.urlToImage !== null) {
                    image.src = article.urlToImage;
                } else {
                    // Use default image based on category
                    switch (category) {
                        case "sports":
                            image.src = "s1.jpeg";
                            break;
                        case "business":
                            image.src = "b1.jpeg";
                            break;
                        case "entertainment":
                            image.src = "e1.jpeg";
                            break;
                        case "technology":
                            image.src = "t1.jpeg";
                            break;
                        default:
                            // Use a default image for other categories
                            image.src = "default_image.jpeg";
                            break;
                    }
                }
                image.alt = "News Image";
                image.classList.add("news-image");

                // Create description element
                const description = document.createElement("p");
                // Truncate description if it exceeds 50 characters
                description.textContent = truncateDescription(article.description, 100);

                // Create a link element to the original article
                const link = document.createElement("a");
                link.href = article.url;
                link.textContent = "For more, please click here...";

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
        console.error("", error);
        newsContainer.innerHTML += "<p>ERROR</p>";
    }
}

// Event listener for form submission to search for news
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchQuery = searchInput.value;
    fetchAndDisplayNews(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}`, "general");
});

// Function to update weather information in the UI
function updateWeatherUI(weatherData) {
    const weatherDescription = weatherData.weather[0].description;
    const temperature = Math.round(weatherData.main.temp - 273.15); // Convert temperature to Celsius

    const weatherIcon = getWeatherIcon(weatherDescription);

    const weatherInfoHTML = ` 
    <div class="weather-icon">${weatherIcon}</div>
    <p>${weatherDescription} - ${temperature}°C</p>
       
    `;

    weatherInfoContainer.innerHTML = weatherInfoHTML;
}

// Function to get weather icon based on weather description
function getWeatherIcon(description) {
    let icon = "";
    if (description.includes("sun") || description.includes("clear")) {
        icon = "<img src='sun.png' alt='Sun' class='weather-icon'>";
    } else if (description.includes("cloud")) {
        icon = "<img src='broken.png' alt='Broken' class='weather-icon'>";
    }else if (description.includes("cloud")) {
        icon = "<img src='cloud.png' alt='Cloud' class='weather-icon'>";
    } else if (description.includes("rain")) {
        icon = "<img src='rain.png' alt='Rain' class='weather-icon'>";
    } else if (description.includes("cloud")) {
        icon = "<img src='snowy.png' alt='Snowy' class='weather-icon'>";
    } else if (description.includes("storm") || description.includes("thunder")) {
        icon = "<img src='storm.png' alt='Storm' class='weather-icon'>";
    } else {
        icon = "<img src='default.png' alt='Default' class='weather-icon'>";
    }
    return icon;
}

// Function to handle category filtering
async function filterByCategory(category) {
    try {
        // Construct the API URL based on the selected category
        let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;

        // Fetch and display news based on the selected category
        await fetchAndDisplayNews(apiUrl, category);
    } catch (error) {
        // Handle errors
        console.error("ERROR", error);
        newsContainer.innerHTML = "<p>ERROR</p>";
    }
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

function applyDateRangeFilter(startDate, endDate) {
    const locationFilterValue = document.querySelector("custom-select");
    const topicFilterValue = document.querySelector("topic-select");

    let apiUrl = `https://newsapi.org/v2/everything?q=bitcoin&from=${startDate}&to=${endDate}&sortBy=publishedAt&apiKey=${apiKey}`;

    // Append location filter to API URL if selected
    if (locationFilterValue) {
        apiUrl += `&q=${locationFilterValue}`;
    }

    // Append topic filter to API URL if selected
    if (topicFilterValue) {
        apiUrl += `&category=${topicFilterValue}`;
    }

    // Fetch and display news based on filters
    fetchAndDisplayNews(apiUrl, topicFilterValue);
}
// Initialize Flatpickr for the date range picker
const dateRangeInput = document.getElementById("date-range");
flatpickr(dateRangeInput, {
    mode: "range",
    dateFormat: "Y-m-d",
    onClose: function (selectedDates, dateStr, instance) {
        if (selectedDates.length === 2) {
            const startDate = selectedDates[0].toISOString().split('T')[0];
            const endDate = selectedDates[1].toISOString().split('T')[0];
            applyDateRangeFilter(startDate, endDate);
        }
    }
});

// Initial fetch of news when the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchAndDisplayNews("https://newsapi.org/v2/top-headlines?country=us&apiKey=4c1a01c57bb24da786855cca3bd3cb1c", "general");
});
