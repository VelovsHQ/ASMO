from email.utils import parsedate_to_datetime


def parse_entry(entry):

    published = entry.get("published")

    if published:
        published = parsedate_to_datetime(published)
    else:
        published = None

    return {
        "title": entry.get("title"),
        "content": entry.get("summary", ""),
        "url": entry.get("link"),
        "published_at": published,
    }