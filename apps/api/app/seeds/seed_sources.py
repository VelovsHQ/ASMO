from app.db.session import SessionLocal
from app.models.source import Source

db = SessionLocal()

sources = [
    {
        "name": "Reuters",
        "website_url": "https://www.reuters.com",
        "rss_url": "https://feeds.reuters.com/reuters/businessNews",
        "country": "Global",
        "language": "en",
    },
    {
        "name": "Bloomberg",
        "website_url": "https://www.bloomberg.com",
        "rss_url": None,
        "country": "Global",
        "language": "en",
    },
    {
        "name": "CNBC",
        "website_url": "https://www.cnbc.com",
        "rss_url": "https://www.cnbc.com/id/100003114/device/rss/rss.html",
        "country": "USA",
        "language": "en",
    },
]

for item in sources:
    exists = db.query(Source).filter_by(name=item["name"]).first()

    if not exists:
        db.add(Source(**item))

db.commit()

print("Sources seeded successfully!")