import mysql.connector
import hashlib

# 🔗 Database Connection
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Anushka@123",
        database="college_db"
    )
    print("✅ DB Connected")
except Exception as e:
    print("❌ DB Error:", e)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

from googletrans import Translator
translator = Translator()

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random

app = Flask(__name__, static_folder='.')
CORS(app)

# 🧠 Memory (context)
last_topic = None

# 🧠 Knowledge Base
knowledge = {
    "fees": """💰 **Fees Structure**
• B.E.: ₹1,00,000 – ₹1,30,000 per year  
• MBA: ₹80,000 – ₹1,00,000 per year  
• Scholarships available (SC/ST/OBC/EWS)  
• Hostel & transport charges are separate""",

    "courses": """📚 **Courses Offered**
• Computer Science Engineering (CSE)  
• Information Technology (IT)  
• Electronics & Telecommunication (E&TC)  
• Electrical Engineering (EE)  
• Mechanical Engineering (ME)  
• Civil Engineering (CE)  
• MBA (Postgraduate)""",

    "admission": """📋 **Admission Process**
• B.E.: Through MHT-CET or JEE Main  
• CAP rounds conducted by DTE Maharashtra  
• Lateral entry (Direct 2nd Year) available  
• Required Documents:
  - 10th & 12th marksheets  
  - CET/JEE scorecard  
  - Aadhaar & domicile""",

    "placement": """💼 **Placements**
• Placement rate: 90%+  
• Average package: ₹3–5 LPA  
• Highest package: ₹10 LPA  
• Top recruiters:
  - TCS, Infosys, Wipro  
  - Accenture, Capgemini  
  - Tech Mahindra, Cognizant  
• Training: Aptitude, GD, HR interviews""",

    "hostel": """🏠 **Hostel Facilities**
• Separate hostels for boys & girls  
• Mess (veg & non-veg)  
• 24/7 security & CCTV  
• Warden supervision""",

    "contact": """📞 **Contact Details**
• Phone: +91-712-2801000  
• Website: www.svpcet.org  
• Email: info@svpcet.org  
• Address: Nagpur, Maharashtra"""
}

# 🎯 Smart NLP Response Function
def get_response(msg):
    global last_topic
    msg = msg.lower()

    if any(word in msg for word in ["hi", "hello", "hey"]):
        return random.choice([
            "Hello 👋! Welcome to PallottiBot. How can I help you?",
            "Hi there 😊! Ask me anything about SVPCET.",
            "Hey! I’m PallottiBot 🤖 — what would you like to know?"
        ])

    elif any(word in msg for word in ["fee", "fees", "cost", "price"]):
        last_topic = "fees"
        return knowledge["fees"]

    elif any(word in msg for word in ["course", "branch", "program"]):
        last_topic = "courses"
        return knowledge["courses"]

    elif any(word in msg for word in ["admission", "apply", "join"]):
        last_topic = "admission"
        return knowledge["admission"]

    elif any(word in msg for word in ["placement", "job", "company"]):
        last_topic = "placement"
        return knowledge["placement"]

    elif any(word in msg for word in ["hostel", "stay", "accommodation"]):
        if last_topic == "fees":
            return "🏠 Hostel fees are separate from academic fees."
        last_topic = "hostel"
        return knowledge["hostel"]

    elif any(word in msg for word in ["contact", "phone", "email", "address"]):
        last_topic = "contact"
        return knowledge["contact"]

    elif "thank" in msg:
        return "You're welcome 😊! Let me know if you have more questions."

    else:
        return """🤖 I didn’t understand that.

You can ask:
• Fees  
• Courses  
• Admission  
• Placement  
• Hostel  
• Contact 😊"""

# ✅ Home route (opens website)
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# ✅ Serve CSS, JS, images
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)


# ================== AUTH SYSTEM ==================

    # ================== AUTH SYSTEM ==================
import json
import os

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    users = load_users()

    if username in users:
        return jsonify({"status": "error", "msg": "User already exists"})

    users[username] = hash_password(password)
    save_users(users)

    return jsonify({"status": "success"})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    print("USERNAME RECEIVED:", username)
    password = data.get("password")

    if not username:
       return jsonify({"reply": "⚠️ Please login first!"})  

    users = load_users()

    if username in users and users[username] == hash_password(password):
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "msg": "Invalid credentials"})

# 🔗 Chat API
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_msg = data.get("message")
    username = data.get("username")

    if not username:
        return jsonify({"reply": "⚠️ Please login first!"})

    lang = data.get("lang", "en")

    # 🌍 Translate
    if lang != "en":
        user_msg = translator.translate(user_msg, dest="en").text

    msg = user_msg.lower()

    # 🔥 DEFINE ROLE HERE
    role = "admin" if username == "admin" else "student"

    # ================== 🎯 ATTENDANCE ==================
    if "attendance" in msg:

        cursor = db.cursor()

        # 👑 ADMIN → FULL CLASS
        if role == "admin":

            query = """
            SELECT 
                s.name,
                SUM(a.attended_classes) * 100 / NULLIF(SUM(a.total_classes),0) AS percentage
            FROM students s
            JOIN attendance a ON s.roll_no = a.roll_no
            GROUP BY s.roll_no
            ORDER BY percentage DESC
            """

            cursor.execute(query)
            results = cursor.fetchall()

            if results:
                reply = "📊 **Full Class Attendance Report**\n\n"

                for i, (name, percent) in enumerate(results):
                    status = "⚠️" if percent < 75 else "✅"
                    crown = " 👑" if i == 0 else ""
                    reply += f"{i+1}. {name} – {percent:.2f}% {status}{crown}\n"
            else:
                reply = "No data found ❌"

        # 👤 STUDENT → OWN
        else:

            query = """
            SELECT 
                s.name,
                SUM(a.attended_classes) * 100 / NULLIF(SUM(a.total_classes),0) AS percentage
            FROM students s
            JOIN attendance a ON s.roll_no = a.roll_no
            WHERE s.username = %s
            GROUP BY s.roll_no
            """

            cursor.execute(query, (username,))
            result = cursor.fetchone()

            if result:
                name, percent = result

                if percent < 75:
                    reply = f"{name}, your attendance is {percent:.2f}% ⚠️ BELOW 75%!"
                else:
                    reply = f"{name}, your attendance is {percent:.2f}% ✅ Good"
            else:
                reply = "User not found ❌"

    # ================== 🤖 NORMAL CHAT ==================
    else:
        reply = get_response(msg)

    # 🌍 Translate back
    if lang != "en":
        reply = translator.translate(reply, dest=lang).text

    return jsonify({"reply": reply})



if __name__ == "__main__":
    app.run(debug=True)