# from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
# from pydantic import BaseModel
# from sqlalchemy.orm import Session
# from datetime import datetime, timedelta
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# import joblib
# import pandas as pd
# import random
# import smtplib
# from email.mime.text import MIMEText
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
# import os
# from dotenv import load_dotenv

# from deepface import DeepFace
# import numpy as np
# import cv2
# from fastapi import UploadFile, File

# from database import engine, SessionLocal
# import models
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from fastapi.staticfiles import StaticFiles


# # ================= INIT =================


# load_dotenv()
# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()

# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)
# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# # 🔥 Force DeepFace to use your local weights folder
# os.environ["DEEPFACE_HOME"] = os.path.abspath(".deepface")


# SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
# EMAIL_FROM = os.getenv("EMAIL_FROM")


# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://stress-web-app.vercel.app"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ================= CONFIG =================

# SECRET_KEY = "your_secret_key_here"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# # ================= ML MODEL =================

# model = joblib.load("stress_model.pkl")
# label_encoder = joblib.load("label_encoder.pkl")


# # ================= DATABASE =================

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # ================= SCHEMAS =================

# class UserCreate(BaseModel):
#     name: str
#     email: str
#     password: str

# class StressInput(BaseModel):
#     sleep_hours: float
#     study_hours: float
#     screen_time: float
#     attendance: float
#     deadline_pressure: int

# class ForgotPasswordSchema(BaseModel):
#     email: str

# class ResetPasswordSchema(BaseModel):
#     email: str
#     otp: str
#     new_password: str

# # ================= EMAIL =================
# def send_email(to_email, subject, body):
#     try:
#         message = Mail(
#             from_email=EMAIL_FROM,
#             to_emails=to_email,
#             subject=subject,
#             plain_text_content=body,
#         )

#         sg = SendGridAPIClient(SENDGRID_API_KEY)
#         response = sg.send(message)

#         print("Email sent:", response.status_code)

#     except Exception as e:
#         print("Email Error:", str(e))


# def send_verification_email(email, user_id):
#     link = f"https://stress-web.onrender.com/verify-email/{user_id}"
#     send_email(email, "Verify Account", f"Click to verify:\n{link}")

# def send_otp_email(email, otp):
#     send_email(email, "OTP Code", f"Your OTP is {otp} (valid 5 min)")

# def generate_otp():
#     return str(random.randint(100000, 999999))

# # ================= AUTH =================

# def hash_password(password):
#     return pwd_context.hash(password)

# def verify_password(plain, hashed):
#     return pwd_context.verify(plain, hashed)

# def create_access_token(data: dict):
#     data.update({"exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)})
#     return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id = payload.get("user_id")

#         if user_id is None:
#             raise HTTPException(status_code=401, detail="Invalid token")

#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

#     user = db.query(models.User).filter(models.User.id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")

#     return user

# # ================= ROUTES =================

# @app.get("/")
# def home():
#     return {"message": "API Running"}

# # -------- REGISTER --------

# @app.post("/register")
# def register(user: UserCreate, db: Session = Depends(get_db)):

#     if db.query(models.User).filter(models.User.email == user.email).first():
#         raise HTTPException(status_code=400, detail="Email exists")

#     new_user = models.User(
#         name=user.name,
#         email=user.email,
#         password=hash_password(user.password),
#         is_verified=False
#     )

#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)

#     send_verification_email(new_user.email, new_user.id)

#     return {"message": "Check email to verify"}

# # -------- LOGIN --------

# @app.post("/login")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

#     user = db.query(models.User).filter(models.User.email == form_data.username).first()

#     if not user or not verify_password(form_data.password, user.password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     if not user.is_verified:
#         raise HTTPException(status_code=403, detail="Verify email first")

#     token = create_access_token({"user_id": user.id})

#     return {"access_token": token, "token_type": "bearer"}

# # -------- VERIFY --------

# @app.get("/verify-email/{user_id}")
# def verify(user_id: int, db: Session = Depends(get_db)):

