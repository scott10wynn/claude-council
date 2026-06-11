import os
import threading
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

from database import (
    init_db, save_profile, get_profile,
    add_application, get_applications, get_application,
    update_application_status, mark_applied, delete_application
)
from pdf_parser import extract_text_from_pdf
from cover_letter import generate_cover_letter
from email_sender import send_application_email
from form_filler import open_and_fill_form

app = Flask(__name__, static_folder="static")
CORS(app)

_BASE = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(_BASE, "uploads")
ALLOWED_EXTENSIONS = {"pdf"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10MB

init_db()


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("static", filename)


# ── Profile ──────────────────────────────────────────────────────────────────

@app.route("/api/profile", methods=["GET"])
def api_get_profile():
    profile = get_profile()
    return jsonify(profile or {})


@app.route("/api/profile/upload-resume", methods=["POST"])
def api_upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["resume"]
    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "Only PDF files are accepted"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    resume_text = extract_text_from_pdf(filepath)
    return jsonify({"resume_text": resume_text, "filename": filename})


@app.route("/api/set-env", methods=["POST"])
def api_set_env():
    data = request.json or {}
    env_path = os.path.join(_BASE, ".env")
    # Read existing lines, replacing any matching keys
    lines = []
    keys_written = set()
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                key = line.split("=", 1)[0].strip()
                if key in data:
                    lines.append(f"{key}={data[key]}\n")
                    keys_written.add(key)
                else:
                    lines.append(line)
    for key, value in data.items():
        if key not in keys_written:
            lines.append(f"{key}={value}\n")
    with open(env_path, "w") as f:
        f.writelines(lines)
    # Apply immediately to running process
    for key, value in data.items():
        os.environ[key] = value
    return jsonify({"success": True})


@app.route("/api/profile", methods=["POST"])
def api_save_profile():
    data = request.json
    save_profile(
        name=data.get("name", ""),
        email=data.get("email", ""),
        phone=data.get("phone", ""),
        resume_text=data.get("resume_text", ""),
        resume_filename=data.get("resume_filename", ""),
    )
    return jsonify({"success": True})


# ── Applications ──────────────────────────────────────────────────────────────

@app.route("/api/applications", methods=["GET"])
def api_list_applications():
    return jsonify(get_applications())


@app.route("/api/applications/<int:app_id>", methods=["GET"])
def api_get_application(app_id):
    app_data = get_application(app_id)
    if not app_data:
        return jsonify({"error": "Not found"}), 404
    return jsonify(app_data)


@app.route("/api/applications/<int:app_id>", methods=["DELETE"])
def api_delete_application(app_id):
    delete_application(app_id)
    return jsonify({"success": True})


@app.route("/api/applications/<int:app_id>/status", methods=["PATCH"])
def api_update_status(app_id):
    data = request.json
    update_application_status(app_id, data["status"], data.get("notes"))
    return jsonify({"success": True})


# ── Cover Letter Generation ───────────────────────────────────────────────────

@app.route("/api/generate-cover-letter", methods=["POST"])
def api_generate_cover_letter():
    data = request.json
    profile = get_profile()
    if not profile or not profile.get("resume_text"):
        return jsonify({"error": "Upload your resume first in the Profile tab"}), 400
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return jsonify({"error": "ANTHROPIC_API_KEY not set in .env"}), 400

    try:
        letter = generate_cover_letter(
            resume_text=profile["resume_text"],
            applicant_name=profile.get("name", ""),
            applicant_email=profile.get("email", ""),
            company=data["company"],
            job_title=data["job_title"],
            job_description=data.get("job_description", ""),
        )
        return jsonify({"cover_letter": letter})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Save Job + Apply ──────────────────────────────────────────────────────────

@app.route("/api/applications", methods=["POST"])
def api_add_application():
    data = request.json
    app_id = add_application(
        company=data["company"],
        job_title=data["job_title"],
        job_url=data.get("job_url", ""),
        job_description=data.get("job_description", ""),
        cover_letter=data.get("cover_letter", ""),
        notes=data.get("notes", ""),
    )
    return jsonify({"id": app_id})


@app.route("/api/applications/<int:app_id>/send-email", methods=["POST"])
def api_send_email(app_id):
    data = request.json
    profile = get_profile()
    app_data = get_application(app_id)
    if not app_data:
        return jsonify({"error": "Application not found"}), 404

    profile = profile or {}
    result = send_application_email(
        smtp_host=data["smtp_host"],
        smtp_port=int(data.get("smtp_port", 587)),
        smtp_user=data["smtp_user"],
        smtp_password=data["smtp_password"],
        from_email=profile.get("email") or data["smtp_user"],
        to_email=data["to_email"],
        applicant_name=profile.get("name", ""),
        job_title=app_data["job_title"],
        company=app_data["company"],
        cover_letter=app_data.get("cover_letter") or "",
        use_tls=data.get("use_tls", True),
    )

    if result["success"]:
        mark_applied(app_id)
    return jsonify(result)


@app.route("/api/applications/<int:app_id>/auto-fill", methods=["POST"])
def api_auto_fill(app_id):
    app_data = get_application(app_id)
    if not app_data:
        return jsonify({"error": "Application not found"}), 404
    if not app_data.get("job_url"):
        return jsonify({"error": "No job URL saved for this application"}), 400

    profile = get_profile()

    # Run browser automation in background thread so request returns immediately
    def run_fill():
        open_and_fill_form(app_data["job_url"], profile or {}, app_data.get("cover_letter", ""))

    thread = threading.Thread(target=run_fill, daemon=True)
    thread.start()

    return jsonify({"success": True, "message": "Browser opened — review and submit manually. It will close after 10 minutes."})


if __name__ == "__main__":
    init_db()
    print("\n  Job Applicator running at http://localhost:5050\n")
    app.run(debug=True, port=5050, host="0.0.0.0")
