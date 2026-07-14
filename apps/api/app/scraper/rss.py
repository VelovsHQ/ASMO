import feedparser

from app.scraper.parser import parse_entry
from app.services.article_service import ArticleService

RSS_URL = "https://www.cnbc.com/id/100003114/device/rss/rss.html"

feed = feedparser.parse(RSS_URL)

print(f"Found {len(feed.entries)} articles")

for entry in feed.entries:

    article = parse_entry(entry)

    if ArticleService.exists(article["url"]):
        continue

    ArticleService.create(
        source_id=1,
        **article,
    )

print("Finished.")