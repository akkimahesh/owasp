# OWASP ZAP Authenticated DAST Scan using GitHub Actions & Playwright

This project demonstrates how a DevSecOps engineer performs an **authenticated Dynamic Application Security Testing (DAST)** scan using **OWASP ZAP**, **Playwright**, and **GitHub Actions** against a QA environment.

---

# Architecture

```text
Developer Pushes Code
        │
        ▼
GitHub Actions
        │
        ▼
Build Docker Image
        │
        ▼
Push Image to Amazon ECR
        │
        ▼
Deploy to QA Kubernetes Cluster
        │
        ▼
Start OWASP ZAP (Proxy Mode)
        │
        ▼
Playwright Opens Chromium Browser
        │
        ▼
Login using Test Credentials
        │
        ▼
Navigate Protected Pages
        │
        ▼
OWASP ZAP Captures Authenticated Traffic
        │
        ▼
Spider
        │
        ▼
AJAX Spider
        │
        ▼
Active Scan
        │
        ▼
Generate HTML Report
        │
        ▼
Upload Report as GitHub Artifact
```

---

# Application

The QA application used in this example:

Frontend

```
https://dev-ui.schneider.xrdashboard.com
```

Backend

```
https://dev-server.schneider.xrdashboard.com
```

---

# Step 1 - Deploy Application to QA

The CI/CD pipeline first deploys the application into the QA environment.

Example deployment flow:

```text
Developer Push
        │
        ▼
GitHub Actions
        │
        ▼
Build Docker Image
        │
        ▼
Push Image to ECR
        │
        ▼
Deploy to QA Kubernetes Cluster
```

At this stage:

- Application is live.
- Users can access it.
- No security scan has started.
- OWASP ZAP is not running.

---

# Step 2 - Start OWASP ZAP

GitHub Actions starts the OWASP ZAP Docker container.

Example:

```bash
docker run -d \
  --name zap \
  -p 8080:8080 \
  ghcr.io/zaproxy/zaproxy:stable \
  zap.sh \
  -daemon
```

OWASP ZAP now acts as a proxy.

```text
Browser
    │
    ▼
OWASP ZAP Proxy
    │
    ▼
QA Application
```

At this point:

- ZAP is only listening.
- No vulnerabilities are tested.
- Every request passing through port 8080 is captured.

---

# Step 3 - Authenticate using Playwright

Since GitHub Actions has no user, Playwright performs the login automatically.

Playwright actions:

```text
Launch Chromium
        │
        ▼
Open Login Page
        │
        ▼
Enter Username
        │
        ▼
Enter Password
        │
        ▼
Click Login
```

Example:

```javascript
await page.goto("/login/Schneider");

await page.fill('input[type="email"]', process.env.APP_USERNAME);

await page.fill('input[type="password"]', process.env.APP_PASSWORD);

await page.click('button[type="submit"]');
```

After successful authentication the application returns:

```
access_token

session_id

user_id
```

Playwright then navigates through authenticated pages:

```text
Dashboard

↓

Access Control

↓

Users

↓

Content Hub

↓

Reports

↓

Settings
```

Every request flows through ZAP:

```text
Chromium Browser
        │
        ▼
OWASP ZAP Proxy
        │
        ▼
QA Server
```

Now ZAP has discovered authenticated endpoints.

---

# Step 4 - Spider

Spider crawls the application and discovers links.

It behaves similarly to a search engine crawler.

Example:

```text
Dashboard

↓

Users

↓

Roles

↓

Permissions

↓

Settings
```

Spider discovers pages such as:

```
Dashboard

Users

Roles

Permissions

Reports

Settings

Profile

Content Hub
```

Spider capabilities:

- Discovers hyperlinks
- Builds application site map
- Finds URLs

Spider limitations:

- Cannot click buttons
- Cannot execute JavaScript
- Cannot submit forms
- Cannot discover hidden React routes

---

# Step 5 - AJAX Spider

Modern applications built with React, Angular, or Vue generate pages dynamically using JavaScript.

Example:

```html
<button>Load Users</button>
```

Clicking this button executes:

```javascript
fetch("/api/users")
```

Since there is no hyperlink, the normal Spider cannot discover this request.

AJAX Spider launches a real browser and behaves like a real user.

Example:

```text
Open Dashboard
        │
        ▼
Execute JavaScript
        │
        ▼
API Request
        │
        ▼
Dynamic Page Loads
        │
        ▼
More JavaScript Requests
```

AJAX Spider discovers:

- React routes
- Angular routes
- Vue routes
- Hidden menus
- JavaScript-generated URLs
- Dynamic API requests

For Single Page Applications (SPA), AJAX Spider is essential.

---

# Step 6 - Active Scan

Once the application has been fully mapped, Active Scan begins testing for vulnerabilities.

Example request:

```
GET

/api/users?id=5
```

OWASP ZAP automatically injects payloads:

```
?id='

?id=1 OR 1=1

?id=<script>

?id=../../etc/passwd

?id=%00

?id=../../../
```

Active Scan checks for:

- SQL Injection
- Cross Site Scripting (XSS)
- Command Injection
- Path Traversal
- Directory Traversal
- Server Misconfiguration
- Missing Security Headers
- Open Redirect
- SSRF
- CSRF
- Cookie Security
- JWT Security Issues
- Authentication Weaknesses

Since thousands of payloads are tested, Active Scan usually takes much longer than Spider.

Typical duration:

- Small application → 10 minutes
- Medium application → 20–30 minutes
- Large application → 1 hour or more

---

# Step 7 - Generate Security Report

After scanning is complete, OWASP ZAP generates an HTML report.

Example findings:

```
High

SQL Injection

/api/users
```

```
Medium

Missing Content Security Policy Header
```

```
Low

Server Version Disclosure
```

```
Information

X-Powered-By Header
```

Each finding contains:

- Risk Level
- Vulnerability Description
- Affected URL
- Evidence
- Recommendation
- CWE Reference
- OWASP Top 10 Mapping

GitHub Actions uploads the generated report as an artifact.

---

# Complete Workflow

```text
Developer Pushes Code
        │
        ▼
GitHub Actions Pipeline
        │
        ▼
Build Docker Image
        │
        ▼
Push Image to Amazon ECR
        │
        ▼
Deploy to QA Kubernetes Cluster
        │
        ▼
Start OWASP ZAP
        │
        ▼
Launch Chromium using Playwright
        │
        ▼
Authenticate using Test Credentials
        │
        ▼
Navigate Through Protected Pages
        │
        ▼
OWASP ZAP Captures Authenticated Requests
        │
        ▼
Spider Discovers Static URLs
        │
        ▼
AJAX Spider Discovers JavaScript Routes
        │
        ▼
Active Scan Tests Vulnerabilities
        │
        ▼
Generate HTML Report
        │
        ▼
Upload Report to GitHub Artifacts
        │
        ▼
Security Team Reviews Findings
```

---

# Technologies Used

- OWASP ZAP
- Playwright
- GitHub Actions
- Docker
- Kubernetes
- Amazon ECR
- QA Environment
- Chromium Browser

---

# Project Outcome

This project demonstrates how to automate authenticated Dynamic Application Security Testing (DAST) in a CI/CD pipeline. By combining Playwright for browser-based authentication with OWASP ZAP for crawling and vulnerability assessment, protected areas of a web application can be scanned automatically after deployment to QA. The generated security reports help development and security teams identify and remediate vulnerabilities before releasing the application to production.