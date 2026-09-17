import uuid

from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.core.database import Base


class Recording(Base):
    __tablename__ = "recordings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = Column(String(255), nullable=False)

    filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    duration = Column(Integer, nullable=True)

    status = Column(String(50), default="uploaded")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )