import requests
import json
from flask import Flask, jsonify, Response
from pymongo import MongoClient
from dotenv import dotenv_values
import certifi
import pandas as pd

app = Flask(__name__)

def getDatabase(db):
    mongo_keys = dotenv_values("../.env")
    CONNECTION_STRING = mongo_keys["URI"]
    client = MongoClient(CONNECTION_STRING,tlsCAFile=certifi.where())
    return client[db]

def getCollection(collection_name):
    db_name = dotenv_values("../.env")["DB_NAME"]
    db = getDatabase(db_name)
    return db[collection_name]

def getPlayers(collection_name):
    print(type(collection_name))
    collection = getCollection(collection_name)
    #collection.find_one({"name": "Kaidan 8"})
    df = list(collection.find({"players": {"$exists": True}}, projection={'_id':0}))
    return df
def getData(collection_name):
    collection = getCollection(collection_name)
    df = list(collection.find({"players": {"$exists": False}}, projection={'_id':0}))
    return df


@app.route("/")
def status():
    return Response(
        json.dumps(
            {
                "status": 200,
                "message": "OK",
            }
        ),
        200,
    )

@app.route("/league-players/<league>")
def getLeague(league):
    l = json.dumps(getPlayers(league))
    return l

@app.route("/league-data/<league>")
def getData(league):
    l = json.dumps(getData(league))
    return l

@app.route("/league-list")
def getLeagueList():
    db_name = dotenv_values("../.env")["DB_NAME"]
    db = getDatabase(db_name)
    l = json.dumps(db.list_collection_names())
    return l
#print(getCollection("wordHuntLeagues"))
if __name__ == "__main__":
    #findItem("wordHuntLeagues")
    app.run()