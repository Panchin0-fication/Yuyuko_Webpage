from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta
import secrets
import smtplib
from email.message import EmailMessage
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends

from config.database import (collection_name, collection_fanArts,collection_users)
from schema.schemas import (list_serial , list_serial_fanArts,list_serial_user,individual_serial_user)
from my_secrets.handle_secrets import(settings)
from typing import Optional


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")



SECRET_KEY = settings.secret_key
ALGORITHM = settings.encrypt_algorithm
EMAIL = settings.email
EMAIL_PASSWORD = settings.email_password

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(hours=2)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def generate_verification_token():
    return secrets.token_urlsafe(6)

def send_email(to,token, message, subject):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL
    msg["To"] = to

    msg.set_content(f"{message} {token}")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL, EMAIL_PASSWORD)
        smtp.send_message(msg)

def get_optional_user(token: Optional[str] = Depends(oauth2_scheme)):
    if not token:
        return None
    try: 
        user = get_current_user(token)
        return user
    except Exception:
        return None
    
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        username = payload.get("userName")
    
        user = list_serial_user(collection_users.find({"userName": username}))

        return {"code":"TOKEN_VERIFICATION_SUCCESFUL","success":True,"user_data":user[0]}
    
    except ExpiredSignatureError:
        return {"code":"TOKEN_EXPIRED","success":False,"user_data":None}
    
    except Exception:
        return {"code":"UNEXPECTED_ERROR","success":False,"user_data":None}
    
def set_search_tags(search,tag_list, mode = "$all"):
    general = []
    caracter = []
    artist = []
    print("DEPURATION",tag_list)
    for tag in tag_list:
        if(tag["category"] == "general"):
            general.append(tag["name"] )
        elif(tag["category"] == "character"):
            caracter.append(tag["name"])
        elif(tag["category"] == "artist"):
            artist.append(tag["name"])
    
    if(len(general)>=1):
        search["tags"] = {f"{mode}":general}
    if(len(caracter)>=1):
        search["caracters"] = {f"{mode}":caracter}
    if(len(artist)>=1):
        search["artists"] = {f"{mode}":artist}
    return search