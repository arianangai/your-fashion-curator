# app/schemas.py
from decimal import Decimal, InvalidOperation
from typing import List, Optional

from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, conint, constr, validator


