from bs4 import BeautifulSoup

def parse_news(html:str) -> list[dict]:
    soup = BeautifulSoup(html, "lxml")
    news = []

    for article in soup.select(".news-card"):
        title_tag = article.find("h2")
        date_tag = article.find(class_ = "date")
        content_tag = article.find("p")

        if not (title_tag and date_tag and content_tag):
            continue

        news.append({
            "title" : title_tag.text.strip(),
            "date" : date_tag.text.strip(),
            "content" : content_tag.text.strip()
        })
    return news


# This is a Dummy like WEB scraper build for the specific website to scrape infomation out of 
# there is a huge issue I came across This is not universal and will not work for other websites as the structure of the website is different
#  and the tags used are different so this is a very specific scraper for this website only :/

