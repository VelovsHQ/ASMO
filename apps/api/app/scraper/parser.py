from datetime import datetime


def parse_entry(entry):
    return {
        "title": entry.get("title"),
        "content": entry.get("summary", ""),
        "url": entry.get("link"),
        "published_at": datetime.utcnow(),
    }