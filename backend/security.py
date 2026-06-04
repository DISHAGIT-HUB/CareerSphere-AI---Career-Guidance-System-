from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


# HASH PASSWORD
def hash_password(password: str):
    return pwd_context.hash(password[:72])


# VERIFY PASSWORD
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)


# GET CURRENT USER (IMPORTANT)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    # TEMP TOKEN = EMAIL
    user = db.query(User).filter(User.email == token).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user