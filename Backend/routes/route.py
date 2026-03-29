from fastapi import APIRouter, HTTPException

from models.yuyus import (Tags, FanArts)
from config.database import (collection_name, collection_fanArts,collection_users)
from schema.schemas import (list_serial , list_serial_fanArts,list_serial_user,individual_serial_user,list_serial_userVer)
from functions.functions import (create_token,generate_verification_token,send_email,get_current_user)
from bson import ObjectId
from typing import List
from pydantic import EmailStr
from passlib.context import CryptContext
from fastapi import Depends, UploadFile, File, BackgroundTasks, Query
from config.cloudinary import(cloudinary)
#import bcrypt

router = APIRouter()

@router.get("/")
async def get_tags():
    tags = list_serial(collection_name.find())
    return tags

@router.post("/")
async def post_tag(tag: Tags):
    collection_name.insert_one(dict(tag))

@router.get("/user")
async def get_users():
    users = list_serial_user(collection_users.find())
    return users

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
@router.post("/user")
async def post_user(userName:str,email:str,password:str, background_tasks: BackgroundTasks):

    try:
        existingName = list_serial_user(collection_users.find({"userName":userName}))
        if len(existingName) >= 1:
            return HTTPException(status_code=422, detail=str("Name alredy registered"))
        if email != "":
            existingEmail = list_serial_user(collection_users.find({"email":email}))
            if len(existingEmail) >= 1:
                return {"message":"Email ya registrado","type":"Error"}
            
            token = generate_verification_token()
            #background_tasks.add_task(write_notification, email, message="some notification")
            background_tasks.add_task(send_email, email, token, message="Este es tu codigo para verificar tu cuenta", subject="Verifica tu correo")
        
        passw = password
        hased = pwd_context.hash(passw)
        password = hased
        
        item = {
            "userName":userName,
            "password":password,
            "role":"User",
            "email":None if email == "" else email,
            "verified":True if email == "" else False,
            "verification_token":None if email == "" else token
        }
        
        collection_users.insert_one(item)
        
        userInDatabase = collection_users.find({"userName":userName})
        token = create_token({"id":userInDatabase["id"],"email":userInDatabase["email"],"userName":userInDatabase["userName"],"verified":userInDatabase["verified"]})

        return {"message": "Usuario creado. Verifica tu correo.","type":"Success","data":token}
    
    except Exception as e:
        return {"message":"Error inesperado","type":"Error"}
    

@router.get("/user/resendCode")
def resend_code(background_tasks: BackgroundTasks, user = Depends(get_current_user)):
    if user["type"] == "Success":
        try:
            token = generate_verification_token()

            collection_users.update_one(
                {"email": user["data"]["email"]},
                {
                    "$set": {"verification_token":token},
                }
            )

            background_tasks.add_task(send_email, user["data"]["email"], token, message="Este es tu nuevo codigo para verificar tu cuenta", subject="Verifica tu correo")

            return {"message":"Se ha enviado un nuevo codigo de verificación a su correo","type":"Success"}
        except Exception:
            return {"message":f"No se encontró el correo {user["data"]["email"]}. Prueba a cambiar la dirección de correo","type":"Error"}
        
    else:
        #Unexpected error
        return user

@router.get("/user/changeEmail/{email}")
def change_email(background_tasks: BackgroundTasks, email:EmailStr, user = Depends(get_current_user)):
    try:
        token = generate_verification_token()

        collection_users.update_one(
            {"email": user["data"]["email"]},
            {
                "$set": {"verification_token":token,"email":email},
            }
        )

        newMail = list_serial_user(collection_users.find({"email":email}))
        newMail = newMail[0]["email"]
        background_tasks.add_task(send_email, newMail, token, message="Este es tu codigo para verificar tu cuenta", subject="Verifica tu correo")

        return {"message":"Se a actualizado el correo del usuario y se ha enviado un codigo de verificación","type":"Success"}
    
    except user["type"] != "Success":
        return {"message":"Token no valido","type":"Error"}
 
    except Exception:
        return {"message":"Error inesperado","type":"Error"}
    
@router.get("/isDataRegistered")
async def is_name_registerd(name:str,email:str):
    user = collection_users.find_one({"email":email})
    if user:
        return {"message":"No te puedes registrar con ese correo","type":"Error","Context":"email"}
    user = collection_users.find_one({"userName":name})
    if user:
        return {"message":"Nombre de usuario ya registrado","type":"Error","Context":"userName"}
    
    return {"message":"No hay usuario con esos datos","type":"Success","Context":None}
    
