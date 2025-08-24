import csv
import pandas as pd
from sqlalchemy import create_engine, text

import textwrap
import numpy as np
from numpy.linalg import norm
import pandas as pd
from sentence_transformers import SentenceTransformer, util
import os
import time

data_path = "./restaurants.csv" #@param{type:"string"}

df = pd.read_csv(data_path)
df= df.drop(columns='neighborhood')
df.info()

def restaurant_info_layout(restaurants):
    # Iterate over the houses
        # For each house, append the information to the string using f-strings
        # The following way using brackets is a good way to make the code readable as in each line you can start a new f-string that will appended to the previous one
    layout = (f"RESTAURANT NAME: {restaurants['restaurant_name']}, CUISINE TYPE: {restaurants['cuisine_type']}, SERVICE STYLE: {restaurants['service_style']}"
            f"MEAL FOCUS: {restaurants['meal_focus']} DESCRIPTION: {restaurants['description']} \n\n")
        
    return layout

model = SentenceTransformer("sentence-transformers/msmarco-bert-base-dot-v5")

df["layout"] = df.apply(restaurant_info_layout, axis=1)

print(df["layout"].head())

def get_embedding(text: str) -> list[float]:
    if not text.strip():
      print("Attempted to get embedding for empty text.")
      return []

    embedding = model.encode(text)
    return embedding.tolist()

#add an embedding column to the dataframe to hold the embeddings
df["description_embeddings"] = df["layout"].apply(get_embedding)

df.to_csv('new_embeddings.csv', index=False)