// Get reference to the weather info container
const weatherInfoContainer = document.getElementById("weather-info");

async function fetchNews() {
    try {
        // Clear the news container
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';

        // Show loading message
        document.getElementById('loadingMessage').style.display = 'block';

        // Fetch news data from JSON file
        const response = await fetch('news_data.json');
        const newsData = await response.json();

        // Hide loading message after fetching data
        document.getElementById('loadingMessage').style.display = 'none';


        // Display other categories grouped
        displayGroupedNews(newsData);
    } catch (error) {
        // Handle errors if unable to fetch news data
        console.error('Error fetching news data:', error);
        document.getElementById('loadingMessage').innerHTML = 'Error fetching news data. Please try again later.';
    }
}

const breakingNewsContainer = document.getElementById('breakingNewsContainer');
const newsContainer = document.getElementById('newsContainer');

function displayGroupedNews(newsData) {

    // Clear the news containers
    newsContainer.innerHTML = '';
    breakingNewsContainer.innerHTML = '';

    // Display breaking news categories without categorization
    const breakingNewsCategories = ['Hadisə', 'Aktual', 'Gündəm', 'Cəmiyyət', 'Kriminal'];
    breakingNewsCategories.forEach(category => {
        const categoryEntries = newsData.filter(entry => entry.Categories.includes(category));

        // Create news item for each entry in the category
        categoryEntries.forEach(entry => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('newsItem');
            newsItem.innerHTML = `
                <h3>${entry.Title}</h3>
                <img class="news-image" src="${entry.Image}" alt="News Image">
                <h4>${entry.Date}</h4>
                <p><span class="more-link">Click for more info...</span></p>
                `;

                const moreLink = newsItem.querySelector('.more-link');
                moreLink.addEventListener('click', () => {
                    window.open(entry.Link, '_blank');
                });
            breakingNewsContainer.appendChild(newsItem);
        });
    });

    // Display other categories grouped
    const groupedNews = groupNewsByCategory(newsData);

    for (const [groupName, categories] of Object.entries(groupedNews)) {
        if (!breakingNewsCategories.includes(groupName)) {
            const groupContainer = document.createElement('div');
            groupContainer.classList.add('categoryGroup');
            groupContainer.id = groupName;
    
            // Loop through categories and filter news data based on category
            categories.forEach(category => {
                const categoryEntries = newsData.filter(entry => entry.Categories.includes(category));
    
                // Create news item for each entry in the category
                categoryEntries.forEach(entry => {
                    const truncatedTitle = entry.Title.length > 100 ? entry.Title.substring(0, 100) + "..." : entry.Title;
    
                    const newsItem = document.createElement('div');
                    newsItem.classList.add('newsItem');
                    const imageUrl = entry.Image ? entry.Image : '../images/INN.png';

                    newsItem.innerHTML = `
                    <h3>${truncatedTitle}</h3>
                    <img class="news-image" src="${entry.Image}" alt="News Image">
                    <h4>${entry.Date}</h4>
                    <p><span class="more-link">Click for more info...</span></p>
                    `;
    
                    const moreLink = newsItem.querySelector('.more-link');
                    moreLink.addEventListener('click', () => {
                        window.open(entry.Link, '_blank');
                    });
    
                    groupContainer.appendChild(newsItem);
                });
            });
    
            // Append group container to news container
            newsContainer.appendChild(groupContainer);
        }
    }
}    

