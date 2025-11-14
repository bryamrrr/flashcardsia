from .database import base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime


class User(base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Docs(base):
    __tablename__ = "documents"

    id_ = Column(Integer, primary_key=True, index=True)
    raw_text = Column(String)
    created_at = Column(String)
