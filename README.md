# 🎯 Student Stress Prediction & Detection Web App

A full-stack AI-powered web application that predicts student stress using academic/lifestyle information and webcam-based facial emotion detection.

## 📌 Features

* 🧠 Predicts **Low, Medium, or High stress** using student lifestyle and academic inputs.
* 📷 Detects facial emotions through the **webcam** using DeepFace.
* 📊 Displays **stress history, distribution, and trends** using charts.
* 📝 Keeps **manual form predictions and webcam predictions separate** in history.
* 🔐 Provides **registration, login, email verification, JWT authentication, and password reset with OTP**.
* 💡 Provides personalized suggestions based on the predicted stress level.
* 📱 Responsive dashboard designed for desktop and mobile devices.
* ☁️ Deployed using **Render, Vercel, and AWS MySQL**.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Axios, React Router, Chart.js
* **Backend:** Python, FastAPI, SQLAlchemy
* **Machine Learning:** Scikit-learn, Pandas, NumPy, Joblib
* **Computer Vision:** DeepFace, OpenCV
* **Authentication:** JWT, Argon2, SMTP/Email OTP
* **Database:** MySQL
* **Deployment:** Render, Vercel, AWS

---

## 🧠 Project Overview

### 🔍 Problem Statement

Students often experience stress due to academic workload, insufficient sleep, excessive screen time, attendance issues, and deadline pressure. However, students may not always recognize their stress level or have an easy way to monitor it.

The project aims to provide a simple web-based system that can estimate a student's stress level from lifestyle and academic information while also providing an additional webcam-based facial emotion analysis.

### 💡 Approach

* The user enters lifestyle and academic information such as sleep hours, study hours, screen time, attendance, and deadline pressure.
* The trained machine learning model processes these inputs and predicts the student's stress level as **Low, Medium, or High**.
* The application also provides a webcam-based detection system using **DeepFace** to identify facial emotions.
* Detected emotions are mapped to an estimated stress level.
* Both prediction methods are stored in the MySQL database with their source identified as either **form** or **webcam**.
* The dashboard displays prediction results and recommendations, while the history page provides charts and separate records for both prediction methods.

### 📊 Output / Result

* Provides an instant **stress-level prediction**.
* Displays personalized suggestions based on the predicted stress level.
* Provides webcam-based **emotion and stress estimation**.
* Maintains a history of previous predictions.
* Shows **stress distribution and stress trends over time** through charts.
* Calculates lifestyle statistics such as **average sleep from manual predictions**.
* Provides a complete authenticated web application that can be accessed through a deployed frontend and backend.