// Function to group news data by category
function groupNewsByCategory(newsData) {
    const groupedNews = {
        'Sənaye': ['Biznes', 'Sənaye və energetika', 'Maliyyə', 'Energetika'],
        'Dünya': ['Xarici siyasət', 'Avropa', 'Asiya', 'Amerika', 'Afrika', 'Dünya', 'Digər ölkələr', 'Region', 'MDB'],
        'Mədəniyyət': ['Mədəniyyət siyasəti', 'Ədəbi̇yyat'],
        'İdman': ['Futbol', 'İdman']
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

async function searchNews(event) {
    event.preventDefault(); // Prevent form submission

    // Get the search term from the input field
    const searchTerm = document.getElementById('search-input').value.trim().toLowerCase();

    try {
        // Fetch news data from JSON file
        const response = await fetch('news_data.json');
        const newsData = await response.json();

        // Filter news items based on the search term
        const filteredNews = newsData.filter(entry => {
        const title = entry.Title.toLowerCase();
        const url = entry.Link.toLowerCase(); // Assuming the URL is stored in the "Link" property
        const urlWords = url.split('-'); // Split the URL into words
        return title.includes(searchTerm) || urlWords.some(word => word.startsWith(searchTerm));
        });


        // Hide breakingNewsContainer
        const breakingNewsContainer = document.getElementById('breakingNewsContainer');
        breakingNewsContainer.style.display = 'none';

        // Display filtered news
        displaySearchResults(filteredNews);
    } catch (error) {
        // Handle errors if unable to fetch news data
        console.error('Error fetching news data:', error);
    }
}

// Function to display search results
function displaySearchResults(searchData) {
    const newsContainer = document.getElementById('newsContainer');
    
    // Clear previous search results
    newsContainer.innerHTML = '';

    // Check if there are search results
    if (searchData && searchData.length > 0) {
        // Display search results
        searchData.forEach(entry => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('newsItem');

            // Check if entry.Image is available, otherwise use default image
            const imageUrl = entry.Image ? entry.Image : '../images/INN.png';

            newsItem.innerHTML = `
                <h3>${entry.Title}</h3>
                <img class="news-image" src="${imageUrl}" alt="News Image">
                <h4>${entry.Date}</h4>
                <p><span class="more-link">Click for more info...</span></p>
                `;

                const moreLink = newsItem.querySelector('.more-link');
                moreLink.addEventListener('click', () => {
                    window.open(entry.Link, '_blank');
                });
            newsContainer.appendChild(newsItem);
        });
        
        // Make newsContainer visible
        newsContainer.style.display = 'block';
    } else {
        // If no search results, display a message
        newsContainer.innerHTML = '<p>No results found.</p>';
        
        // Make newsContainer visible
        newsContainer.style.display = 'block';
    }
}


// Event listener for the search form
document.getElementById('search-form').addEventListener('submit', searchNews);


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
        icon = "<img src='../images/sun.png' alt='Sun' class='weather-icon'>";
    } else if (description.includes("cloud")) {
        icon = "<img src='../images/broken.png' alt='Broken' class='weather-icon'>";
    }else if (description.includes("cloud")) {
        icon = "<img src='../images/cloud.png' alt='Cloud' class='weather-icon'>";
    } else if (description.includes("rain")) {
        icon = "<img src='../images/rain.png' alt='Rain' class='weather-icon'>";
    } else if (description.includes("cloud")) {
        icon = "<img src='../images/snowy.png' alt='Snowy' class='weather-icon'>";
    } else if (description.includes("storm") || description.includes("thunder")) {
        icon = "<img src='../images/storm.png' alt='Storm' class='weather-icon'>";
    } else {
        icon = "<img src='../images/default.png' alt='Default' class='weather-icon'>";
    }
    return icon;
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

// Function to apply date range filter
function applyDateRangeFilter(startDate, endDate) {
    // Fetch and display news based on date range
    fetchNewsByDateRange(startDate, endDate);
}

