# from sqlalchemy import create_engine
# from sqlalchemy.orm import declarative_base, sessionmaker
# import os
# from dotenv import load_dotenv
# load_dotenv()


# DB_HOST = os.getenv("DB_HOST")
# DB_PASSWD = os.getenv("DB_PASSWD")
# DB_ROOT = os.getenv("DB_ROOT")
# DB_PORT = os.getenv("DB_PORT")
# DB_NAME= os.getenv("DB_NAME")

# # DATABASE_URL = "mysql+pymysql://root:nabin@localhost/stress_db"
# DATABASE_URL = f"mysql+pymysql://{DB_ROOT}:{DB_PASSWD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# engine = create_engine(
#     DATABASE_URL,
#     echo=True,          # shows SQL logs (good for debugging)
#     pool_pre_ping=True  # prevents connection timeout issues
# )

# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# Base = declarative_base()
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PASSWD = os.getenv("DB_PASSWD")
DB_ROOT = os.getenv("DB_ROOT")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# DATABASE_URL = "mysql+pymysql://root:nabin@localhost/stress_db"
DATABASE_URL = f"mysql+pymysql://{DB_ROOT}:{DB_PASSWD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(
    DATABASE_URL,
    echo=True,          # shows SQL logs (good for debugging)
    pool_pre_ping=True  # prevents connection timeout issues
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()
