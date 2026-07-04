from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# --- User ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str

# --- Todo ---
class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    done: Optional[bool] = None

class TodoOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    done: bool
    created_at: datetime

    class Config:
        from_attributes = True