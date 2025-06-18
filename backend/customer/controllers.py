from pydantic import BaseModel, constr, EmailStr
import pymongo
from .schemas import CreateGarmentModel,UpdateCustomerDetail
from pymongo import MongoClient,database as MongoDB, ReturnDocument
import re
from decouple import config
from bson.objectid import ObjectId
import requests
import json
import time
from datetime import datetime
import base64
 # import the inference-sdk
from inference_sdk import InferenceHTTPClient
import tempfile

# Client secret functions
def get_customer_ids(client: MongoClient,db:MongoDB):
    # Assuming you have a collection that stores the company IDs
    # Assuming you have a collection that stores the company IDs
    select_fields = {"_id": 1, "tin": 1, "client_id": 1, "client_secret": 1, "business_regis_no": 1, "company_name": 1,"backlinkurl": 1 }
    query = {
        "tin": {"$exists": True, "$ne": None, "$ne": ""},
        "client_id": {"$exists": True, "$ne": None, "$ne": ""},
        "client_secret": {"$exists": True, "$ne": None, "$ne": ""}
    }
    
    customer_collection = db["customer"]
    customer_ids = customer_collection.find(query, select_fields)

    result = [{"client_secret":customer["client_secret"],"client_id":customer["client_id"],"company_name":customer["company_name"],"business_regis_no":customer["business_regis_no"],"tin": customer["tin"], "id": str(customer["_id"]),"backlinkurl": customer.get("backlinkurl", "")} for customer in customer_ids]
    # print(result)
    return result


def get_login_authentication_token(client_id,client_secret,grant_type,tin_no):
    LHDN_INTEGRATION_DOMAIN = config("lhdn_integrations_domain")
    LHDN_INTEGRATION_VERSION = config("lhdn_integrations_version")

    url = "https://"+LHDN_INTEGRATION_DOMAIN+"/connect/token"

    payload = {
        'client_id': client_id,
        'client_secret':client_secret,
        'grant_type': grant_type,
        'scope': 'InvoicingAPI'
    }
    headers = {
        'onbehalfof': tin_no
    }

    while True:
        response = requests.request("POST", url, headers=headers, data=payload, timeout=20)
        
        if response.status_code == 429:
            print("Too many requests. Retrying...")
            time.sleep(2)  # Wait for 2 seconds before retrying
            continue
        elif response.status_code == 200:
            response_data = json.loads(response.text)
            access_token = response_data["access_token"]
            return access_token
        else:
            response.raise_for_status()

async def get_garments(client:MongoClient,db:MongoDB):
    try:
        garments_collection = db["garments"]
        # query = {"category": category} if category else {}

        # Fetch garments
        garments_cursor = garments_collection.find()
        garments = []
        for garment in garments_cursor:
            garments.append({
                "id": str(garment["_id"]),
                "filename": garment["filename"],
                "content_type": garment["content_type"],
                "uploaded_at": garment.get("uploaded_at"),
                "image_base64": base64.b64encode(garment["content"]).decode("utf-8"),
                # include category if you're using it
                "category": garment.get("category")
            })
        client.close()
        return garments
    except Exception as e:
        print(e)
        client.close()
        return False

# Create a user using the UserModel schema
async def create_garment(client:MongoClient,db:MongoDB, garment_data):
    try:
        garments_collection = db["garments"]
        print("garment_data",garment_data)
        contents = await garment_data.read()
        filename = garment_data.filename

        # Save the uploaded image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            tmp_file.write(contents)
            tmp_file_path = tmp_file.name

        # Initialize the client
        CLIENT = InferenceHTTPClient(
            api_url=config("api_url"),
            api_key=config("api_key")
        )

        # Infer using the saved file path
        result = CLIENT.infer(tmp_file_path, model_id="garment-classifier/2")
        if result.get("predictions"):
            predicted_class = result["predictions"][0]["class"]
            category = predicted_class
            print("Predicted class:", predicted_class)
        else:
            category = "Unlabeled"
        print("result", result)
        document = {
            "filename": filename,
            "content": contents,
            "content_type": garment_data.content_type,
            "category": category,
            "model_result": result,
            "uploaded_at": datetime.utcnow(),
        }

        result = garments_collection.insert_one(document)
        client.close()
        return True
     
    except Exception as e:
        print(e)
        client.close()
        return False
    finally:
        import os
        if os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)
    

async def retrieve_customer(client,db:MongoDB,customer_id):
    try:
        customer_collection = db["customer"]
        
        # Create a query to find the customer by _id
        query = {"_id": ObjectId(customer_id)}
        
        # Specify the fields to be returned in the result
        select_fields = {}

        # Use find_one to retrieve the customer
        result = customer_collection.find_one(query, select_fields)

        if result and "_id" in result:
            result["_id"] = str(result["_id"])
            
        client.close()
        return result
    except Exception as e:
        print(f"Error fetching data: {e}")
        return False
    
