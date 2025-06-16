# app/schemas.py
from decimal import Decimal, InvalidOperation
from typing import List, Optional
from fastapi import UploadFile, File, Form
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, conint, constr, validator

class CreateGarmentModel(BaseModel):
    image: UploadFile = File(...)

class CreateCustomerModel(BaseModel):
    username: constr(max_length=100)
    company_name: str
    website: str
    tel_no:str
    fax_no:str
    contact_person_name: str
    email: str
    phone1: str
    phone2: str
    address_line_1: str
    address_line_2: str
    address_line_3: str
    address_line_4: str
    postcode: str
    city: str
    state_code:str
    state: str
    country_code:str
    country: str
    tin: str
    client_id: str
    business_regis_no: str
    client_secret: str
    backlinkurl: str
    integration: bool

class UpdateCustomerDetail(BaseModel):
    customer_id: str
    company_name: str
    website: str
    tel_no:str
    fax_no:str = None
    contact_person_name: str
    email: str
    phone1: str
    phone2: str = None
    address_line_1: str
    address_line_2: str
    address_line_3: str = None
    address_line_4: str = None
    postcode: str
    city: str
    state_code: str
    state: str
    country_code:str
    country: str
    username: constr(max_length=100)
    tin: str
    client_id: str
    backlinkurl: str = None
    integration: bool
    business_regis_no: str 
    client_secret: str 



class DeleteCustomerDetail(BaseModel):
    customer_id:str
    username:str