# your-fashion-curator
Where your personal stylist meets your wardrobe. Right at the comfort of your house, privacy, aesthetic, and budget. 

Your Fashion Curator is a webapp that curates and suggests outfit combinations based on the user’s preference and existing wardrobe. 
Users can upload pictures of clothing they own and then select the aesthetic they are looking for/select the occasion they are styling for. 
The webapp will then provide outfit combinations befitting the user’s request. 

The outfit combinations provided can be shown in the form of an image with a simple model wearing it. 
The webapp can also suggest pieces of clothing that the user do not have but may go well with their current clothing pieces. 

<h1>Breakdown of the development process</h1>
<h2>1. Build your garment classifier</h2>
We need a computer vision pipeline that can classify garment images uploaded by the users. For this project, we utilized YOLOv8 to categorize the garments. After categorizing, we utilize BLIP for captioning (Provide more descriptive information of the garment e.g. the colour). We will store the data gathered from YOLOv8 and BLIP in our database to be used in the next step.

Test the trained YOLOv8 here: https://app.roboflow.com/fashiongarmentclassifier/garment-classifier/1

<h2>2. Build your outfit recommendation system</h2>
In progress..


<h2>3. Build your web-app</h2>
We used Vercel to quickly generate the base code for this web app. The tech stack used will be Next.js for frontend, FastAPI for backend requests and MongoDB as the main database.
