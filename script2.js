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
                    <p>${entry.Date}</p>
                    <p><a href="${entry.Link}" target="_blank">${entry.Link}</a></p>
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
        'Aktual': ['Hadisə', 'Aktual','Gündəm', 'Cəmiyyət', 'Kriminal', 'Biznes', 'Sənaye və energetika', 'Maliyyə', 'Energetika', 'Xarici siyasət',
         'Avropa', 'Asiya', 'Amerika', 'Afrika', 'Dünya', 'Digər ölkələr', 'Region', 'MDB', 'Mədəniyyət siyasəti', 'Ədəbi̇yyat', 'Sosial', 'Birja', 
         'Sərgi', 'Təhsil', 'Fərdi', 'Sağlamlıq', 'Elm və Təhsil', 'Maraqlı', 'Şou-biznes', 'Yaşam', 'Müsahibə', 'Futbol', 'İdman', 
         'İnfrastruktur', 'Ölkə', 'İKT', 'Milli Məclis', 'Sumqayıt', 'Siyasət']
       
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

        // Filter news based on date range
        const filteredNews = newsData.filter(entry => {
            const entryDate = new Date(entry.Date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return entryDate >= start && entryDate <= end;
        });

        // Hide loading message after fetching data
        document.getElementById('loadingMessage').style.display = 'none';

        // Clear news container
        const newsContainer = document.getElementById('newsContainer');
        newsContainer.innerHTML = '';

        // Display filtered news
        displayFilteredNews(filteredNews);
    } catch (error) {
        // Handle errors if unable to fetch news data
        console.error('Error fetching news data:', error);
        document.getElementById('loadingMessage').innerHTML = 'Error fetching news data. Please try again later.';
    }
}


// Function to display filtered news
function displayFilteredNews(newsData) {
    const newsContainer = document.getElementById('newsContainer');

    // Loop through filtered news data and create news items
    newsData.forEach(entry => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('newsItem');
        newsItem.innerHTML = `
            <h3>${entry.Title}</h3>
            <img class="news-image" src="${entry.Image}" alt="News Image">
            <p>${entry.Date}</p>
            <p><a href="${entry.Link}" target="_blank">${entry.Link}</a></p>
        `;
        newsContainer.appendChild(newsItem);
    });
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
}

// Event listener for category buttons
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', function() {
        const category = this.value;
        filterNewsByCategory(category);
    });
});


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

var x, i, j, l, ll, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("news-filter");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
