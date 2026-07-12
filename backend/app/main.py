from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(title="TransitOps API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
def health_check():
    """Simple health check endpoint to verify the API is running."""
    return {"status": "ok", "message": "TransitOps API is running smoothly!"}