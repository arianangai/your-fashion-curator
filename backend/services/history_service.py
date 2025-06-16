# from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
# from models import HistoryEntryModel, OutfitModel, HistoryEntryCreate

# def get_history(db: Session, occasion: Optional[str] = None):
#     query = db.query(HistoryEntryModel).order_by(HistoryEntryModel.date.desc())
#     if occasion:
#         query = query.filter(HistoryEntryModel.occasion == occasion)
#     return query.all()

# def add_to_history(db: Session, history_entry: HistoryEntryCreate):
#     # Check if outfit exists
#     outfit = db.query(OutfitModel).filter(OutfitModel.id == history_entry.outfit_id).first()
#     if not outfit:
#         return None
    
#     # Create history entry
#     db_entry = HistoryEntryModel(
#         outfit_id=history_entry.outfit_id,
#         date=datetime.now() if not history_entry.date else datetime.fromisoformat(history_entry.date),
#         occasion=history_entry.occasion,
#         notes=history_entry.notes
#     )
    
#     db.add(db_entry)
#     db.commit()
#     db.refresh(db_entry)
#     return db_entry
