# AIFinalProject
## Root and Revive
This is an App that will make it easier for users to find menu items that fit their dietary requirements when they visit a restaurant. A chatbot can help them plan and budget their meals when they eat out.

Team members:
+ Felicia
+ Ayana

## Setup Guide

+ React Installation
    + npm install

+ Python Installation
    + sudo apt update
    + sudo apt install python3 python3-pip
+ Create a virtual environment
    + pip3 install virtualenv
+ Create a project directory and set up the virtual environment
    + mkdir myproject
    + cd myproject
    + python -m venv .venv
+ Activate the virtual environment
    + source .venv/bin/activate
+ Install Flask
    + pip install flask
+ Verify Installation

## Tech Stack
 
+ React
+ PostgreSQL
+ Python 
+ FastAPI

## AI Model Description

The backend uses a RAG system to generate a response from a user input. The app focuses on helping users find Memphis restaurants that meet their dietary restrictions, but the generator model also answers questions related to more general queries. 

+ Embedding and Retriever model - multi-qa-mpnet-base-cos-v1 - This model is ideal because it was designed for semantic search
+ Database - PostgresSQL - This is a free SQL database that enables a vector search, metadata filtering, and a geospatial search. The extension pg_vector enables a vector search and the extension postgis enables the geospatial search.
+ Generator model - Gemini - This model worked best for the cost constraints of the project. 

