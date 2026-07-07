KEYWORDS = {
    "Sports": ["football", "cricket", "match", "tournament"],
    "Politics": ["government", "president", "election", "minister"],
    "Technology": ["ai", "technology", "software", "startup"],
    "Business": ["market", "stock", "economy", "company"],
}

def categorize(text: str) -> str:
    text = text.lower()
    for category, keywords in KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return category
    return "General"

