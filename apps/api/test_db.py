from sqlalchemy import text

from app.db.database import engine

with engine.connect() as conn:
    version = conn.execute(text("SELECT version();"))
    print(version.scalar())