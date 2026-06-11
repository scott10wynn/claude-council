import os
import sqlite3
from datetime import datetime

_BASE = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(_BASE, "data", "applications.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            job_title TEXT NOT NULL,
            job_url TEXT,
            job_description TEXT,
            status TEXT DEFAULT 'pending',
            cover_letter TEXT,
            notes TEXT,
            applied_at TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY,
            name TEXT,
            email TEXT,
            phone TEXT,
            resume_text TEXT,
            resume_filename TEXT,
            updated_at TEXT
        );
    """)
    conn.commit()
    conn.close()


def save_profile(name, email, phone, resume_text, resume_filename):
    conn = get_db()
    now = datetime.utcnow().isoformat()
    existing = conn.execute("SELECT id FROM profile WHERE id = 1").fetchone()
    if existing:
        conn.execute(
            "UPDATE profile SET name=?, email=?, phone=?, resume_text=?, resume_filename=?, updated_at=? WHERE id=1",
            (name, email, phone, resume_text, resume_filename, now)
        )
    else:
        conn.execute(
            "INSERT INTO profile (id, name, email, phone, resume_text, resume_filename, updated_at) VALUES (1,?,?,?,?,?,?)",
            (name, email, phone, resume_text, resume_filename, now)
        )
    conn.commit()
    conn.close()


def get_profile():
    conn = get_db()
    row = conn.execute("SELECT * FROM profile WHERE id=1").fetchone()
    conn.close()
    return dict(row) if row else None


def add_application(company, job_title, job_url, job_description, cover_letter, notes=""):
    conn = get_db()
    now = datetime.utcnow().isoformat()
    cur = conn.execute(
        "INSERT INTO applications (company, job_title, job_url, job_description, cover_letter, notes, status, created_at) VALUES (?,?,?,?,?,?,?,?)",
        (company, job_title, job_url, job_description, cover_letter, notes, "pending", now)
    )
    app_id = cur.lastrowid
    conn.commit()
    conn.close()
    return app_id


def get_applications():
    conn = get_db()
    rows = conn.execute("SELECT * FROM applications ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_application(app_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM applications WHERE id=?", (app_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def update_application_status(app_id, status, notes=None):
    conn = get_db()
    if notes is not None:
        conn.execute("UPDATE applications SET status=?, notes=? WHERE id=?", (status, notes, app_id))
    else:
        conn.execute("UPDATE applications SET status=? WHERE id=?", (status, app_id))
    conn.commit()
    conn.close()


def mark_applied(app_id):
    conn = get_db()
    now = datetime.utcnow().isoformat()
    conn.execute("UPDATE applications SET status='applied', applied_at=? WHERE id=?", (now, app_id))
    conn.commit()
    conn.close()


def delete_application(app_id):
    conn = get_db()
    conn.execute("DELETE FROM applications WHERE id=?", (app_id,))
    conn.commit()
    conn.close()
