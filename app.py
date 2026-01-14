from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

from database.db import init_db , User , SessionLocal 

init_db()







app = FastAPI()

app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")








# 1. This endpoint serves the HTML page (The Interface)
@app.get("/", response_class=HTMLResponse)
def get_interface():
    with open("frontend/index.html", "r") as f:
        return f.read()



@app.get("/add" , response_class=HTMLResponse)
def add_page():
    with open("frontend/add.html" , "r") as f :
        return f.read()




# 2. This is the "Automatic Hand-off" endpoint
@app.get("/user/{user_id}")
def get_user_data(user_id: int):
    
    db = SessionLocal() 
    user = db.query(User).filter(User.id == user_id).first()
    db.close()
    if not user :
        raise HTTPException(status_code=404, detail="User not found")
    return user



@app.get("/users")
def get_all_users():
    db = SessionLocal() 
    users = db.query(User).all()
    for user in users :
        print(str(user.id) + " " + user.name)
    db.close()
    
    if not users :
        return {}
    
    return users
    
    




@app.get("/users_filtered")
def filter_users_by_name(pattern: str):
    db = SessionLocal()
    try:
        if pattern:
            users = db.query(User).filter(User.name.ilike(f"{pattern}%")).all()
        else:
            users = db.query(User).all()
        return users
    finally:
        db.close() 
    
    
@app.post("/add/add_user")
def add_user(user : dict):
    
    db = SessionLocal() 
    
    
    try :
        new_user = User(name = user["name"] , 
                        role = user["role"] , 
                        skills= user["skills"])
        db.add(new_user) 
        db.commit() 
        
        return {"status" : "success"}
        
    finally:
        db.close()
        
    
    

@app.delete("/users/delete/{user_id}")
def delete_user(user_id: int):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            print(f"{user_id} not found")
            raise HTTPException(status_code=404, detail=f"User {user_id} not found")
        db.delete(user)
        db.commit()
        return {"status": "success", "message": f"User {user_id} deleted"}
    finally:
        db.close()



@app.put("/users/update/{user_id}")
def update_user(user_id: int, updated_user: dict):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Directly update the fields you expect
        user.name = updated_user.get("name", user.name)
        user.role = updated_user.get("role", user.role)
        user.skills = updated_user.get("skills", user.skills)

        db.commit()
        return {"status": "success", "message": f"User {user_id} updated"}
    finally:
        db.close()
