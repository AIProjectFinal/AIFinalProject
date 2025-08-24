from sentence_transformers import SentenceTransformer
import psycopg2
import uvicorn
import os
import string
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List
from google import genai
from google.genai import types
import chromadb
import pandas as pd

load_dotenv()
key = os.environ['GEMINI_API_KEY']
app = FastAPI(debug=True)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    # Add more origins here
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=key)

conversation_history = [{"role":"system", "content":"Hello! I am Herb. What type of restaurant are you looking for?"}]


def intolerancefilter(string):
  intolerance=[]
  gluten=["gluten", "celiac", "gf", "wheat"]
  dairy=["dairy"]
  vegan=["vegan","plant"]
  specificfood=["hamburger","burger","cake", "sandwich", "bakery"]
  lowerstring=string.lower()
  for punctuation in ',.?;"-':
    lowerstring = lowerstring.replace(punctuation, "")
  if any(x in lowerstring for x in gluten):
    glutenfree = "gluten_free = True"
    intolerance.append(glutenfree)
  if any(x in lowerstring for x in dairy):
    dairyfree = "dairy_free = True"
    intolerance.append(dairyfree)
  if any(x in lowerstring for x in vegan):
    vegan = "vegan = True"
    intolerance.append(vegan)
  delimiter = " AND "
  intolerance_string = delimiter.join(intolerance)
  #newstring = lowerstring.replace("gluten free", "").replace("no gluten", "").replace("gluten", "").replace("gluten-free", "").replace("non gluten","").replace("wheat free", "").replace("vegan","").replace("dairy free","").replace("non dairy","").replace("no dairy","").replace("nondairy","").replace("dairy","")
  for punctuation in ',.?;"':
    lowerstring = lowerstring.replace(punctuation, "")
    finalstring = lowerstring
    finalstring = finalstring.replace("glutenfree", "gluten-free").replace("dairyfree", "dairy-free").replace("wheatfree", "wheat-free")
  if not any(x in lowerstring for x in specificfood):
    finalstring = lowerstring.replace("gluten free", "").replace("no gluten", "").replace("gluten", "").replace("gluten-free", "").replace("non gluten","").replace("wheat free", "").replace("dairy free","").replace("non dairy","").replace("no dairy","").replace("nondairy","").replace("dairy","").replace("free","")
  values = [finalstring, intolerance_string]
  return(values)


def get_embedding(text):
    model = SentenceTransformer("sentence-transformers/msmarco-bert-base-dot-v5")
    return model.encode(text).tolist()

PostgresPassword = os.environ['POST_PASS']

def get_connection():
    try:
        return psycopg2.connect(
            database="postgres",
            user="postgres",
            password=PostgresPassword,
            host="127.0.0.1",
            port=5433
        )
    except:
        return False
def convert_distance(distance):
    return round(distance*0.00062137, 1)

