# Multilingual News Website README

This repository contains the source code for a multilingual news website designed to display news articles in both English and Azerbaijani languages. The website fetches news from the News API for English articles and performs web scraping for Azerbaijani articles from popular Azerbaijani news websites such as apa.az, modern.az, and report.az.

## Features

### Language Selection
- Users can switch between English and Azerbaijani versions of the website.
- Language selection is available through a language menu at the top of the website.

### Navigation
- Navigation options include "About Us" and "Contact Us" pages.
- Users can easily navigate through the website to access additional information and contact details.

### Filtering
- News articles can be filtered by categories which are sports, business, entertainment, technology in English version and "aktual", "sənaye", "dünya", "mədəniyyət", "idman", "gündəlik", "ölkə" in Azerbaijani version. 
- Users can search for specific keywords to find relevant articles.

### Weather Information
- Current weather information for the user's location is displayed on both versions of the website.
- Weather data is obtained from the OpenWeatherMap API.

## File Structure

- **index.html**: Main HTML file for the English version of the website.
- **local.html**: HTML file for the Azerbaijani version of the website.
- **aboutus.html**: About Us page providing information about the project.
- **contactus.html**: Contact Us page with a form for users to submit inquiries.
- **haqqimizda.html**: About Us page for the Azerbaijani version of the website.
- **elaqe.html**: Contact Us page for the Azerbaijani version of the website.
- **s.css**: Stylesheet for the English version of the website.
- **style.css**: Stylesheet for the Azerbaijani version of the website.
- **script.js**: JavaScript file handling functionality for the English version.
- **script2.js**: JavaScript file handling functionality for the Azerbaijani version.
- **news_data.json**: JSON file containing news data for the Azerbaijani version.
- **news_scraper.py**: Python script for web scraping news articles from Azerbaijani news websites.

## Getting Started

To run the website locally:

1. Clone this repository to your local machine.
2. Open the `index.html` file in a web browser to view the English version or `local.html` for the Azerbaijani version.
3. Navigate through the website using the provided links and buttons.

## Dependencies

- **News API**: The website utilizes the News API to fetch English news articles. An API key is required for accessing the News API.
- **OpenWeatherMap API**: Current weather information is obtained using the OpenWeatherMap API. An API key is required for accessing weather data.
- **Python 3**: The web scraping functionality for fetching Azerbaijani news articles requires Python 3.

## Web Scraping for Azerbaijani News

The `news_scraper.py` script utilizes web scraping techniques to extract news articles from the following Azerbaijani news websites:
- [apa.az](https://apa.az)
- [modern.az](https://modern.az)
- [report.az](https://report.az)

The script retrieves news articles, including their titles, categories, publication dates, and content, and saves them into the `news_data.json` file for display on the Azerbaijani version of the website.

