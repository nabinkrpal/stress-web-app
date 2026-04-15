from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import HTMLResponse
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
############
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)
############15-04-2026 17:21
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
os.environ["DEEPFACE_HOME"] = BASE_DIR
print("DeepFace HOME:", os.environ["DEEPFACE_HOME"])
print("Expected weights path:", os.path.join(os.environ["DEEPFACE_HOME"], ".deepface", "weights"))

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

class FeedbackSchema(BaseModel):
    name: str
    message: str

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

    body = f"""
Hello,

Thank you for registering on StressSens.

To activate your account, please verify your email by clicking the link below:

{link}

If you did not create this account, you can safely ignore this email.

Regards,  
StressSens Team
"""

    send_email(email, "Verify your StressSens account", body)
# def send_verification_email(email, user_id):
#     link = f"https://stress-web.onrender.com/verify-email/{user_id}"
#     send_email(email, "Verify Account", f"Click to verify:\n{link}")

def send_otp_email(email, otp):
    body = f"""
Hello,

We received a request to reset your password for your StressSens account.

Your One-Time Password (OTP) is:

{otp}

This code is valid for 5 minutes.

If you did not request this, please ignore this email.

This is an automated message, please do not reply.

Regards,  
StressSens Team
"""

    send_email(email, "Your StressSens OTP Code", body)

# def send_otp_email(email, otp):
#     send_email(email, "OTP Code", f"Your OTP is {otp} (valid 5 min)")

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
@app.get("/verify-email/{user_id}", response_class=HTMLResponse)
def verify(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return "<h2>❌ Invalid verification link</h2>"
    user.is_verified = True
    db.commit()
    return '''
    <html>
    <head>
    <title>Verified</title>
    </head>
    <body style="text-align:center; font-family:sans-serif; margin-top:50px;">
    <h1 style="color:green;">✅ Email Verified</h1>
    <p>You can now login to your account.</p>
    </body>
    </html>
    '''

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
                # "image": f"https://stress-web.onrender.com{r.image_path}" if r.image_path else None, 17:26 12-04-2026
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

@app.delete("/deactivate-account")
def deactivate(user=Depends(get_current_user), db: Session = Depends(get_db)):
    user.email = f"deleted_{user.id}@anon.com"
    user.name = "Deleted User"
    user.password = ""
    user.is_verified = False
    db.commit()
    return {"message": "Account deactivated"}

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
        
        # filename = f"user_{current_user.id}_{int(datetime.utcnow().timestamp())}.jpg"
        # filepath = os.path.join(UPLOAD_DIR, filename)
        # cv2.imwrite(filepath, img)
        # Convert image to bytes 17:23 15/04/2026
        _, buffer = cv2.imencode(".jpg", img)
        
        upload_result = cloudinary.uploader.upload(
            buffer.tobytes(),
            folder="stress_app"
        )
        
        image_url = upload_result["secure_url"]
        #####

        record = models.StressRecord(
            user_id=current_user.id,
            predicted_stress=stress,
            source="webcam",
            # image_path = f"/uploads/{filename}", 17:24 15/04/2026
            image_path = image_url,
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

# -------- FEEDBACK --------
@app.post("/feedback")
def submit_feedback(
    data: FeedbackSchema,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    feedback = models.Feedback(
        user_id=user.id,
        name=data.name,
        message=data.message
    )

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return {"message": "Feedback submitted successfully"}









