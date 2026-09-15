import os
import re
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500").split(",")
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PHONE_PATTERN = re.compile(r"^[0-9+()\-\s]{7,20}$")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
COMPANY_EMAIL = os.getenv("COMPANY_EMAIL", "hello@whimsyBrews.com")
SMTP_CONFIGURED = all([SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD])


def send_email(subject: str, body: str) -> bool:
    """Send a plain-text email via SMTP. Returns True on success, False if
    SMTP isn't configured or sending fails — callers must not claim success
    when this returns False."""
    if not SMTP_CONFIGURED:
        app.logger.info("SMTP not configured — skipping real email send.")
        return False
    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = SMTP_USERNAME
        msg["To"] = COMPANY_EMAIL
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, [COMPANY_EMAIL], msg.as_string())
        return True
    except Exception as exc:  # noqa: BLE001
        app.logger.error("Email send failed: %s", exc)
        return False


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    phone = (data.get("phone") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not phone or not PHONE_PATTERN.match(phone):
        errors["phone"] = "A valid mobile number is required."
    if not email or not EMAIL_PATTERN.match(email):
        errors["email"] = "A valid email address is required."
    if not message or len(message) < 10:
        errors["message"] = "Message must be at least 10 characters."

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    body = f"New contact inquiry\n\nName: {name}\nPhone: {phone}\nEmail: {email}\n\nMessage:\n{message}"
    emailed = send_email("New contact inquiry — Aurelia Coffee & Café", body)

    # Always store/log the inquiry regardless of email delivery, so nothing is lost.
    app.logger.info("Contact inquiry received: %s <%s>", name, email)

    return jsonify({
        "success": True,
        "emailed": emailed,
        "message": "Inquiry received." if emailed else "Inquiry received. (Email delivery is not configured on this server.)",
    })


@app.route("/api/reservation", methods=["POST"])
def reservation():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    date = (data.get("date") or "").strip()
    time_ = (data.get("time") or "").strip()
    guests = data.get("guests")
    special_request = (data.get("request") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not email or not EMAIL_PATTERN.match(email):
        errors["email"] = "A valid email address is required."
    if not date:
        errors["date"] = "Date is required."
    if not time_:
        errors["time"] = "Time is required."
    try:
        guests_num = int(guests)
        if guests_num < 1 or guests_num > 20:
            errors["guests"] = "Guests must be between 1 and 20."
    except (TypeError, ValueError):
        errors["guests"] = "Guests must be a number."

    if errors:
        return jsonify({"success": False, "errors": errors}), 400

    body = (
        f"New table reservation\n\nName: {name}\nEmail: {email}\nDate: {date}\n"
        f"Time: {time_}\nGuests: {guests}\nSpecial request: {special_request or '—'}"
    )
    emailed = send_email("New reservation request — Aurelia Coffee & Café", body)
    app.logger.info("Reservation received: %s for %s guests on %s at %s", name, guests, date, time_)

    return jsonify({
        "success": True,
        "emailed": emailed,
        "message": "Reservation received." if emailed else "Reservation received. (Email delivery is not configured on this server.)",
    })


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
