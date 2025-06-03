from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = 'sqlite:///./flashcardsai.db'
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

# For PosrgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost/flash_cards_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)


session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()
