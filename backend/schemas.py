from pydantic import BaseModel, EmailStr
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    stream: str | None = None
    interests: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class CareerRequest(BaseModel):
    stream: str
    interests: str
    
class CareerQuiz(BaseModel):
    likes_programming: bool
    likes_math: bool
    likes_design: bool
    
class ChatRequest(BaseModel):
    question: str
    
class InterestInput(BaseModel):
    interests: list[str]
    


class StreamRequest(BaseModel):
    stream: str
    interest: str


class DegreeRequest(BaseModel):
    stream: str
    
class DashboardRequest(BaseModel):
    email: str


class ReportRequest(BaseModel):
    email: str
    
class ContactCreate(BaseModel):
    name: str
    email: str
    message: str