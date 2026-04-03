from fastapi import APIRouter, HTTPException

from models.yuyus import (Tags, FanArts)
from config.database import (collection_name, collection_fanArts,collection_users)
from schema.schemas import (list_serial , list_serial_fanArts,list_serial_user,individual_serial_user,list_serial_userVer)
from functions.functions import (create_token,generate_verification_token,send_email,get_current_user)
from bson import ObjectId
from pydantic import EmailStr
from typing import List
from passlib.context import CryptContext
from fastapi import Depends, UploadFile, File, BackgroundTasks, Query, Form
from config.cloudinary import(cloudinary)
from config.i18n import(settings_internalization) 
import os, json
from typing import Annotated
#import bcrypt

translations = {}

for lang in settings_internalization.supported_locales:
    path = os.path.join("locales", lang, "messages.json")
    with open(path, encoding="utf-8") as f:
        translations[lang] = json.load(f)

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
async def post_user(userName:Annotated[str, Form()],email:Annotated[EmailStr, Form()],password:Annotated[str, Form()], lang:Annotated[str, Form()], background_tasks: BackgroundTasks):

    try:
        user = collection_users.find_one({"userName":userName})
        if user:
            return {"code":"USERNAME_ALREADY_REGISTERED","success":False,"token":None}
       
        user = collection_users.find_one({"email":email})
        if user:
            return {"code":"EMAIL_ALREADY_REGISTERED","success":False,"token":None}
            
        settings_internalization

        verification_code = generate_verification_token()
        background_tasks.add_task(send_email, email, verification_code, message=translations.get(lang, translations[settings_internalization.default_locale])["body_one"], subject=translations.get(lang, translations[settings_internalization.default_locale])["subject_one"])
        
        passw = password
        hased = pwd_context.hash(passw)
        password = hased
        
        item = {
            "userName":userName,
            "password":password,
            "role":"User",
            "email":email,
            "verified":False,
            "verification_token":verification_code
        }
        
        collection_users.insert_one(item)
        
        userInDatabase = collection_users.find_one({"userName":userName})
        token = create_token({"id":str(userInDatabase["_id"]),"email":userInDatabase["email"],"userName":userInDatabase["userName"],"verified":userInDatabase["verified"]})
        return {"code":"USER_CREATED","success":True,"token":token}
    
    except Exception:
        return {"code":"UNEXPECTED_ERROR","success":False,"token":None}
    

@router.get("/user/resendCode")
def resend_code(background_tasks: BackgroundTasks, lang:str, user = Depends(get_current_user)):
    if user["type"] == "Success":
        try:
            token = generate_verification_token()

            collection_users.update_one(
                {"email": user["data"]["email"]},
                {
                    "$set": {"verification_token":token},
                }
            )

            background_tasks.add_task(send_email, user["data"]["email"], token, message=translations.get(lang, translations[settings_internalization.default_locale])["body_two"], subject=translations.get(lang, translations[settings_internalization.default_locale])["subject_one"])

            return {"code":"VERIFICATION_CODE_SENT","success":True}
        except Exception:
            return {"code":"EMAIL_NOT_FOUND","success":False}
    else:
        return {"code":"UNEXPECTED_ERROR","success":False}

@router.post("/user/changeEmail")
def change_email(background_tasks: BackgroundTasks, email:Annotated[EmailStr, Form()], lang:Annotated[str, Form()], user = Depends(get_current_user)):
    try:
        token = generate_verification_token()

        collection_users.update_one(
            {"email": user["data"]["email"]},
            {
                "$set": {"verification_token":token,"email":email},
            }
        )

        newMail = collection_users.find_one({"email":email})
        newMail = newMail["email"]
        background_tasks.add_task(send_email, newMail, token, message=translations.get(lang, translations[settings_internalization.default_locale])["body_one"], subject=translations.get(lang, translations[settings_internalization.default_locale])["subject_one"])

        return {"code":"EMAIL_CHANGED","success":True}
    
    except user["type"] != "Success":
        return {"code":"INVALID_TOKEN","success":False}
 
    except Exception:
        return {"code":"UNEXPECTED_ERROR","success":False}
    
