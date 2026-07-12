from datetime import date

from fastapi import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.driver import Driver, DriverStatus
from app.schemas.driver import DriverCreate, DriverUpdate


async def create_driver(payload: DriverCreate, session: AsyncSession) -> Driver:
    result = await session.exec(select(Driver).where(Driver.license_number == payload.license_number))
    if result.first():
        raise HTTPException(status_code=400, detail="Driver with this license number already exists")

    driver = Driver(**payload.model_dump())
    session.add(driver)
    await session.commit()
    await session.refresh(driver)
    return driver


async def list_drivers(session: AsyncSession, status: DriverStatus | None = None) -> list[Driver]:
    query = select(Driver)
    if status:
        query = query.where(Driver.status == status)
    result = await session.exec(query)
    return result.all()


async def get_driver(driver_id: int, session: AsyncSession) -> Driver:
    driver = await session.get(Driver, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver


async def update_driver(driver_id: int, payload: DriverUpdate, session: AsyncSession) -> Driver:
    driver = await get_driver(driver_id, session)
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(driver, field, value)
    session.add(driver)
    await session.commit()
    await session.refresh(driver)
    return driver


async def set_driver_status(driver_id: int, new_status: DriverStatus, session: AsyncSession) -> Driver:
    driver = await get_driver(driver_id, session)
    driver.status = new_status
    session.add(driver)
    await session.commit()
    await session.refresh(driver)
    return driver


def ensure_driver_dispatchable(driver: Driver) -> None:
    if driver.status in (DriverStatus.on_trip, DriverStatus.suspended):
        raise HTTPException(status_code=400, detail="Driver is not available for dispatch")
    if driver.license_expiry_date < date.today():
        raise HTTPException(status_code=400, detail="Driver license has expired")
