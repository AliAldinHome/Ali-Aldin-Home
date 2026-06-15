# Switches all email sending from Gmail/nodemailer to Resend
# Safe line-level replacements only

import re, os

BASE = '/Users/AliArawi/Downloads/heartland-crm'

# ── 1. lib/emails.js ──
p = os.path.join(BASE, 'lib/emails.js')
em = open(p).read()
em = em.replace(
    "const nodemailer = require('nodemailer');",
    "const { Resend } = require('resend');\nconst resend = new Resend(process.env.RESEND_API_KEY);"
)
em = re.sub(
    r"// ── Transporter ─+\nfunction getTransporter\(\) \{.*?\n\}",
    "// ── Sender config ──\nconst FROM = 'Ali Aldin — The Heartland Agent <aaldin@heartlandagent.ca>';\nconst REPLY_TO = process.env.ADMIN_EMAIL || 'aaldin.home@gmail.com';",
    em, flags=re.DOTALL
)
em = re.sub(
    r"// ── SEND helper ─+\nasync function send\(\{ to, from, subject, html \}\) \{\n  const t = getTransporter\(\);\n  await t\.sendMail\(\{\n    from: from \|\| `\"Ali Aldin — The Heartland Agent\" <\$\{process\.env\.GMAIL_USER\}>`,\n    to, subject, html\n  \}\);\n\}",
    "// ── SEND helper (Resend) ──\nasync function send({ to, from, subject, html, text, replyTo }) {\n  await resend.emails.send({\n    from: from || FROM,\n    to, subject, html, text,\n    replyTo: replyTo || REPLY_TO\n  });\n}",
    em, flags=re.DOTALL
)
open(p, 'w').write(em)
print('OK lib/emails.js')

# ── 2. api/submit.js ──
p = os.path.join(BASE, 'api/submit.js')
s = open(p).read()
s = s.replace(
    "      to: process.env.GMAIL_USER,\n      from: `\"Heartland CRM\" <${process.env.GMAIL_USER}>`,\n      subject: notif.subject,",
    "      to: process.env.ADMIN_EMAIL || 'aaldin.home@gmail.com',\n      from: 'Heartland CRM <aaldin@heartlandagent.ca>',\n      subject: notif.subject,"
)
open(p, 'w').write(s)
print('OK api/submit.js')

# ── Helper: replace a nodemailer block with send() in the api files ──
def swap_nodemailer(path, subject_line, body_line):
    txt = open(path).read()
    # add send import if missing
    if "require('../lib/emails')" not in txt:
        txt = txt.replace(
            "const {",
            "const { send } = require('../lib/emails');\nconst {",
            1
        )
    # Replace the nodemailer transport creation + sendMail with a send() call
    pattern = (
        r"(?:const nodemailer = require\('nodemailer'\);\n\s*)?"
        r"const t = nodemailer\.createTransport\(\{\n"
        r"\s*service: 'gmail',\n"
        r"\s*auth: \{ user: process\.env\.GMAIL_USER, pass: process\.env\.GMAIL_APP_PASSWORD \}\n"
        r"\s*\}\);\n"
        r"\s*await t\.sendMail\(\{\n"
        r"\s*from: `\"Heartland CRM\" <\$\{process\.env\.GMAIL_USER\}>`,\n"
        r"\s*to: process\.env\.GMAIL_USER,\n"
        r"(\s*subject: [^\n]+\n)"
        r"(\s*text: [^\n]+\n)"
        r"\s*\}\);"
    )
    def repl(m):
        subj = m.group(1).strip()
        body = m.group(2).strip()
        return ("await send({\n"
                "      to: process.env.ADMIN_EMAIL || 'aaldin.home@gmail.com',\n"
                "      from: 'Heartland CRM <aaldin@heartlandagent.ca>',\n"
                "      " + subj + "\n"
                "      " + body + "\n"
                "    });")
    new = re.sub(pattern, repl, txt, flags=re.DOTALL)
    open(path, 'w').write(new)

swap_nodemailer(os.path.join(BASE, 'api/unsubscribe.js'), None, None)
print('OK api/unsubscribe.js')
swap_nodemailer(os.path.join(BASE, 'api/cron-daily.js'), None, None)
print('OK api/cron-daily.js')
swap_nodemailer(os.path.join(BASE, 'api/market-update.js'), None, None)
print('OK api/market-update.js')

# ── package.json ──
p = os.path.join(BASE, 'package.json')
pk = open(p).read()
pk = pk.replace('"nodemailer": "^6.9.9"', '"resend": "^4.0.0"')
open(p, 'w').write(pk)
print('OK package.json')

print('DONE')
