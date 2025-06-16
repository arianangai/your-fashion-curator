# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
from .database import dbconnection
from decouple import config

# SQLite database for development
# SQLALCHEMY_DATABASE_URL = "sqlite:///./fashion_platform.db"

# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


def openconnection():
	client = dbconnection()

	DATABASE = config("db_name")
	db = client[DATABASE]
	# # Query the server
	# server_status = db.command("serverStatus")

	# # Print information about the connection pool
	# print("Connection Pool Status:")
	# print("Total Connections:", server_status["connections"]["totalCreated"])
	# print("Current Connections:", server_status["connections"]["current"])
	# print("Available Connections in Pool:", server_status["connections"]["available"])
	return client,db
