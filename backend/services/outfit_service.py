# from sqlalchemy.orm import Session
from typing import List, Optional
import json
import random
# from models import (
#     GarmentModel, 
#     OutfitModel, 
#     OutfitIdeaModel,
#     OutfitCreate,
#     OutfitResponse
# )

# def get_outfits(db: Session, garment_id: Optional[int] = None):
#     query = db.query(OutfitModel)
#     if garment_id:
#         query = query.filter(OutfitModel.items.any(id=garment_id))
#     return query.all()

# def create_outfit(db: Session, outfit_data: OutfitCreate):
#     # Create new outfit
#     db_outfit = OutfitModel(
#         name=outfit_data.name,
#         occasion=outfit_data.occasion,
#         season=outfit_data.season
#     )
    
#     # Add garment items
#     for item_id in outfit_data.item_ids:
#         garment = db.query(GarmentModel).filter(GarmentModel.id == item_id).first()
#         if garment:
#             db_outfit.items.append(garment)
    
#     db.add(db_outfit)
#     db.commit()
#     db.refresh(db_outfit)
#     return db_outfit

# def generate_outfits(db: Session, selected_garment: GarmentModel, all_garments: List[GarmentModel]):
#     # Filter out the selected garment
#     other_garments = [g for g in all_garments if g.id != selected_garment.id]
#     outfits = []
    
#     # Logic to create outfit combinations based on garment type
#     if selected_garment.category in ["shirt", "t-shirt", "blouse", "sweater"]:
#         # Tops go well with pants, jeans, skirts, shorts
#         bottom_items = [g for g in other_garments if g.category in ["pants", "jeans", "skirt", "shorts"]]
#         outer_items = [g for g in other_garments if g.category in ["jacket", "coat", "blazer", "hoodie"]]
        
#         # Create 2-piece outfits (top + bottom)
#         for bottom in bottom_items[:3]:  # Limit to 3 for demo
#             outfit = OutfitModel(
#                 season=determine_season([selected_garment, bottom]),
#                 occasion=determine_occasion([selected_garment, bottom])
#             )
#             outfit.items.append(selected_garment)
#             outfit.items.append(bottom)
#             db.add(outfit)
#             outfits.append(outfit)
        
#         # Create 3-piece outfits (top + bottom + outer)
#         for bottom in bottom_items[:2]:  # Limit to 2 for demo
#             for outer in outer_items[:2]:  # Limit to 2 for demo
#                 outfit = OutfitModel(
#                     season=determine_season([selected_garment, bottom, outer]),
#                     occasion=determine_occasion([selected_garment, bottom, outer])
#                 )
#                 outfit.items.append(selected_garment)
#                 outfit.items.append(bottom)
#                 outfit.items.append(outer)
#                 db.add(outfit)
#                 outfits.append(outfit)
    
#     # Similar logic for other garment types...
#     # (Simplified for brevity - would include logic for pants, jackets, dresses, etc.)
    
#     db.commit()
#     for outfit in outfits:
#         db.refresh(outfit)
    
#     return outfits

# def get_outfit_ideas(db: Session, style: Optional[str] = None):
#     query = db.query(OutfitIdeaModel)
#     if style:
#         query = query.filter(OutfitIdeaModel.style == style)
#     return query.all()

# def generate_outfit_ideas(db: Session, garments: List[GarmentModel]):
#     if len(garments) < 3:
#         return []
    
#     # Define some style themes
#     styles = [
#         {"name": "Casual Weekend", "style": "casual", "tags": ["casual", "comfortable", "weekend"]},
#         {"name": "Business Professional", "style": "business", "tags": ["formal", "office", "professional"]},
#         {"name": "Summer Vacation", "style": "summer", "tags": ["summer", "vacation", "beach"]},
#         {"name": "Fall Layers", "style": "fall", "tags": ["fall", "layered", "cozy"]},
#         {"name": "Night Out", "style": "evening", "tags": ["evening", "party", "stylish"]},
#     ]
    
#     ideas = []
    
#     for style_info in styles:
#         # Create outfit idea with appropriate garments based on style
#         idea = OutfitIdeaModel(
#             name=style_info["name"],
#             style=style_info["style"],
#             tags=json.dumps(style_info["tags"])
#         )
        
#         # Add appropriate garments based on style
#         # (Simplified logic - would be more sophisticated in production)
#         if style_info["style"] == "casual":
#             tshirts = [g for g in garments if g.category == "t-shirt"]
#             jeans = [g for g in garments if g.category == "jeans"]
            
#             if tshirts and jeans:
#                 idea.items.append(random.choice(tshirts))
#                 idea.items.append(random.choice(jeans))
        
#         elif style_info["style"] == "business":
#             shirts = [g for g in garments if g.category in ["shirt", "blouse"]]
#             pants = [g for g in garments if g.category == "pants"]
#             blazers = [g for g in garments if g.category in ["blazer", "suit"]]
            
#             if shirts and pants:
#                 idea.items.append(random.choice(shirts))
#                 idea.items.append(random.choice(pants))
#                 if blazers:
#                     idea.items.append(random.choice(blazers))
        
#         # Add more style-specific logic here...
        
#         # Only add ideas that have at least 2 items
#         if len(idea.items) >= 2:
#             db.add(idea)
#             ideas.append(idea)
    
#     db.commit()
#     for idea in ideas:
#         db.refresh(idea)
    
#     return ideas

# # Helper functions
# def determine_season(items):
#     # Logic to determine season based on items
#     # Simplified for brevity
#     return "all-season"

# def determine_occasion(items):
#     # Logic to determine occasion based on items
#     # Simplified for brevity
#     return "casual"