async def delete_customer(client,db:MongoDB,customer_id):
    try:
        customer_collection = db["customer"]
        
        # Create a query to find the template by _id
        query = {"_id": ObjectId(customer_id)}
        result = customer_collection.delete_one(query)
        
        client.close()
        return result
    except Exception as e:
        print(f"Error fetching data: {e}")
        return False

async def update_customer(client, db: MongoDB, update_data: UpdateCustomerDetail):
    try:
        customer_collection = db["customer"]

        customer_id = update_data.customer_id 

        # Create a query to find the customer by _id
        query = {"_id": ObjectId(customer_id)}

        # Construct the update field to exclude the customer_id
        update_field = {'$set': update_data.dict(exclude={"customer_id"})}

        # Use find_one to retrieve the customer
        result = customer_collection.update_one(query, update_field)

        client.close()

        return result
    except Exception as e:
        print(f"Error updating customer data: {e}")
        return False

    

# Create a user using the UserModel schema
async def retrieve_customer_listing(client,db:MongoDB, page, page_size):
    try:
        skip = (page - 1) * page_size
        limit = page_size
        customer_collection = db["customer"]

        query = {}
        select_field = {"company_name"}
        doc_list = customer_collection.find(query,select_field).skip(skip).limit(limit)
        total = customer_collection.count_documents(query)
        result = [{"company_name": doc["company_name"], "_id": str(doc["_id"])} for doc in doc_list]
        
        client.close()
        ret = {"result":result,"recordTotal":total}
        return ret
    except Exception as e:
        print(e)
        ret = {"message":"Failed"}
        return ret
    

async def get_customer_options(client,db:MongoDB,search,page,page_size):
    try:
        # Calculate skip and limit based on page and page_size
        skip = (page - 1) * page_size
        limit = page_size
        options_collection = db["customer"]
        query = {}
        if search == "":
            query = {
                # "is_active":True
            }
        else:
            query = {
                # "is_active":True,
                "company_name": {"$regex": re.compile(search, re.IGNORECASE)}
            }
        select_field = {"company_name"}
        # Retrieve data from MongoDB with pagination
        options = options_collection.find(query,select_field).skip(skip).limit(limit)
        result = [{"company_name": option["company_name"], "id": str(option["_id"])} for option in options]

        return result
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"message":"Failed"}
    finally:
        client.close()


async def get_user_options(client,db:MongoDB,search,page,page_size):
    try:
        # Calculate skip and limit based on page and page_size
        skip = (page - 1) * page_size
        limit = page_size
        options_collection = db["client_user"]
        query = {}
        if search == "":
            query = {
                # "is_active":True
            }
        else:
            query = {
                # "is_active":True,
                "username": {"$regex": re.compile(search, re.IGNORECASE)}
            }
        select_field = {"username"}
        # Retrieve data from MongoDB with pagination
        options = options_collection.find(query,select_field).skip(skip).limit(limit)
        result = [{"username": option["username"], "id": str(option["_id"])} for option in options]

        return result
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"message":"Failed"}
    finally:
        client.close()


async def get_state_options(client,db:MongoDB,search,page,page_size):
    try:
        # Calculate skip and limit based on page and page_size
        skip = (page - 1) * page_size
        limit = page_size
        options_collection = db["State"]
        query = {}
        if search == "":
            query = {
                # "is_active":True
            }
        else:
            query = {
                # "is_active":True,
                "State": {"$regex": re.compile(search, re.IGNORECASE)}
            }
        select_field = {"Code","State"}
        # Retrieve data from MongoDB with pagination
        options = options_collection.find(query,select_field).skip(skip).limit(limit)
        result = [{"state": option["State"], "id": str(option["Code"])} for option in options]

        return result
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"message":"Failed"}
    finally:
        client.close()



async def get_country_options(client,db:MongoDB,search,page,page_size):
    try:
        # Calculate skip and limit based on page and page_size
        skip = (page - 1) * page_size
        limit = page_size
        options_collection = db["Country"]
        query = {}
        if search == "":
            query = {
                # "is_active":True
            }
        else:
            query = {
                # "is_active":True,
                "Country": {"$regex": re.compile(search, re.IGNORECASE)}
            }
        select_field = {"Code","Country"}
        sort_criteria = [("Country", pymongo.ASCENDING)] 
        # Retrieve data from MongoDB with pagination
        options = options_collection.find(query,select_field).sort(sort_criteria).skip(skip).limit(limit)
        result = [{"country": option["Country"], "id": str(option["Code"])} for option in options]

        return result
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {"message":"Failed"}
    finally:
        client.close()