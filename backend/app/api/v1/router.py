from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    vehicle,
    driver,
    trip,
    maintenance,
    fuel_expense,
    reports,
    dashboard,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(vehicle.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(driver.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(trip.router, prefix="/trips", tags=["trips"])
api_router.include_router(maintenance.router, prefix="/maintenance", tags=["maintenance"])
api_router.include_router(fuel_expense.router, prefix="/fuel-expenses", tags=["fuel-expenses"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])