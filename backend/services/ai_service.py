# import aiohttp
# import os
# import json
# import random
# from typing import Dict, Any

# # List of possible garment categories
# GARMENT_CATEGORIES = [
#     "shirt", "t-shirt", "blouse", "sweater", "pants", "jeans", 
#     "shorts", "skirt", "dress", "jacket", "coat", "hoodie", 
#     "suit", "blazer", "other"
# ]

# async def classify_image(base64_image: str) -> Dict[str, Any]:
#     """
#     Classify a garment image using Fal AI or fallback to mock classification
#     """
#     fal_api_key = os.getenv("FAL_API_KEY")
    
#     if fal_api_key:
#         try:
#             # Call Fal AI API for image classification
#             async with aiohttp.ClientSession() as session:
#                 async with session.post(
#                     "https://api.fal.ai/v1/image-classification",
#                     headers={
#                         "Content-Type": "application/json",
#                         "Authorization": f"Key {fal_api_key}",
#                     },
#                     json={
#                         "image": {
#                             "data": base64_image,
#                         },
#                         "model": "clothing-classifier",
#                         "options": {
#                             "confidence_threshold": 0.1,
#                             "max_results": 5,
#                         },
#                     },
#                 ) as response:
#                     if response.status == 200:
#                         data = await response.json()
#                         results = data.get("results", [])
                        
#                         if results:
#                             # Get the top result
#                             top_result = results[0]
#                             label = top_result["label"].lower()
#                             confidence = top_result["confidence"]
                            
#                             # Map the API label to our categories
#                             category = map_label_to_category(label)
                            
#                             return {
#                                 "category": category,
#                                 "confidence": confidence
#                             }
#         except Exception as e:
#             print(f"Error calling Fal AI: {e}")
    
#     # Fallback to mock classification
#     return mock_classification()

# def map_label_to_category(label: str) -> str:
#     """Map the API label to our garment categories"""
#     if "shirt" in label or "top" in label:
#         return "shirt"
#     elif "t-shirt" in label or "tee" in label:
#         return "t-shirt"
#     elif "blouse" in label:
#         return "blouse"
#     elif "sweater" in label or "pullover" in label:
#         return "sweater"
#     elif "pants" in label or "trousers" in label:
#         return "pants"
#     elif "jeans" in label or "denim" in label:
#         return "jeans"
#     elif "shorts" in label:
#         return "shorts"
#     elif "skirt" in label:
#         return "skirt"
#     elif "dress" in label:
#         return "dress"
#     elif "jacket" in label:
#         return "jacket"
#     elif "coat" in label:
#         return "coat"
#     elif "hoodie" in label or "sweatshirt" in label:
#         return "hoodie"
#     elif "suit" in label:
#         return "suit"
#     elif "blazer" in label:
#         return "blazer"
#     else:
#         return "other"

# def mock_classification() -> Dict[str, Any]:
#     """Generate a mock classification for testing"""
#     # Exclude "other" from random selection
#     category = random.choice(GARMENT_CATEGORIES[:-1])
#     confidence = 0.7 + random.random() * 0.3  # Random confidence between 0.7 and 1.0
    
#     return {
#         "category": category,
#         "confidence": confidence
#     }
