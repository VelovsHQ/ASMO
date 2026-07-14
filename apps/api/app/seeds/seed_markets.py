from app.db.session import SessionLocal
from app.models.market import Market

db = SessionLocal()

markets = [
    ("Gold", "XAU", "Commodity"),
    ("Silver", "XAG", "Commodity"),
    ("Crude Oil", "WTI", "Commodity"),
    ("Natural Gas", "NG", "Commodity"),
    ("S&P 500", "SPX", "Equity"),
    ("NASDAQ", "IXIC", "Equity"),
    ("Dow Jones", "DJI", "Equity"),
    ("Bitcoin", "BTC", "Crypto"),
    ("Ethereum", "ETH", "Crypto"),
    ("USD Index", "DXY", "Forex"),
]

for name, symbol, category in markets:
    exists = db.query(Market).filter_by(symbol=symbol).first()

    if not exists:
        db.add(
            Market(
                name=name,
                symbol=symbol,
                category=category,
            )
        )

db.commit()

print("Markets seeded successfully!")