// Function to fetch news based on date range
async function fetchNewsByDateRange(startDate, endDate) {
    try {
        // Show loading message
        document.getElementById('loadingMessage').style.display = 'block';

        // Fetch news data from JSON file
        const response = await fetch('news_data.json');
        const newsData = await response.json();

        // Parse start and end dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Filter news based on date range
        const filteredNews = newsData.filter(entry => {
            const entryDate = new Date(entry.Date);
            const entryTime = entryDate.getTime();
            return entryTime >= start.getTime() && entryTime <= end.getTime();
        });

        // Hide breaking news container
        const breakingNewsContainer = document.getElementById('breakingNewsContainer');
        breakingNewsContainer.style.display = 'none';

        // Clear news container
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';

        // Display filtered news
        displayFilteredNews(filteredNews);

        // Show news container
        newsContainer.style.display = 'block';

        // Hide loading message after fetching data
        document.getElementById('loadingMessage').style.display = 'none';
    } catch (error) {
        // Handle errors if unable to fetch news data
        console.error('Error fetching news data:', error);
        document.getElementById('loadingMessage').innerHTML = 'Error fetching news data. Please try again later.';
    }
}


// Function to filter news by category
function filterNewsByCategory(category) {
    const newsItems = document.querySelectorAll('.newsItem');

    // Show all news items
    newsItems.forEach(item => {
        item.style.display = 'block';
    });

    // Hide news items that don't match the selected category
    if (category) {
        newsItems.forEach(item => {
            const itemCategory = item.parentNode.id; // Get the category of the news item
            if (itemCategory !== category) {
                item.style.display = 'none';
            }
        });
    }

    // Toggle display of the news container based on whether any news items are visible
    const visibleNewsItems = document.querySelectorAll('.newsItem[style="display: block;"]');
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.style.display = visibleNewsItems.length > 0 ? 'block' : 'none';
}


// Event listener for category buttons
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.value;
        filterNewsByCategory(category);
    });
});


// Function to display filtered news
function displayFilteredNews(newsData) {
    const newsContainer = document.getElementById('newsContainer');

    // Clear news container
    newsContainer.innerHTML = '';

    // Display filtered news
    newsData.forEach(entry => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('newsItem');
        newsItem.innerHTML = `
            <h3>${entry.Title}</h3>
            <img class="news-image" src="${entry.Image}" alt="News Image">
            <h4>${entry.Date}</h4>
            <p><span class="more-link">Click for more info...</span></p>
                `;

                const moreLink = newsItem.querySelector('.more-link');
                moreLink.addEventListener('click', () => {
                    window.open(entry.Link, '_blank');
                });
        newsContainer.appendChild(newsItem);
    });
}



// Function to filter news by source
function filterNewsBySource(source) {
    const newsItems = document.querySelectorAll('.newsItem');

    // Show all news items
    newsItems.forEach(item => {
        item.style.display = 'block';
    });

    // Hide news items that don't match the selected source
    if (source) {
        newsItems.forEach(item => {
            const itemSource = item.querySelector('a').getAttribute('href');
            if (!itemSource.includes(source)) {
                item.style.display = 'none';
            }
        });
    }
}

// Event listener for source filter
document.getElementById('source-filter').addEventListener('change', function() {
    const selectedSource = this.value;
    filterNewsBySource(selectedSource);
});

// JavaScript to toggle sidebar when menu icon is clicked
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");}
    // Load JSON data
fetch('sources.json')
.then(response => response.json())
.then(data => {
    createCustomSelect(data);
})
.catch(error => console.error('Error fetching JSON:', error));

// Function to create custom select dropdown
function createCustomSelect(optionsData) {
const selectButton = document.querySelector('.select-button');
const selectDropdown = document.querySelector('.select-dropdown');

}



//Function to filter news by source
function filterSidebar(source) {
    const newsItems = document.querySelectorAll('.newsItem');

    // Show all news items
    newsItems.forEach(item => {
        item.style.display = 'block';
    });

    // Hide news items that don't match the selected source
    if (source) {
        newsItems.forEach(item => {
            const itemSource = item.querySelector('a').getAttribute('href');
            if (!itemSource.includes(source)) {
                item.style.display = 'none';
            }
        });
    }
}
// Function to initialize the custom select
function initCustomSelect() {
    // Call the creation of custom select after fetching JSON
    createCustomSelect();
}

// Call the initialization function
initCustomSelect();