def generate_prompt(query, long, lat):
    conversation_history.append({"role":"user", "content":query})
    conn = get_connection()
    curr = conn.cursor()
    filtereddata = intolerancefilter(query)
    filteredquery = filtereddata[0]
    query_vector = get_embedding(filteredquery)
    distancefilter = f'ST_DWithin(coordinates, ST_MakePoint({long},{lat}), 5000)'
    metadata = filtereddata[1]
    fullmetadata = [metadata, distancefilter]
    if metadata != "":
        if lat != None:
          delimiter = " AND "
          metadata_string = delimiter.join(fullmetadata)
          querydistance = f'ST_Distance(coordinates, ST_MakePoint({long},{lat})::geography) AS distance_meters'
        if lat == None:
          metadata_string = metadata
          querydistance = 'address'
    if metadata == "":
        if lat != None:
          metadata_string = distancefilter
          querydistance = f'ST_Distance(coordinates, ST_MakePoint({long},{lat})::geography) AS distance_meters'
        if lat == None:
          metadata_string = True
          querydistance= 'address'
    recommendation = ""
    if lat != None:
      curr.execute(f"""
          SELECT restaurant_name, {querydistance}, address, description, restaurant_url
          FROM restaurants6 
          WHERE {metadata_string} 
          ORDER BY description_embeddings <=> '{query_vector}' 
          LIMIT 5;
          """)
      data = curr.fetchall()
      if data: 
        for row in data:
          distance_meters = row[1]
          distance_miles = convert_distance(distance_meters)
          recommendation = recommendation + f"Restauraunt name: {row[0]} Distance: {distance_miles} Address: {row[2]} URL: {row[4]} Description: {row[3]} \n\n"

    if lat == None:
      curr.execute(f"""
          SELECT restaurant_name, {querydistance}, description, restaurant_url
          FROM restaurants6 
          WHERE {metadata_string} 
          ORDER BY description_embeddings <=> '{query_vector}' 
          LIMIT 5;
          """)
      data = curr.fetchall()
      if data: 
        for row in data:
          recommendation = recommendation + f"Restauraunt name: {row[0]} Address: {row[1]} URL: {row[3]} Description: {row[2]} \n\n"

    PROMPT = f"""
    query: {query}
    Answers should be in plain text and should not include bolding, italics, or citations.
    If the query does not ask about a restaurant recommendation or where to get food answer the query as it is. Insert line breaks <br> as needed.
    If the query asks for a restaurant recommendation or where to get food, use the following restuarant information to answer user query.
    If they use the singular to ask for a restaurant or food, only give them one restaurant. Otherwise, you can recommend multiple.
    {recommendation}
        """

    conn.close()
    return PROMPT

