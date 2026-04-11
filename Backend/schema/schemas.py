def individual_serial(tag) -> dict:
    return{
        "id": str(tag["_id"]),
        "name": tag["name"],
        "category": tag["category"],
        "status":tag["status"]
    }

def list_serial(tags) -> list:
    return[individual_serial(tag) for tag in tags]

def individual_serial_fanArts(fanArt) -> dict:
    return{
        "id": str(fanArt["_id"]),
        "src": fanArt["src"],
        "tags": fanArt["tags"],
        "artists": fanArt["artists"],
        "caracters": fanArt["caracters"],
        "clasification": fanArt["clasification"],
        "show": fanArt["show"],
        "originalLink": fanArt["originalLink"],
        "status": fanArt["status"],
        "uploader": fanArt["uploader"]
    }

def list_serial_fanArts(fanArts) -> list:
    return[individual_serial_fanArts(fanArt) for fanArt in fanArts]

def individual_serial_user(user) -> dict:
    data = {
        "id": str(user["_id"]),
        "userName": user["userName"],
        "password": user["password"],
        "role": user["role"],
        "email": user["email"],
        "verified": user["verified"],
    }

    if "verification_token" in user:
        data["verification_token"] = user["verification_token"]

    if "reset_password_token" in user:
        data["reset_password_token"] = user["reset_password_token"]
        
    return data

def list_serial_user(users) -> list:
    return[individual_serial_user(user) for user in users]

def individual_serial_userVer(user) -> dict:
    return{
        "id": str(user["_id"]),
        "userName": user["userName"],
        "password": user["password"],
        "role": user["role"],
        "email": user["email"],
        "verified": user["verified"],
    }

def list_serial_userVer(users) -> list:
    return[individual_serial_userVer(user) for user in users]