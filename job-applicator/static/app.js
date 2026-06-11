// ── State ────────────────────────────────────────────────────────────────────
let currentAppId = null;
let profile = {};

// ── Tabs ─────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'tracker') loadApplications();
  });
});

// ── Profile ───────────────────────────────────────────────────────────────────
async function loadProfile() {
  const res = await fetch('/api/profile');
  profile = await res.json();
  if (profile.name) document.getElementById('profile-name').value = profile.name;
  if (profile.email) document.getElementById('profile-email').value = profile.email;
  if (profile.phone) document.getElementById('profile-phone').value = profile.phone;
  if (profile.resume_text) {
    document.getElementById('profile-resume-text').value = profile.resume_text;
    document.getElementById('resume-text-group').style.display = 'block';
    document.getElementById('resume-filename').textContent = profile.resume_filename || 'Uploaded';
  }
}

async function saveProfile() {
  const name = document.getElementById('profile-name').value.trim();
  const email = document.getElementById('profile-email').value.trim();
  const phone = document.getElementById('profile-phone').value.trim();
  const resume_text = document.getElementById('profile-resume-text').value.trim();
  const resume_filename = document.getElementById('resume-filename').textContent;
  const apiKey = document.getElementById('anthropic-key').value.trim();

  if (apiKey) {
    await fetch('/api/set-env', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ANTHROPIC_API_KEY: apiKey })
    }).catch(() => {});
  }

  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, resume_text, resume_filename })
  });
  const data = await res.json();
  showStatus('profile-status', data.success ? 'Profile saved!' : data.error, data.success ? 'success' : 'error');
}

function toggleResumePreview() {
  const el = document.getElementById('profile-resume-text');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// File upload
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('resume-file');

uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) uploadResume(file);
});
uploadArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) uploadResume(fileInput.files[0]);
});

async function uploadResume(file) {
  document.getElementById('resume-filename').textContent = 'Uploading...';
  const formData = new FormData();
  formData.append('resume', file);
  const res = await fetch('/api/profile/upload-resume', { method: 'POST', body: formData });
  const data = await res.json();
  if (data.resume_text) {
    document.getElementById('profile-resume-text').value = data.resume_text;
    document.getElementById('resume-text-group').style.display = 'block';
    document.getElementById('resume-filename').textContent = data.filename;
    profile.resume_text = data.resume_text;
    showStatus('profile-status', 'Resume extracted successfully! Review text above then save your profile.', 'success');
  } else {
    document.getElementById('resume-filename').textContent = 'Upload failed';
    showStatus('profile-status', data.error || 'Upload failed', 'error');
  }
}

// ── Apply Tab ─────────────────────────────────────────────────────────────────
async function generateCoverLetter() {
  const company = document.getElementById('apply-company').value.trim();
  const job_title = document.getElementById('apply-title').value.trim();
  const job_description = document.getElementById('apply-description').value.trim();

  if (!company || !job_title) {
    showStatus('apply-status', 'Enter company name and job title first.', 'error');
    return;
  }
  if (!profile.resume_text) {
    showStatus('apply-status', 'Upload your resume in the Profile tab first.', 'error');
    return;
  }

  const btn = document.getElementById('gen-btn');
  btn.disabled = true;
  btn.textContent = '⏳ Generating...';
  showStatus('apply-status', 'Generating cover letter with Claude AI...', 'info');

  const res = await fetch('/api/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company, job_title, job_description })
  });
  const data = await res.json();

  btn.disabled = false;
  btn.textContent = '✨ Generate with AI';

  if (data.cover_letter) {
    document.getElementById('apply-cover-letter').value = data.cover_letter;
    showStatus('apply-status', 'Cover letter generated! Review and edit before saving.', 'success');
  } else {
    showStatus('apply-status', data.error || 'Generation failed.', 'error');
  }
}

async function saveApplication() {
  const company = document.getElementById('apply-company').value.trim();
  const job_title = document.getElementById('apply-title').value.trim();
  if (!company || !job_title) {
    showStatus('apply-status', 'Company and job title are required.', 'error');
    return;
  }

  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company,
      job_title,
      job_url: document.getElementById('apply-url').value.trim(),
      job_description: document.getElementById('apply-description').value.trim(),
      cover_letter: document.getElementById('apply-cover-letter').value.trim(),
      notes: document.getElementById('apply-notes').value.trim()
    })
  });
  const data = await res.json();
  if (data.id) {
    showStatus('apply-status', `Saved! Open the Tracker tab to send your application. (ID: ${data.id})`, 'success');
    updateBadge();
    // Clear form
    ['apply-company','apply-title','apply-url','apply-description','apply-cover-letter','apply-notes']
      .forEach(id => document.getElementById(id).value = '');
  } else {
    showStatus('apply-status', data.error || 'Save failed.', 'error');
  }
}

