const weatherInfoContainer = document.getElementById("weather-info");

async function fetchNews() {
    try {
        document.getElementById('loadingMessage').style.display = 'block';

        const response = await fetch('news_data.json');
        const newsData = await response.json();

        document.getElementById('loadingMessage').style.display = 'none';

        displayGroupedNews(newsData);
        createGroupButtons(newsData);
    } catch (error) {
        console.error('Error fetching news data:', error);
        document.getElementById('loadingMessage').innerHTML = 'Error fetching news data. Please try again later.';
    }
}

function displayGroupedNews(newsData) {
    const newsContainer = document.getElementById('newsContainer');
    const groupedNews = groupNewsByCategory(newsData);

    for (const [groupName, categories] of Object.entries(groupedNews)) {
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('categoryGroup');
        groupContainer.id = groupName; 
        groupContainer.innerHTML = `<h2>${groupName}</h2>`;

        categories.forEach(category => {
            const categoryEntries = newsData.filter(entry => entry.Categories.includes(category));

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

        newsContainer.appendChild(groupContainer);
    }
}





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

function createGroupButtons(newsData) {
    const groupNames = Object.keys(groupNewsByCategory(newsData));
    const buttonsContainer = document.getElementById('categoryButtons');

    groupNames.forEach(groupName => {
        const button = document.createElement('button');
        button.textContent = groupName;
        button.addEventListener('click', () => filterNewsByGroup(groupName));
        buttonsContainer.appendChild(button);
    });
}

function filterNewsByGroup(groupName) {
    const groupContainer = document.getElementById(groupName);
    if (groupContainer) {
        const allGroups = document.querySelectorAll('.categoryGroup');
        allGroups.forEach(group => {
            group.style.display = 'none';
        });

        groupContainer.style.display = 'block';

        
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


function searchNews(event) {
    event.preventDefault(); 
    const searchTerm = document.getElementById('searchInputField').value.toLowerCase();
    const newsItems = document.querySelectorAll('.newsItem');

    newsItems.forEach(item => {
        item.style.display = 'block';
    });

    newsItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        if (!itemText.includes(searchTerm)) {
            item.style.display = 'none';
        }
    });

  
    const allGroups = document.querySelectorAll('.categoryGroup');
    allGroups.forEach(group => {
        group.style.display = 'block';

         const groupNewsItems = group.querySelectorAll('.newsItem');
        const visibleItems = Array.from(groupNewsItems).some(item => item.style.display === 'block');
        group.style.display = visibleItems ? 'block' : 'none';
    });
}




window.onload = fetchNews;

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


