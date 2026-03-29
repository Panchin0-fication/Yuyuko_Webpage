from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    email: str
    email_password: str
    encrypt_algorithm: str
    secret_key: str 
    origin:str
    cloudinary_cloud_name:str
    cloudinary_api_key:int
    cloudinary_api_secret:str
    conexion_string:str

    class Config:
        env_file = ".env"

settings = Settings()