from pydantic import BaseModel, EmailStr

class Tags(BaseModel):
    name: str
    category: str
    status:str

class FanArts(BaseModel):
    src: str
    tags: list = []
    artists: list = []
    caracters: list = []
    clasification: str
    show: bool
    originalLink: str
    status: str
    uploader: dict

class User(BaseModel):
    userName:str
    password:str
    role:str
    email:EmailStr | None = None
    verified:bool
    verification_token:str | None = None