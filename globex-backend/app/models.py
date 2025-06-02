from sqlalchemy import Column, String, DateTime
from .database import Base

class ScheduledDelivery(Base):
    __tablename__ = "scheduled_deliveries"

    tracking_id = Column(String, primary_key=True, index=True)
    scheduled_date = Column(DateTime)
