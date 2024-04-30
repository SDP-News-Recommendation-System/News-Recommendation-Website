import os
import feedparser
import json
import requests
from bs4 import BeautifulSoup
import random

def get_image_from_article_page(article_url):
    try:
        response = requests.get(article_url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Try to find the image using Open Graph Protocol tags
        og_image = soup.find('meta', property='og:image')
        image_url = og_image['content'] if og_image else None

        return image_url
    except Exception as e:
        print(f"An error occurred while fetching the image: {e}")
        return None

def get_news_rss(feed_url, output_folder, output_file):
    try:
        feed = feedparser.parse(feed_url)
        news_data = []

        output_path = os.path.join(output_folder, output_file)

        try:
            with open(output_path, 'r', encoding='utf-8') as json_file:
                existing_data = json.load(json_file)
        except (FileNotFoundError, json.JSONDecodeError):
            existing_data = []

        for entry in feed.entries:
            entry_data = {
                "Title": entry.title,
                "Link": entry.link,
                "Date": entry.published,
                "Content": entry.get("summary", "")
            }

            if 'tags' in entry:
                entry_data["Categories"] = [tag.term for tag in entry.tags]

            article_image = get_image_from_article_page(entry.link)
            if article_image:
                entry_data["Image"] = article_image

            news_data.append(entry_data)

        combined_data = existing_data + news_data

        random.shuffle(combined_data)

        with open(output_path, 'w', encoding='utf-8') as json_file:
            json.dump(combined_data, json_file, ensure_ascii=False, indent=2)

        print(f"Shuffled data written to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

rss_feed_urls = [
    "https://apa.az/rss",
    "https://modern.az/rss",
    "https://moderator.az/rss",
    "https://sumqayitxeber.com/rss",
]

output_folder = r"C:\Users\Hp-P\OneDrive - ADA University\Desktop\NEWS WP"
output_json_file = "news_data.json"

for rss_feed_url in rss_feed_urls:
    get_news_rss(rss_feed_url, output_folder, output_json_file)