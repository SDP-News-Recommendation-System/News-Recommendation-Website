const apiKey = "4c1a01c57bb24da786855cca3bd3cb1c";
const newsContainer = document.getElementById("newsContainer");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

searchForm.addEventListener('submit', retrieve);

function retrieve(e) {
    e.preventDefault();

    const selectedCategories = Array.from(categoryCheckboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

    fetchAndDisplayNews(selectedCategories, searchInput.value);
}

const categories = {
    sports: "https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=4c1a01c57bb24da786855cca3bd3cb1c",
    business: "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=4c1a01c57bb24da786855cca3bd3cb1c",
    entertainment: "https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=4c1a01c57bb24da786855cca3bd3cb1c",
    technology: "https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=4c1a01c57bb24da786855cca3bd3cb1c",
};

categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        fetchAndDisplayNews(selectedCategories, searchInput.value);
    });
});

async function fetchAndDisplayNews(selectedCategories, searchQuery = "") {
    newsContainer.innerHTML = "";

    if (searchQuery !== '') {

        const searchURL = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}`;
        fetchNewsForCategory(searchURL);
    }

    selectedCategories.forEach((category) => {
        const categoryURL = categories[category];
        fetchNewsForCategory(categoryURL);
    });
}

async function fetchNewsForCategory(url) {
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
            newsContainer.innerHTML += `<p>No information available for this category.</p>`;
        }
    } catch (error) {
        console.error("ERROR", error);
        newsContainer.innerHTML += "<p>ERROR</p>";
    }
}
