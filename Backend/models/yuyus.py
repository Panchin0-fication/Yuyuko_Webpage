from pydantic import BaseModel, EmailStr, Field

class Tags(BaseModel):
    name: str
    category: str
    status:str

class Uploader(BaseModel):
    username:str
    id:str

class FanArts(BaseModel):
    src: str
    tags: list = []
    artists: list = []
    caracters: list = []
    clasification: str
    show: bool
    originalLink: str
    status: str
    uploader: Uploader

class SimpleTag(BaseModel):
    name: str
    category: str

class Preferences(BaseModel):
    language: str = "en"
    showExplicit: bool = False
    hideTags: list[SimpleTag] = Field(default_factory=list)

class User(BaseModel):
    userName:str
    password:str
    role:str
    email:EmailStr 
    verified:bool
    verification_token:str 
    preferences: Preferences