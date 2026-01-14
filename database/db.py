from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker 


DATABASE_URL = "sqlite:///./database/Users.db"


engine = create_engine(DATABASE_URL , connect_args = {"check_same_thread" : False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()

class User(Base):
    __tablename__ = "User" 
    
    id = Column(Integer , primary_key=True , autoincrement=True , index=True)
    name = Column(String) 
    role = Column(String)
    skills = Column(String)
    
    
def init_db():
    Base.metadata.create_all(bind= engine)