#     user = db.query(models.User).filter(models.User.id == user_id).first()

#     if not user:
#         raise HTTPException(status_code=404)

#     user.is_verified = True
#     db.commit()

#     return {"message": "Email verified"}

# # -------- PREDICT --------

# @app.post("/predict")
# def predict(data: StressInput, user=Depends(get_current_user), db: Session = Depends(get_db)):

#     df = pd.DataFrame([data.dict()])
#     pred = model.predict(df)
#     label = label_encoder.inverse_transform(pred)[0]
#     record = models.StressRecord(
#         **data.dict(),
#         predicted_stress=label,
#         user_id=user.id,
#         source="form"
#     )
#     # record = models.StressRecord(**data.dict(), predicted_stress=label, user_id=user.id)

#     db.add(record)
#     db.commit()
#     db.refresh(record)

#     return {"predicted_stress": label, "timestamp": record.created_at}

# # -------- HISTORY --------
# @app.get("/history")
# def history(user=Depends(get_current_user), db: Session = Depends(get_db)):

#     records = db.query(models.StressRecord)\
#         .filter(models.StressRecord.user_id == user.id)\
#         .order_by(models.StressRecord.created_at.desc())\
#         .all()

#     response = []

#     for r in records:

#         # 🔥 COMMON DATA
#         base_data = {
#             "id": r.id,
#             "type": r.source,  # "form" or "webcam"
#             "predicted_stress": r.predicted_stress,
#             "created_at": r.created_at,
#         }

#         # ✅ FORM RECORD
#         if r.source == "form":
#             base_data.update({
#                 "sleep_hours": r.sleep_hours,
#                 "study_hours": r.study_hours,
#                 "screen_time": r.screen_time,
#                 "attendance": r.attendance,
#                 "deadline_pressure": r.deadline_pressure,

#                 # ❌ explicitly null for clarity
#                 "emotion": None,
#                 "image": None
#             })

#         # ✅ WEBCAM RECORD
#         else:
#             base_data.update({
#                 "emotion": r.emotion,
#                 "image": r.image_path,

#                 # ❌ no fake 0 values
#                 "sleep_hours": None,
#                 "study_hours": None,
#                 "screen_time": None,
#                 "attendance": None,
#                 "deadline_pressure": None,
#             })

#         response.append(base_data)

#     return response


# # -------- FORGOT PASSWORD --------

# @app.post("/forgot-password")
# def forgot_password(data: ForgotPasswordSchema, db: Session = Depends(get_db)):

#     user = db.query(models.User).filter(models.User.email == data.email).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     otp = generate_otp()

#     user.reset_otp = otp
#     user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)

#     db.commit()

#     send_otp_email(user.email, otp)

#     return {"message": "OTP sent"}

# # -------- RESET PASSWORD --------

# @app.post("/reset-password")
# def reset_password(data: ResetPasswordSchema, db: Session = Depends(get_db)):

#     user = db.query(models.User).filter(models.User.email == data.email).first()

#     if not user:
#         raise HTTPException(status_code=404)

#     if not user.reset_otp:
#         raise HTTPException(status_code=400, detail="Request OTP first")

#     if user.reset_otp != data.otp:
#         raise HTTPException(status_code=400, detail="Invalid OTP")

#     if datetime.utcnow() > user.otp_expiry:
#         raise HTTPException(status_code=400, detail="OTP expired")

#     user.password = hash_password(data.new_password)
#     user.reset_otp = None
#     user.otp_expiry = None

#     db.commit()

#     return {"message": "Password reset successful"}

# # -------- DEACTIVATE --------

# @app.delete("/deactivate-account")
# def deactivate(user=Depends(get_current_user), db: Session = Depends(get_db)):

#     user.email = f"deleted_{user.id}@anon.com"
#     user.name = "Deleted User"
#     user.password = ""
#     user.is_verified = False

#     db.commit()

#     return {"message": "Account deactivated"}

# # -------- WEBCAM STRESS --------