// ── Tracker ───────────────────────────────────────────────────────────────────
async function loadApplications() {
  const filter = document.getElementById('status-filter').value;
  const res = await fetch('/api/applications');
  const allApps = await res.json();
  updateBadge(allApps.length);
  let apps = filter ? allApps.filter(a => a.status === filter) : allApps;

  const list = document.getElementById('apps-list');
  if (!apps.length) {
    list.innerHTML = `<div class="empty-state"><p>📭</p><p>No applications yet.</p><p style="font-size:13px">Use the "Apply to Job" tab to get started.</p></div>`;
    return;
  }

  list.innerHTML = apps.map(app => `
    <div class="app-card" onclick="openDetail(${app.id})">
      <div class="app-card-status status-dot-${app.status}"></div>
      <div class="app-card-body">
        <div class="app-card-title">${esc(app.job_title)}</div>
        <div class="app-card-meta">${esc(app.company)} &bull; ${formatDate(app.created_at)}</div>
      </div>
      <div class="app-card-right">
        <span class="status-pill status-${app.status}">${app.status}</span>
        ${app.applied_at ? `<div style="font-size:11px;color:var(--text2);margin-top:4px">Applied ${formatDate(app.applied_at)}</div>` : ''}
      </div>
    </div>
  `).join('');
}

async function openDetail(id) {
  currentAppId = id;
  const res = await fetch(`/api/applications/${id}`);
  const app = await res.json();

  document.getElementById('detail-title').textContent = app.job_title;
  document.getElementById('detail-company').textContent = app.company;
  document.getElementById('detail-status-badge').textContent = app.status;
  document.getElementById('detail-status-badge').className = `badge status-pill status-${app.status}`;
  document.getElementById('detail-status-select').value = app.status;
  document.getElementById('detail-cover-letter').value = app.cover_letter || '';
  document.getElementById('detail-notes').value = app.notes || '';
  clearStatus('detail-status');

  document.getElementById('detail-modal').classList.remove('hidden');
}

async function updateStatus() {
  const status = document.getElementById('detail-status-select').value;
  const notes = document.getElementById('detail-notes').value;
  await fetch(`/api/applications/${currentAppId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes })
  });
  document.getElementById('detail-status-badge').textContent = status;
  document.getElementById('detail-status-badge').className = `badge status-pill status-${status}`;
  loadApplications();
}

async function deleteApp() {
  if (!confirm('Delete this application?')) return;
  await fetch(`/api/applications/${currentAppId}`, { method: 'DELETE' });
  closeModal('detail-modal');
  loadApplications();
}

async function triggerAutoFill() {
  showStatus('detail-status', 'Opening browser — fill in your details and submit manually. The browser will close automatically after 10 minutes.', 'info');
  const res = await fetch(`/api/applications/${currentAppId}/auto-fill`, { method: 'POST' });
  const data = await res.json();
  showStatus('detail-status', data.message || (data.success ? 'Browser opened!' : data.error), data.success ? 'info' : 'error');
}

// ── Email Modal ───────────────────────────────────────────────────────────────
function openEmailModal() {
  if (profile.email) document.getElementById('smtp-user').value = profile.email;
  document.getElementById('smtp-host').value = 'smtp.gmail.com';
  clearStatus('email-status');
  closeModal('detail-modal');
  document.getElementById('email-modal').classList.remove('hidden');
}

async function sendEmail() {
  const toEmail = document.getElementById('email-to').value.trim();
  if (!toEmail) { showStatus('email-status', 'Enter recipient email.', 'error'); return; }

  const res = await fetch(`/api/applications/${currentAppId}/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_email: toEmail,
      smtp_host: document.getElementById('smtp-host').value.trim(),
      smtp_port: document.getElementById('smtp-port').value,
      smtp_user: document.getElementById('smtp-user').value.trim(),
      smtp_password: document.getElementById('smtp-password').value,
      use_tls: true
    })
  });
  const data = await res.json();
  showStatus('email-status', data.message, data.success ? 'success' : 'error');
  if (data.success) {
    loadApplications();
    setTimeout(() => closeModal('email-modal'), 2000);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function showStatus(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'status-msg ' + type;
}

function clearStatus(id) {
  const el = document.getElementById(id);
  el.className = 'status-msg';
  el.textContent = '';
}

function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + (iso.endsWith('Z') ? '' : 'Z'));
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

async function updateBadge(count) {
  if (count === undefined) {
    const res = await fetch('/api/applications');
    const apps = await res.json();
    count = apps.length;
  }
  document.getElementById('app-count').textContent = count;
}

// Close modals on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────
loadProfile();
updateBadge();
