from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
# from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Table
# from sqlalchemy.orm import relationship
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()

# # SQLAlchemy models (for database)
# outfit_garment = Table(
#     "outfit_garment",
#     Base.metadata,
#     Column("outfit_id", Integer, ForeignKey("outfits.id")),
#     Column("garment_id", Integer, ForeignKey("garments.id"))
# )

# outfit_idea_garment = Table(
#     "outfit_idea_garment",
#     Base.metadata,
#     Column("outfit_idea_id", Integer, ForeignKey("outfit_ideas.id")),
#     Column("garment_id", Integer, ForeignKey("garments.id"))
# )

# class GarmentModel(Base):
#     __tablename__ = "garments"
    
#     id = Column(Integer, primary_key=True, index=True)
#     image_path = Column(String, nullable=False)
#     category = Column(String, nullable=False)
#     color = Column(String, nullable=True)
#     pattern = Column(String, nullable=True)
#     season = Column(String, nullable=True)
#     brand = Column(String, nullable=True)
#     description = Column(String, nullable=True)
#     upload_date = Column(DateTime, default=datetime.now)
#     confidence = Column(Float, nullable=True)
    
#     outfits = relationship("OutfitModel", secondary=outfit_garment, back_populates="items")
#     outfit_ideas = relationship("OutfitIdeaModel", secondary=outfit_idea_garment, back_populates="items")

# class OutfitModel(Base):
#     __tablename__ = "outfits"
    
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=True)
#     occasion = Column(String, nullable=True)
#     season = Column(String, nullable=True)
    
#     items = relationship("GarmentModel", secondary=outfit_garment, back_populates="outfits")
#     history_entries = relationship("HistoryEntryModel", back_populates="outfit")

# class OutfitIdeaModel(Base):
#     __tablename__ = "outfit_ideas"
    
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     style = Column(String, nullable=False)
#     tags = Column(String, nullable=False)  # Stored as JSON string
    
#     items = relationship("GarmentModel", secondary=outfit_idea_garment, back_populates="outfit_ideas")

# class HistoryEntryModel(Base):
#     __tablename__ = "history"
    
#     id = Column(Integer, primary_key=True, index=True)
#     outfit_id = Column(Integer, ForeignKey("outfits.id"))
#     date = Column(DateTime, default=datetime.now)
#     occasion = Column(String, nullable=True)
#     notes = Column(String, nullable=True)
    
#     outfit = relationship("OutfitModel", back_populates="history_entries")

from pymongo import MongoClient
from bson import ObjectId

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["fashion_curator_db"]

# Collections
garments_collection = db["garments"]
outfits_collection = db["outfits"]
outfit_ideas_collection = db["outfit_ideas"]
history_collection = db["history"]

# Garment Model
def create_garment(image_path, category, color=None, pattern=None, season=None, brand=None, description=None, confidence=None):
    garment = {
        "image_path": image_path,
        "category": category,
        "color": color,
        "pattern": pattern,
        "season": season,
        "brand": brand,
        "description": description,
        "upload_date": datetime.utcnow(),
        "confidence": confidence,
    }
    return garments_collection.insert_one(garment).inserted_id

# Outfit Model
def create_outfit(name=None, occasion=None, season=None, garment_ids=None):
    outfit = {
        "name": name,
        "occasion": occasion,
        "season": season,
        "items": garment_ids or []
    }
    return outfits_collection.insert_one(outfit).inserted_id

# Outfit Idea Model
def create_outfit_idea(name, style, tags, garment_ids=None):
    outfit_idea = {
        "name": name,
        "style": style,
        "tags": tags,  # This could be a list or a single string
        "items": garment_ids or []
    }
    return outfit_ideas_collection.insert_one(outfit_idea).inserted_id

# History Entry Model
def create_history_entry(outfit_id, occasion=None, notes=None):
    history_entry = {
        "outfit_id": ObjectId(outfit_id),
        "date": datetime.utcnow(),
        "occasion": occasion,
        "notes": notes
    }
    return history_collection.insert_one(history_entry).inserted_id

# Example Usage
if __name__ == "__main__":
    # Create a garment
    garment_id = create_garment(
        image_path="images/shirt.png",
        category="shirt",
        color="blue",
        pattern="striped",
        season="summer",
        brand="Zara",
        description="A cool blue striped shirt",
        confidence=0.95
    )

    # Create an outfit
    outfit_id = create_outfit(
        name="Casual Summer Outfit",
        occasion="casual",
        season="summer",
        garment_ids=[garment_id]
    )

    # Create an outfit idea
    outfit_idea_id = create_outfit_idea(
        name="Beach Vibes",
        style="casual",
        tags=["beach", "summer", "light"],
        garment_ids=[garment_id]
    )

    # Create a history entry
    history_id = create_history_entry(
        outfit_id=outfit_id,
        occasion="Beach Day",
        notes="Worn during a beach outing."
    )

    print(f"Garment ID: {garment_id}")
    print(f"Outfit ID: {outfit_id}")
    print(f"Outfit Idea ID: {outfit_idea_id}")
    print(f"History Entry ID: {history_id}")


# Pydantic models (for API)

# class GarmentModel(BaseModel):
#     __tablename__ = "garments"
    
#     id = Column(Integer, primary_key=True, index=True)
#     image_path = Column(String, nullable=False)
#     category = Column(String, nullable=False)
#     color = Column(String, nullable=True)
#     pattern = Column(String, nullable=True)
#     season = Column(String, nullable=True)
#     brand = Column(String, nullable=True)
#     description = Column(String, nullable=True)
#     upload_date = Column(DateTime, default=datetime.now)
#     confidence = Column(Float, nullable=True)
    
#     outfits = relationship("OutfitModel", secondary=outfit_garment, back_populates="items")
#     outfit_ideas = relationship("OutfitIdeaModel", secondary=outfit_idea_garment, back_populates="items")

class GarmentBase(BaseModel):
    category: str
    color: Optional[str] = None
    pattern: Optional[str] = None
    season: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None

class GarmentCreate(GarmentBase):
    image_path: str
    upload_date: str
    confidence: Optional[float] = None

class GarmentUpdate(BaseModel):
    category: Optional[str] = None
    color: Optional[str] = None
    pattern: Optional[str] = None
    season: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None

class GarmentResponse(GarmentBase):
    id: int
    image_path: str
    upload_date: str
    confidence: Optional[float] = None
    
    class Config:
        orm_mode = True

class OutfitBase(BaseModel):
    name: Optional[str] = None
    occasion: Optional[str] = None
    season: Optional[str] = None

class OutfitCreate(OutfitBase):
    item_ids: List[int]

class OutfitResponse(OutfitBase):
    id: int
    items: List[GarmentResponse]
    
    class Config:
        orm_mode = True

class OutfitIdeaBase(BaseModel):
    name: str
    style: str
    tags: List[str]

class OutfitIdeaCreate(OutfitIdeaBase):
    item_ids: List[int]

class OutfitIdeaResponse(OutfitIdeaBase):
    id: int
    items: List[GarmentResponse]
    
    class Config:
        orm_mode = True

class HistoryEntryBase(BaseModel):
    outfit_id: int
    occasion: Optional[str] = None
    notes: Optional[str] = None

class HistoryEntryCreate(HistoryEntryBase):
    date: Optional[str] = None

class HistoryEntryResponse(HistoryEntryBase):
    id: int
    date: str
    outfit: OutfitResponse
    
    class Config:
        orm_mode = True