# @app.post("/webcam-stress")
# async def webcam_stress(
#     file: UploadFile = File(...),
#     current_user: models.User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     try:
#         contents = await file.read()

#         # Convert image to OpenCV format
#         np_arr = np.frombuffer(contents, np.uint8)
#         img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
#         try:
#             analysis = DeepFace.analyze(
#                 img,
#                 actions=['emotion'],
#                 detector_backend='opencv',
#                 enforce_detection=False   # 🔥 ADD THIS
#             )
#         except Exception as e:
#             print("Webcam Error:", e)
#             raise HTTPException(status_code=500, detail="Model error")
        
#         emotion = analysis[0]['dominant_emotion']

#         # 🔥 Map emotion → stress
#         if emotion in ["angry", "fear", "sad"]:
#             stress = "High"
#         elif emotion == "neutral":
#             stress = "Medium"
#         else:
#             stress = "Low"

#         # 🔥 Save to DB
#         filename = f"user_{current_user.id}_{int(datetime.utcnow().timestamp())}.jpg"
#         filepath = os.path.join(UPLOAD_DIR, filename)
#         cv2.imwrite(filepath, img)
#         image_path=filepath

#         # 🔥 Save correct webcam record
         
#         record = models.StressRecord(
#             user_id=current_user.id,
#             sleep_hours=None,
#             study_hours=None,
#             screen_time=None,
#             attendance=None,
#             deadline_pressure=None,
#             predicted_stress=stress,
#             source="webcam",            # ✅ differentiate
#             image_path=image_path,        # ✅ save image
#             emotion=emotion             # ✅ NEW FIELD (IMPORTANT)
#         )
        

#         db.add(record)
#         db.commit()
#         db.refresh(record)

#         return {
#             "emotion": emotion,
#             "predicted_stress": stress,
#             "timestamp": record.created_at
#         }

#     except Exception as e:
#         print("Webcam Error:", e)
#         raise HTTPException(status_code=500, detail="Webcam processing failed")
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import joblib
import pandas as pd
import random
import os
from dotenv import load_dotenv

# 🔥 SendGrid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# 🔥 DeepFace
from deepface import DeepFace
import numpy as np
import cv2

from database import engine, SessionLocal
import models
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles


# ================= INIT =================

load_dotenv()
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# 🔥 BASE DIR FIX (IMPORTANT FOR RENDER)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🔥 Uploads
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 🔥 DeepFace LOCAL WEIGHTS FIX
DEEPFACE_DIR = os.path.join(BASE_DIR, ".deepface")
os.environ["DEEPFACE_HOME"] = DEEPFACE_DIR

# 🔥 DEBUG (remove later)
print("DeepFace Path:", DEEPFACE_DIR)
if os.path.exists(os.path.join(DEEPFACE_DIR, "weights")):
    print("Weights:", os.listdir(os.path.join(DEEPFACE_DIR, "weights")))

# 🔥 ENV VARIABLES
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://stress-web-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= CONFIG =================

SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# ================= ML MODEL =================

