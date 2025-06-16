# app/api.py

from fastapi import FastAPI, Body, Depends, HTTPException,Query,Header, File, UploadFile
from typing import List
from . import controllers, schemas
from datetime import datetime
from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import signJWT,decodeJWT
from .database import dbconnection
from customer import controllers as customer_controllers, schemas as customer_schemas
from bson.objectid import ObjectId
from typing import List, Optional



from typing import Dict, Any

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

from decouple import config

# # Allow all origins in development (update this in production)
origins = [
	"http://localhost:3000",
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["GET", "POST"],
	allow_headers=["*"],
)

# app = FastAPI()

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


# CUSTOMER
@app.post("/api/customer/create", tags=["customer"])
async def create_user(customer: customer_schemas.CreateCustomerModel =  Body(...)):
	conn = openconnection()
	if await customer_controllers.create_customer(conn[0],conn[1],customer):
		return { 'message': 'Success' }
	else:
		raise HTTPException(status_code=401, detail= "Failed")
	
@app.get("/api/garments", tags=["garment"])
async def get_garments():
	conn = openconnection()
	garment_data = await customer_controllers.get_garments(conn[0],conn[1])
	print("garment_data",garment_data)
	if garment_data:
		return { 'message': 'Success', 'garments': garment_data }
	else:
		raise HTTPException(status_code=401, detail= "Failed")

@app.post("/api/garment/create", tags=["garment"])
async def create_garment(image: UploadFile = File(...)):
	conn = openconnection()
	if await customer_controllers.create_garment(conn[0],conn[1],image):
		return { 'message': 'Success' }
	else:
		raise HTTPException(status_code=401, detail= "Failed")

@app.post("/api/customer/list/retrieve", tags=["customer"])
async def customer_listing(page:int,page_size:int):
	conn = openconnection()
	return await customer_controllers.retrieve_customer_listing(conn[0],conn[1],page,page_size)


@app.get("/api/customer/retrieve", tags=["user"])
async def template_add(customer_id):
	conn = openconnection()
	return await customer_controllers.retrieve_customer(conn[0],conn[1],customer_id)


@app.post("/api/customer/update", tags=["customer"])
async def update_customer(customer: customer_schemas.UpdateCustomerDetail =  Body(...)):
	conn = openconnection()
	if await customer_controllers.update_customer(conn[0],conn[1],customer):
		return { 'message': 'Success' }
	else:
		raise HTTPException(status_code=401, detail= "Failed")
	
@app.post("/api/customer/delete", tags=["customer"])
async def delete_customer(customer_id):
	conn = openconnection()
	if await customer_controllers.delete_customer(conn[0],conn[1],customer_id):
		return { 'message': 'Success' }
	else:
		raise HTTPException(status_code=401, detail= "Failed")
	
	

# OPTIONS
@app.get("/api/get/customeroptions")
async def get_customer_options(search,page: int, page_size: int ):
	conn = openconnection()
	return await customer_controllers.get_customer_options(conn[0],conn[1],search,page,page_size)

@app.get("/api/get/stateoptions")
async def get_state_options(search,page: int, page_size: int ):
	conn = openconnection()
	return await customer_controllers.get_state_options(conn[0],conn[1],search,page,page_size)


@app.get("/api/get/countryoptions")
async def get_country_options(search,page: int, page_size: int ):
	conn = openconnection()
	return await customer_controllers.get_country_options(conn[0],conn[1],search,page,page_size)

@app.get("/api/get/useroptions")
async def get_user_options(search,page: int, page_size: int ):
	conn = openconnection()
	return await customer_controllers.get_user_options(conn[0],conn[1],search,page,page_size)

	
	
@app.post("/api/upload/convert", dependencies=[Depends(JWTBearer())],tags=["upload"])
async def upload_convert(authorization: str = Header(...)):
	conn = openconnection()

	# Get company id
	token = authorization.split("Bearer ")[1]
	# print(token)
	decoded_token = decodeJWT(token)
	username = decoded_token["user_id"]
	# username = "tom"

	user_collection = conn[1]["client_user"]
	query = {"username": username}
	select_fields = {"company_id":1}

	company_doc = user_collection.find_one(query, select_fields)
	company_id = company_doc.get("company_id")

	uploaded_collection = conn[1][f"upload_{company_id}"]
	validation_collection = conn[1]["validation"]

	# Create a query to find the template by _id
	query = {"_id": ObjectId("666952b05c7584c9fde50dee")}
	
	# Use find_one to retrieve the template
	data = uploaded_collection.find_one(query)
	# print("data", data)

	if data:
		# Extract the type field
		doc_type = data.get("type", "")

		# Fetch the validation data
		validation_data_cursor = validation_collection.find()

		# Create a list to store the new field names (prefixes)
		new_field_names = []

		# Collect the new field names (prefixes) in order
		for document in validation_data_cursor:
			for key, item in document.items():
				if isinstance(item, dict) and "field_name" in item and "prefix" in item:
					new_field_names.append(item["prefix"])

		# List to store converted JSON objects
		json_objects = []

		# Extract the data rows, excluding the first row which contains field names
		data_rows = data.get("data", [])[1:] if data.get("data") else []

		# Iterate over each data row
		for item in data_rows:
			# Dictionary to store converted row data
			json_row = {}

			# Iterate over each index and value in the item array
			for index, value in enumerate(item):
				# Map the index to the corresponding new field name
				if index < len(new_field_names):
					field_name = new_field_names[index]
					json_row[field_name] = value

			# Add the constructed JSON row to the list of JSON objects
			json_objects.append(json_row)

		# Construct the final JSON structure
		final_json = {"type": doc_type, "data": json_objects}

		return final_json
	else:
		return {"error": "Data not found"}
	