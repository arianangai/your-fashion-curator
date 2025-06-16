# app/controllers.py

from . import schemas
import hashlib
import json
# import pandas as pd
from datetime import datetime

# Function to return the sql results as a dict. 
# It also maps the column names and values for the dict
# Returns no results found if there are no records
def mssql_result2dict(cursor):
	try: 
		result = []
		columns = [column[0] for column in cursor.description]
		for row in  cursor.fetchall():
			result.append(dict(zip(columns,row)))

		# print(result)

		#Check for results
		if len(result) > 0:
			ret = result
		else:
			ret = {"message": "No result"}
	except Exception as e:
		print(e)
		ret = { "message": "Internal Database Query Error"}
	
	return ret

def is_valid_session(client):
# Run the ping command
	try:
		client.admin.command('ping')
		print("Connection is valid.")
		# Perform your MongoDB operations here
	except Exception as ex:
		print(f"Error: {ex}")
		print("Connection is not valid.")
	finally:
		# Close the connection
		client.close()
