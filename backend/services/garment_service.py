# from sqlalchemy.orm import Session
from typing import List, Optional
# from models import GarmentModel, GarmentCreate, GarmentUpdate
from pymongo import MongoClient,database as MongoDB


# def create_garment(client:MongoClient, db: MongoDB, garment: GarmentCreate):
#     db_garment = GarmentModel(
#         image_path=garment.image_path,
#         category=garment.category,
#         color=garment.color,
#         pattern=garment.pattern,
#         season=garment.season,
#         brand=garment.brand,
#         description=garment.description,
#         upload_date=garment.upload_date,
#         confidence=garment.confidence
#     )
#     garment_collection = db["garments"]
#     result = garment_collection.insert_one(db_garment)
#     # db.refresh(db_garment)
#     return db_garment

# def get_garments(db: Session, category: Optional[str] = None):
#     if category and category != "all":
#         return db.query(GarmentModel).filter(GarmentModel.category == category).all()
#     return db.query(GarmentModel).all()

# def get_garment(db: Session, garment_id: int):
#     return db.query(GarmentModel).filter(GarmentModel.id == garment_id).first()

# def update_garment(db: Session, garment_id: int, garment_update: GarmentUpdate):
#     db_garment = db.query(GarmentModel).filter(GarmentModel.id == garment_id).first()
#     if not db_garment:
#         return None
    
#     update_data = garment_update.dict(exclude_unset=True)
#     for key, value in update_data.items():
#         setattr(db_garment, key, value)
    
#     db.commit()
#     db.refresh(db_garment)
#     return db_garment

# def delete_garment(db: Session, garment_id: int):
#     db_garment = db.query(GarmentModel).filter(GarmentModel.id == garment_id).first()
#     if not db_garment:
#         return False
    
#     db.delete(db_garment)
#     db.commit()
#     return True
