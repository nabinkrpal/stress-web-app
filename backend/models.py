
# from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
# from sqlalchemy.orm import relationship
# from database import Base
# from datetime import datetime,timedelta

# def get_ist_time():
#     return datetime.utcnow() + timedelta(hours=5, minutes=30)



# # =========================
# # USER TABLE
# # =========================
# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)

#     name = Column(String(100), nullable=False)
#     email = Column(String(150), unique=True, index=True, nullable=False)
#     password = Column(String(255), nullable=False)

#     # Email verification
#     is_verified = Column(Boolean, default=False)
#     # feedbacks = relationship("Feedback", back_populates="user")
    

#     # OTP fields
#     reset_otp = Column(String(10), nullable=True)
#     otp_expiry = Column(DateTime, nullable=True)

#     # Relationship
#     records = relationship(
#         "StressRecord",
#         back_populates="user",
#         cascade="all, delete"
#     )


# # =========================
# # STRESS RECORD TABLE
# # =========================
# class StressRecord(Base):
#     __tablename__ = "stress_records"

#     id = Column(Integer, primary_key=True, index=True)

#     user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

#     # 🔥 INPUT DATA (VERY IMPORTANT - FIXES YOUR ISSUE)
#     sleep_hours = Column(Float, nullable=True)
#     study_hours = Column(Float, nullable=True)
#     screen_time = Column(Float, nullable=True)
#     attendance = Column(Float, nullable=True)
#     deadline_pressure = Column(Integer, nullable=True)

#     # RESULT
#     predicted_stress = Column(String(20), nullable=False)

#     # EXTRA FEATURES
#     source = Column(String(20), default="form")
#     image_path = Column(String(255), nullable=True)
#     emotion = Column(String(50), nullable=True)
# # =========================
# # FEEDBACK TABLE
# # =========================
# # class Feedback(Base):
# #     __tablename__ = "feedback"

# #     id = Column(Integer, primary_key=True, index=True)

# #     name = Column(String(100), nullable=False)
# #     message = Column(String(500), nullable=False)

# #     user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

# #     created_at = Column(DateTime, default=get_ist_time)

# #     user = relationship("User", back_populates="feedbacks")
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timedelta

def get_ist_time():
    return datetime.utcnow() + timedelta(hours=5, minutes=30)

# =========================
# USER TABLE
# =========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    is_verified = Column(Boolean, default=False)

    reset_otp = Column(String(10), nullable=True)
    otp_expiry = Column(DateTime, nullable=True)

    # ✅ FIXED RELATIONSHIPS
    records = relationship("StressRecord", back_populates="user", cascade="all, delete")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete")


# =========================
# STRESS RECORD TABLE
# =========================
class StressRecord(Base):
    __tablename__ = "stress_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    sleep_hours = Column(Float, nullable=True)
    study_hours = Column(Float, nullable=True)
    screen_time = Column(Float, nullable=True)
    attendance = Column(Float, nullable=True)
    deadline_pressure = Column(Integer, nullable=True)

    predicted_stress = Column(String(20), nullable=False)

    source = Column(String(20), default="form")
    image_path = Column(String(255), nullable=True)
    emotion = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=get_ist_time)

    # ✅ THIS LINE MUST EXIST
    user = relationship("User", back_populates="records")


# =========================
# FEEDBACK TABLE
# =========================
class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    message = Column(String(500), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=get_ist_time)

    # ✅ FIXED RELATION
    user = relationship("User", back_populates="feedbacks")
