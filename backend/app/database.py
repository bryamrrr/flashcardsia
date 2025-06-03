from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = 'sqlite:///./flashcardsai.db'

############################################For MYSQL 
#SQLALCHEMY_DATABASE_URL = 'mysql+pymysql://root:test1234!@127.0.0.1:3306/TodoApplicationDatabase'
#engine = create_engine(SQLALCHEMY_DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()

