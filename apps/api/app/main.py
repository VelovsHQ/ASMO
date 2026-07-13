from fastapi import FastAPI

app = FastAPI(title="ASMO API")


@app.get("/")
def root():
    return {"message": "ASMO API Running"}