@router.get("/user/reset_password/begin")
async def reset_password_begin(email:str,background_tasks: BackgroundTasks):
    user = collection_users.find_one({"email":email})

    if not user:
        return {"message": "No se encontró cuenta con ese correo","type":"Error"}
    
    token = generate_verification_token()
    collection_users.update_one(
        {"_id":user["_id"]},
        {
            "$set":{"reset_password_token":token}
        }
    )

    background_tasks.add_task(send_email, user["email"], token, message="Este es tu codigo para poder cambiar tu contraseña", subject="Cambiar contraseña")
    return {"message": "Se ha enviado un codigo para resetear la contraseña a esa direccion email","type":"Success"}


@router.get("/user/reset_password/change")
async def validate_reset_password(token:str, password:str):
    user = collection_users.find_one({"reset_password_token":token})
    if not user:
        return {"message": "Codigo invalido","type":"Error"}
    
    hasedPassword = pwd_context.hash(password)
    
    collection_users.update_one(
        {"_id":user["_id"]},
        {
            "$set":{"password":hasedPassword},
            "$unset":{"reset_password_token":""}
        }
    )

    return {"message": f"La contraseña del usuario {user["userName"]} ha cambiado","type":"Success"}


@router.get("/user/verify-email")
def verify_email(token: str):

    user = collection_users.find_one({"verification_token": token})

    if not user:
        return {"message": "Token inválido","type":"Error"}

    collection_users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"verified": True},
            "$unset": {"verification_token": ""}
        }
    )

    return {"message": "Correo verificado correctamente","type":"Success"}

@router.post("/user/login")
async def login(userName:str, password:str):
    foundUser = list_serial_user(collection_users.find({"userName":userName}))
    if not foundUser:
        return {"message": "Nombre de usuario no encontrado","type":"Error"}
    
    foundUser = foundUser[0]

    foundPassword = pwd_context.verify(password, foundUser["password"])
    if not foundPassword:
        return {"message": "Contraseña incorrecta","type":"Error"}

    #{"id":fak[0]["id"],"email":fak[0]["email"],"userName":fak[0]["userName"]}
    token = create_token({"userName":foundUser["userName"],"id":foundUser["id"],"email":foundUser["email"],"verified":foundUser["verified"]})
    return {"access_token": token, "type":"Success", "isVerified":foundUser["verified"]}

#Get user data from the token
@router.get("/profile")
def profile(user = Depends(get_current_user)):
    return user

@router.post("/newTags")
async def post_new_tags(tags: List[Tags]):
    
    items = []
    for tag in tags:
        items.append(tag.model_dump())

    tagNames = []
    for tag in items:
        tagNames.append(tag["name"])
    repited = list_serial(collection_name.find({"name":{"$in":tagNames}}))
    repited_without_id = []
    for singular_repited in repited:
        del singular_repited["id"]
        repited_without_id.append(singular_repited)

    for repitedTag in repited_without_id:
        print("repetido",repitedTag)
        print("Tags",items)
        items.remove(repitedTag)
    #newTags = [t for t in items if ]
    #return items
    try:
        collection_name.insert_many(items)
        return tags
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        result = cloudinary.uploader.upload(file.file)

        return {
            "type": "Success",
            "url": result["secure_url"]
        }

    except Exception as e:
        return {
            "type": "Error",
            "message": str(e)
        }

@router.post("/newFanArt")
async def post_new_fanArt(fanArt: FanArts):
    item = fanArt.model_dump()
    try:
        newFanArt = collection_fanArts.insert_one(item)
        createdFanArt = list_serial_fanArts(collection_fanArts.find({"_id":newFanArt.inserted_id}))
        return createdFanArt
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/fanArt")
async def get_fanArt():
    fanArts = list_serial_fanArts(collection_fanArts.find())
    return fanArts

@router.post("/fanArt")
async def post_fanArt(fanArt: FanArts):
    collection_fanArts.insert_one(dict(fanArt))

@router.get("/fanArt/{num}")
async def get_fanArtsNum(num:int):
    fanArts = list_serial_fanArts(collection_fanArts.find().skip((num-1)*8).limit(8))
    return fanArts

@router.get("/fanArts/tags/{num}")
async def get_fanArtsByTags(num:int,tags: List[str] = Query(...)):
    if(tags[0] == ""):
        fanArts = list_serial_fanArts(collection_fanArts.find().skip((num-1)*8).limit(9))
        return fanArts
    

    general = []
    caracter = []
    artist = []
    tagList = list_serial(collection_name.find({"name":{"$in":tags}}))

    for tag in tagList:
        if(tag["category"] == "general"):
            general.append(tag["name"] )
        elif(tag["category"] == "character"):
            caracter.append(tag["name"])
        elif(tag["category"] == "artist"):
            artist.append(tag["name"])

    search = {}

    if(len(general)>=1):
        search["tags"] = {"$all":general}
    if(len(caracter)>=1):
        search["caracters"] = {"$all":caracter}
    if(len(artist)>=1):
        search["artists"] = {"$all":artist}
    
    fanArts = list_serial_fanArts(collection_fanArts.find(search).skip((num-1)*8).limit(9))
    return fanArts