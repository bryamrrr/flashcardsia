from database import base
from sqlalchemy import Column, Integer, String


class Docs(base):
    __tablename__ = "documents"

    id_ = Column(Integer, primary_key=True, index=True)
    raw_text = Column(String)
    created_at = Column(String)
