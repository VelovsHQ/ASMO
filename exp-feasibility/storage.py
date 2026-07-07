import json

def save_json(news: list[dict], path: str = "news.json"):
    with open(path, "w") as f:
        json.dump(news, f, indent=4)

        