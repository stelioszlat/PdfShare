import pymongo
from templates import *


def connect_to(mongo):
    try:
        client = pymongo.MongoClient(mongo)
    except ConnectionError:
        return
    finally:
        print("Connection with " + mongo + " established...")
        return client

client = connect_to("mongodb://localhost:8080")

if client:
    db = client["metadata"]
    print("Connected to " + db.name)
    collection = db["demo"]
    print("Obtained collection " + collection.full_name)

    meta = str({'word1': 10, 'word2': 2, 'word3':5})

    new_meta = metadata_template('demo', 'me', meta)

    x = collection.insert_one(new_meta)