@router.post("/isDataRegistered")
async def is_name_registerd(name:Annotated[str, Form()],email:Annotated[str, Form()]):
    user = collection_users.find_one({"email":email})
    if user:
        return {"code":"EMAIL_ALREADY_REGISTERED","success":False}
        
    user = collection_users.find_one({"userName":name})
    if user:
        return {"code":"USERNAME_ALREADY_REGISTERED","success":False}
    
    return {"code":"DATA_UNREGISTERED","success":True}
    
@router.post("/user/reset_password/begin")
async def reset_password_begin(email:Annotated[str, Form()], lang:Annotated[str, Form()], background_tasks: BackgroundTasks):
    user = collection_users.find_one({"email":email})

    if not user:
        return {"code":"NOT_FOUND_USER","success":False}
    
    token = generate_verification_token()
    collection_users.update_one(
        {"_id":user["_id"]},
        {
            "$set":{"reset_password_token":token}
        }
    )

    background_tasks.add_task(send_email, user["email"], token, message=translations.get(lang, translations[settings_internalization.default_locale])["body_reset_password"], subject=translations.get(lang, translations[settings_internalization.default_locale])["subject_reset_password"])
    return {"code":"PASSWORD_RESET_CODE_SENT","success":True}

@router.post("/user/reset_password/change")
async def validate_reset_password(token:Annotated[str, Form()], password:Annotated[str, Form()]):
    user = collection_users.find_one({"reset_password_token":token})
    if not user:
        return {"code":"INVALID_RESET_PASSWORD_TOKEN","success":False}
    
    hasedPassword = pwd_context.hash(password)
    
    collection_users.update_one(
        {"_id":user["_id"]},
        {
            "$set":{"password":hasedPassword},
            "$unset":{"reset_password_token":""}
        }
    )

    return {"code":"PASSWORD_CHANGED","success":True}

@router.post("/user/verify-email")
def verify_email(token: Annotated[str, Form()]):

    user = collection_users.find_one({"verification_token": token})

    if not user:
        return {"code":"INVALID_VERIFICATION_TOKEN","success":False}

    collection_users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"verified": True},
            "$unset": {"verification_token": ""}
        }
    )
    return {"code":"EMAIL_VERIFIED","success":True}

@router.post("/user/login")
async def login(userName:Annotated[str, Form()], password:Annotated[str, Form()]):
    foundUser = collection_users.find_one({"userName":userName})
    if not foundUser:
        return {"code":"USERNAME_NOT_FOUND","success":False,"token":None}

    foundPassword = pwd_context.verify(password, foundUser["password"])
    if not foundPassword:
        return {"code":"INCORRECT_PASSWORD","success":False,"token":None}

    token = create_token({"userName":foundUser["userName"],"id":str(foundUser["_id"]),"email":foundUser["email"],"verified":foundUser["verified"]})
    if foundUser["verified"]:
        return {"code":"LOGIN_SUCCESSFUL","success":True,"token":token}
    else:
        return {"code":"LOGIN_SUCCESSFUL_UNVERIFIED","success":True,"token":token}

#Get user data from the token
@router.get("/profile")
def profile(user = Depends(get_current_user)):
    return user

@router.post("/newTags")
async def post_new_tags(tags: List[Tags]):
    try:
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
    
        collection_name.insert_many(items)
        return {"code":"TAGS_ADDED","success":True}
    except Exception:
        return {"code":"UNEXPECTED_ERROR","success":False}
    
@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        result = cloudinary.uploader.upload(file.file)

        return {"code":"IMAGE_UPLOAD_SUCCESSFUL","success":True, "url":result["secure_url"]}

    except Exception:
        return {"code":"UNEXPECTED_ERROR","success":False, "url":None}

@router.post("/newFanArt")
async def post_new_fanArt(fanArt: FanArts):
    item = fanArt.model_dump()
    try:
        newFanArt = collection_fanArts.insert_one(item)
        return {"code":"CREATED_FANART","success":True}
    except Exception:
        return {"code":"UNEXPECTED_ERROR","success":False}
    

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