model = joblib.load(os.path.join(BASE_DIR, "stress_model.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))

# ================= DATABASE =================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= SCHEMAS =================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class StressInput(BaseModel):
    sleep_hours: float
    study_hours: float
    screen_time: float
    attendance: float
    deadline_pressure: int

class ForgotPasswordSchema(BaseModel):
    email: str

class ResetPasswordSchema(BaseModel):
    email: str
    otp: str
    new_password: str

# ================= EMAIL =================

def send_email(to_email, subject, body):
    try:
        message = Mail(
            from_email=EMAIL_FROM,
            to_emails=to_email,
            subject=subject,
            plain_text_content=body,
        )

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)

        print("Email sent:", response.status_code)

    except Exception as e:
        print("Email Error:", str(e))


def send_verification_email(email, user_id):
    link = f"https://stress-web.onrender.com/verify-email/{user_id}"
    send_email(email, "Verify Account", f"Click to verify:\n{link}")


def send_otp_email(email, otp):
    send_email(email, "OTP Code", f"Your OTP is {otp} (valid 5 min)")


def generate_otp():
    return str(random.randint(100000, 999999))

# ================= AUTH =================

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict):
    data.update({"exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# ================= ROUTES =================

@app.get("/")
def home():
    return {"message": "API Running"}

# -------- REGISTER --------

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        is_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    send_verification_email(new_user.email, new_user.id)

    return {"message": "Check email to verify"}

# -------- LOGIN --------

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Verify email first")

    token = create_access_token({"user_id": user.id})

    return {"access_token": token, "token_type": "bearer"}

# -------- VERIFY --------

@app.get("/verify-email/{user_id}")
def verify(user_id: int, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404)

    user.is_verified = True
    db.commit()

    return {"message": "Email verified"}

# -------- PREDICT --------

@app.post("/predict")
def predict(data: StressInput, user=Depends(get_current_user), db: Session = Depends(get_db)):

    df = pd.DataFrame([data.dict()])
    pred = model.predict(df)
    label = label_encoder.inverse_transform(pred)[0]

    record = models.StressRecord(
        **data.dict(),
        predicted_stress=label,
        user_id=user.id,
        source="form"
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {"predicted_stress": label, "timestamp": record.created_at}

# -------- HISTORY --------

@app.get("/history")
def history(user=Depends(get_current_user), db: Session = Depends(get_db)):

    records = db.query(models.StressRecord)\
        .filter(models.StressRecord.user_id == user.id)\
        .order_by(models.StressRecord.created_at.desc())\
        .all()

    response = []

    for r in records:
        base_data = {
            "id": r.id,
            "type": r.source,
            "predicted_stress": r.predicted_stress,
            "created_at": r.created_at,
        }

        if r.source == "form":
            base_data.update({
                "sleep_hours": r.sleep_hours,
                "study_hours": r.study_hours,
                "screen_time": r.screen_time,
                "attendance": r.attendance,
                "deadline_pressure": r.deadline_pressure,
                "emotion": None,
                "image": None
            })
        else:
            base_data.update({
                "emotion": r.emotion,
                "image": r.image_path,
                "sleep_hours": None,
                "study_hours": None,
                "screen_time": None,
                "attendance": None,
                "deadline_pressure": None,
            })

        response.append(base_data)

    return response

# -------- FORGOT PASSWORD --------

@app.post("/forgot-password")
def forgot_password(data: ForgotPasswordSchema, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()

    user.reset_otp = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=5)

    db.commit()

    send_otp_email(user.email, otp)

    return {"message": "OTP sent"}

# -------- RESET PASSWORD --------

@app.post("/reset-password")
def reset_password(data: ResetPasswordSchema, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404)

    if user.reset_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > user.otp_expiry:
        raise HTTPException(status_code=400, detail="OTP expired")

    user.password = hash_password(data.new_password)
    user.reset_otp = None
    user.otp_expiry = None

    db.commit()

    return {"message": "Password reset successful"}

# -------- WEBCAM STRESS --------

@app.post("/webcam-stress")
async def webcam_stress(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()

        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        analysis = DeepFace.analyze(
            img,
            actions=['emotion'],
            detector_backend='opencv',
            enforce_detection=False
        )

        emotion = analysis[0]['dominant_emotion']

        if emotion in ["angry", "fear", "sad"]:
            stress = "High"
        elif emotion == "neutral":
            stress = "Medium"
        else:
            stress = "Low"

        filename = f"user_{current_user.id}_{int(datetime.utcnow().timestamp())}.jpg"
        filepath = os.path.join(UPLOAD_DIR, filename)
        cv2.imwrite(filepath, img)

        record = models.StressRecord(
            user_id=current_user.id,
            predicted_stress=stress,
            source="webcam",
            image_path=filepath,
            emotion=emotion
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "emotion": emotion,
            "predicted_stress": stress,
            "timestamp": record.created_at
        }

    except Exception as e:
        print("Webcam Error:", e)
        raise HTTPException(status_code=500, detail="Webcam processing failed")
