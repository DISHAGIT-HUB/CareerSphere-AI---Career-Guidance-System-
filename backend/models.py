from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship, DeclarativeBase
from datetime import datetime, timezone


class Base(DeclarativeBase):
    pass


# =========================
# USER
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)

    reports = relationship("Report", back_populates="user")
    quiz_results = relationship("QuizResult", back_populates="user")
    career_searches = relationship("CareerSearch", back_populates="user")
    bookmarks = relationship("Bookmark", back_populates="user")


# =========================
# CONTACT
# =========================
class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    message = Column(String)


# =========================
# REPORT
# =========================
class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stream = Column(String)
    confidence = Column(Integer)
    subject = Column(String)
    interests = Column(Text)
    skills = Column(Text)
    grade = Column(String)
    city = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")


# =========================
# QUIZ RESULT
# =========================
class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stream = Column(String)
    confidence = Column(Integer)
    answers = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quiz_results")


# =========================
# CAREER SEARCH
# =========================
class CareerSearch(Base):
    __tablename__ = "career_searches"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String)
    career_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="career_searches")


# =========================
# BOOKMARK
# =========================
class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    degree_name = Column(String)
    duration = Column(String)
    fee_range = Column(String)
    entrance_exams = Column(String)

    user = relationship("User", back_populates="bookmarks")