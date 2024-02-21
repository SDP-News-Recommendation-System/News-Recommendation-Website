// Get reference to the weather info container
const weatherInfoContainer = document.getElementById("weather-info");

// Function to fetch news data from JSON file
async function fetchNews() {
    try {
        // Show loading message
        document.getElementById('loadingMessage').style.display = 'block';

        // Fetch news data from JSON file
        const response = await fetch('news_data.json');
        const newsData = await response.json();

        // Hide loading message after fetching data
        document.getElementById('loadingMessage').style.display = 'none';

        // Display grouped news data and create group buttons
        displayGroupedNews(newsData);
        createGroupButtons(newsData);
    } catch (error) {
        // Handle errors if unable to fetch news data
        console.error('Error fetching news data:', error);
        document.getElementById('loadingMessage').innerHTML = 'Error fetching news data. Please try again later.';
    }
}

// Function to display news grouped by category
function displayGroupedNews(newsData) {
    const newsContainer = document.getElementById('newsContainer');
    const groupedNews = groupNewsByCategory(newsData);

    // Loop through grouped news data and create containers for each group
    for (const [groupName, categories] of Object.entries(groupedNews)) {
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('categoryGroup');
        groupContainer.id = groupName; 
        groupContainer.innerHTML = `<h2>${groupName}</h2>`;

        // Loop through categories and filter news data based on category
        categories.forEach(category => {
            const categoryEntries = newsData.filter(entry => entry.Categories.includes(category));

            // Create news item for each entry in the category
            categoryEntries.forEach(entry => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('newsItem');
                newsItem.innerHTML = `
                    <h3>${entry.Title}</h3>
                    <img class="news-image" src="${entry.Image}" alt="News Image">
                    <p>Date: ${entry.Date}</p>
                    <p>Link: <a href="${entry.Link}" target="_blank">${entry.Link}</a></p>
                    <p>Description: ${entry.Content}</p>
                    <p>Category: ${entry.Categories.join(', ')}<p>
                `;
                groupContainer.appendChild(newsItem);
            });
        });

        // Append group container to news container
        newsContainer.appendChild(groupContainer);
    }
}

// Function to group news data by category
function groupNewsByCategory(newsData) {
    const groupedNews = {
        'Aktual': ['Hadisə', 'Aktual'],
        'Sənaye': ['Biznes', 'Sənaye və energetika', 'Maliyyə', 'Energetika'],
        'Dünya': ['Xarici siyasət', 'Avropa', 'Asiya', 'Amerika', 'Afrika', 'Dünya', 'Digər ölkələr', 'Region', 'MDB'],
        'Mədəniyyət': ['Mədəniyyət siyasəti', 'Ədəbi̇yyat'],
        'İdman': ['Futbol', 'İdman'],
        'Gündəlik': ['Sosial', 'Birja', 'Sərgi', 'Təhsil', 'Fərdi', 'Sağlamlıq'],
        'Ölkə': ['İnfrastruktur', 'Ölkə', 'İKT', 'Milli Məclis']
    };

    return groupedNews;
}

// Function to create group buttons
function createGroupButtons(newsData) {
    const groupNames = Object.keys(groupNewsByCategory(newsData));
    const buttonsContainer = document.getElementById('categoryButtons');

    // Loop through group names and create buttons for each group
    groupNames.forEach(groupName => {
        const button = document.createElement('button');
        button.textContent = groupName;
        button.addEventListener('click', () => filterNewsByGroup(groupName));
        buttonsContainer.appendChild(button);
    });
}

// Function to filter news by group
function filterNewsByGroup(groupName) {
    const groupContainer = document.getElementById(groupName);
    if (groupContainer) {
        // Hide all other group containers
        const allGroups = document.querySelectorAll('.categoryGroup');
        allGroups.forEach(group => {
            group.style.display = 'none';
        });

        // Show the selected group container
        groupContainer.style.display = 'block';

        // Hide all news items except those in the selected group
        const allNewsItems = document.querySelectorAll('.newsItem');
        allNewsItems.forEach(item => {
            item.style.display = 'none';
        });

        const categoryNewsItems = groupContainer.querySelectorAll('.newsItem');
        categoryNewsItems.forEach(item => {
            item.style.display = 'block';
        });
    }
}

// Function to search news
function searchNews(event) {
    event.preventDefault(); 
    const searchTerm = document.getElementById('searchInputField').value.toLowerCase();
    const newsItems = document.querySelectorAll('.newsItem');

    // Show all news items
    newsItems.forEach(item => {
        item.style.display = 'block';
    });

    // Hide news items that don't match search term
    newsItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        if (!itemText.includes(searchTerm)) {
            item.style.display = 'none';
        }
    });

    // Show only groups containing visible news items
    const allGroups = document.querySelectorAll('.categoryGroup');
    allGroups.forEach(group => {
        const groupNewsItems = group.querySelectorAll('.newsItem');
        const visibleItems = Array.from(groupNewsItems).some(item => item.style.display === 'block');
        group.style.display = visibleItems ? 'block' : 'none';
    });
}

// Fetch news data when the page loads
window.onload = fetchNews;

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
