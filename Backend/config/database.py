from pymongo import MongoClient
from my_secrets.handle_secrets import(settings)

client = MongoClient(settings.conexion_string)


db = client.yuyu_db

collection_name = db["yuyu_tags"]
collection_fanArts = db["fanArts"]
collection_users = db["users"]