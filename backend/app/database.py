#database.pyfrom sqlalchemy import create_engine

from decouple import config

from pymongo import MongoClient

def dbconnection():
	SERVER = config("db_host")
	PORT = '1433'
	# PORT = '1434'
	DATABASE = config("db_name")
	USERNAME = config("db_username")
	PASSWORD = config("db_password")
	TRUST = 'yes'

	
	client = MongoClient(SERVER)
	# client = AsyncIOMotorClient(SERVER)
	
	# connectionString = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={SERVER},{PORT};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD};TrustServerCertificate={TRUST}'
	# 'mongodb://your_username:your_password@your_host:your_port/your_database'
	# conn = pyodbc.connect(connectionString)
	

	return client