def chat_with_gpt(query):
  prompt_examples = f"""
  When the user asks about the restaurant recommendation, you will give a quick introduction, then the restaurant name, distance (if provided), address, and what the user will enjoy about the restaurant.
  The <a href='url' target='blank'></a> is the tag to make the restaurant names into a clickable link.
  The <br> is for line breaks.
  It will look like this:
  Introduction<br><br>
  <a href='url' target='_blank'>Restaurant Name</a><br>
  Distance<br>
  Street name and number<br>
  City, State, Zip Code<br>
  What the user will enjoy about the restaurant.

  Here are some examples of questions the user may ask about finding a restaurant and how you would format the answer:
  Question: Where can I get vegan food?

  Answer: Finding delicious vegan food in Memphis is easier than ever! Here are a few fantastic spots you might enjoy:<br><br>

  Paradise Cafe<br> 
  1.0 miles away<br>
  6150 Poplar Ave #120<br>
  Memphis, TN 38119<br>
  http://paradisecafememphis.com/<br>
  This is a great option if you're looking for global flavors and a focus on organic, local ingredients. You'll love their hearty salads, flavorful wraps, and refreshing smoothies. Plus, they have a good selection of gluten-free and raw food choices!<br><br>

  Raw Girls<br>
  1.6 miles away<br>
  Parking, Lot 5502 Poplar Ave<br>
  Memphis, TN 38117<br>
  https://raw-girls.com/<br>
  If you're a fan of raw vegan cuisine, this is the place to go! They create incredibly fresh and flavorful dishes from uncooked ingredients, all while maximizing nutrients. Everything on their menu is raw, gluten-free, and soy-free, so it's a dream for health-conscious diners.<br><br>

  City Silo Table + Pantry<br>
  2.7 miles away<br>
  7605 W Farmington Blvd #2<br>
  Germantown, TN 38138<br>
  https://www.thecitysilo.com/<br> 
  They offer a vibrant farm-to-table vegan menu with organic and sustainably sourced ingredients. It's a go-to spot for health-conscious diners, and they have excellent breakfast and lunch options, including gluten-free bread and the Hippie Scramble. You'll find plenty of seasonal vegetables, grains, and legumes, along with many gluten-free and soy-free choices.<br><br>

  Sun of a Vegan<br>
  2.8 miles away<br>
  6075 Winchester Rd<br>
  Memphis, TN 38115<br>
  http://www.sunofavegan.com/<br> 
  They have a broad menu of delicious vegan comfort foods like burgers, sandwiches, and sides, all made with wholesome ingredients. You'll also find many gluten-free options available, making it ideal for a casual and satisfying meal!

  Question: Where can I get gluten free pasta?

  Answer: Are you craving some delicious gluten-free pasta? I can help with that! Here are a few fantastic Italian restaurants in Memphis that offer gluten-free pasta options:<br><br>
  Amerigo Italian Restaurant<br> 
  0.6 miles away<br>
  1239 Ridgeway Rd<br>
  Memphis, TN 38119<br>
  https://amerigo.net/memphis/menu/<br> 
  They're known for comforting Italian classics and have a warm, inviting atmosphere. You'll be happy to know that they specifically offer gluten-free pasta and vegetarian dishes, making it a great spot for everyone. <br><br>
  <bold>Grisanti’s Italian Restaurant</bold><br> 
  1.0 mile away<br>
  6150 Poplar Ave #122<br>
  Memphis, TN 38119<br>
  https://www.ronniegrisanti.com/<br> 
  This cozy, family-friendly spot serves classic Italian dishes with fresh ingredients. They are very accommodating and have gluten-free options available upon request, so you can definitely enjoy their delicious pasta!<br><br>
  <bold>Andrew Michael Italian Kitchen</bold><br>
  2.4 miles away<br>
  712 W Brookhaven Cir<br>
  Memphis, TN 38117<br>
  http://andrewmichaelitaliankitchen.com/<br>
  They blend refined Italian cooking with Southern influence and feature handmade pastas. The best part for you is that they can substitute gluten-free pasta for most of their pasta dishes! It's an elegant yet cozy setting for a memorable meal.

  Question: Where can I get gluten free cake?
  Answer: Oh, I'd love to help you find some delicious gluten-free cake! You're in luck because Fleming's Prime Steakhouse and Wine Bar is an excellent choice!<br><br>
  <bold>Fleming's Prime Steakhouse and Wine Bar</bold><br>
  0.9 miles away<br>
  6245 Poplar Ave<br>
  Memphis, TN 38119<br>
  https://www.flemingssteakhouse.com/Locations/TN/Memphis?y_source=1_MTU1MDMxODUtNzE1LWxvY2F0aW9uLndlYnNpdGU%3D<br>
  You'll enjoy a sophisticated dining experience there, and they offer a fantastic gluten-free chocolate cake. The staff are really well-trained in handling dietary restrictions, so you can dine with confidence and truly elevate your evening with their delicious options.

  Question: Where can I get gluten free breakfast?

  Answer: I can help with that!If you're looking for a delicious gluten-free breakfast, I highly recommend checking out City Silo Table + Pantry! It it a vibrant farm-to-table spot that you will enjoy<br><br>
  <bold>City Silo Table + Pantry</bold><br>
  2.7 miles away<br>
  580 S Mendenhall Rd<br>
  Memphis, TN 38117<br>
   https://www.thecitysilo.com/<br>
  You'll love their dedication to organic, sustainably sourced ingredients, making it a dream for health-conscious diners. They offer a fantastic selection for breakfast and lunch, and you'll be happy to know they have gluten-free bread available! One dish you might really enjoy is the Hippie Scramble, which features rice, egg, and kale topped with a serrano avocado spread. They also have a variety of gluten-free and soy-free choices, so you're sure to find something fresh and nourishing that you'll absolutely adore!

  """


  response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"You are friendly food expert {query}. If the user is getting a restaurant recommendation make it seem like a review and include what they will enjoy about it. {prompt_examples}.",
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
        ),
    )
  chatbot_reply = f"{response.text}"
  conversation_history.append({"role":"assistant", "content":chatbot_reply})
  return conversation_history

#query1 = chat_with_gpt(generate_prompt("where can I get a gluten-free cake?",-90.03713, 35.13775))

#print(query1)

class Message(BaseModel):
    message:str
    lat:float | None = None
    long:float | None = None

@app.post("/ask")
async def create_message(message: Message):
    server_response = chat_with_gpt(generate_prompt(message.message, message.long, message.lat))
    return server_response
    

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
