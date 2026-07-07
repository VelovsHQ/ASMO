from scraper import fetch_html
from parser import parse_news
from classifier import categorize
from storage import save_json

URL = "http://host.docker.internal:5500/exp-feasibility/index.html"

def run():
    html = fetch_html(URL)
    news = parse_news(html)

    for item in news:
        item["category"] = categorize(item["content"])

    save_json(news)
    print(f"Scraped {len(news)} articles → news.json")

if __name__ == "__main__":
    run()