from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.article import Article

from app.services.ai_service import analyze_article


db = SessionLocal()

article = db.scalar(select(Article).limit(1))

print(article.title)

result = analyze_article(
    article.title,
    article.content,
)

print(result)