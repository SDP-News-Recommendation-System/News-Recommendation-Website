async function fetchNews() {
    try {
        document.getElementById('loadingMessage').style.display = 'block';

        const response = await fetch('news_data.json');
        const newsData = await response.json();

        document.getElementById('loadingMessage').style.display = 'none';

        displayNews(newsData);
    } catch (error) {
        console.error('Error fetching news data:', error);
        document.getElementById('loadingMessage').innerHTML = 'Error fetching news data. Please try again later.';
    }
}

function displayNews(newsData) {
    const newsContainer = document.getElementById('newsContainer');

    newsContainer.innerHTML = '';

    newsData.forEach(entry => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('newsItem');
        newsItem.innerHTML = `
            <h3>${entry.Title}</h3>
            <p>Date: ${entry.Date}</p>
            <p>Link: <a href="${entry.Link}" target="_blank">${entry.Link}</a></p>
            <p>Content: ${entry.Content}</p>
            <p>Category: ${entry.Categories}<p>
            ${entry.Image ? `<img src="${entry.Image}" alt="News Image">` : ''}
        `;
        newsContainer.appendChild(newsItem);
    });
}

window.onload = fetchNews;