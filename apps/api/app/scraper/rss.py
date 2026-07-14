from app.scraper.service import fetch_feed

RSS_URL = "https://www.cnbc.com/id/100003114/device/rss/rss.html"

entries = fetch_feed(RSS_URL)

print(f"Found {len(entries)} articles\n")

for article in entries[:5]:
    print(article.title)