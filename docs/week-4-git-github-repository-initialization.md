# Week 4: Git and GitHub Repository Initialization
## Factory Energy Consumption Dashboard

---

## 1. Repository Structure & Configuration
The project is initialized with a structured layout separating documentation, backend code, frontend interface, database scripts, and CI/CD configurations:

```
factory-energy-consumption-dashboard/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── backend/
│   ├── src/main/java/com/factory/energydashboard/
│   ├── src/test/java/com/factory/energydashboard/
│   ├── pom.xml
│   └── mvnw.cmd
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── docs/
│   ├── week-1-problem-definition-and-scope.md
│   ├── week-2-agile-planning-and-devops-workflow.md
│   ├── week-3-requirements-architecture-tech-setup.md
│   └── ... (week 1 to 11 docs)
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## 2. GitHub Issue and PR Templates

### Issue Template: Bug Report (`.github/ISSUE_TEMPLATE/bug_report.md`)
```markdown
---
name: Bug Report
about: Create a report to help us fix defects
title: '[BUG] '
labels: bug
assignees: ''
---
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots / Logs**
Attach error stacktrace or console screenshots.
```

### Issue Template: Feature Request (`.github/ISSUE_TEMPLATE/feature_request.md`)
```markdown
---
name: Feature Request
about: Suggest an idea or feature enhancement
title: '[FEAT] '
labels: enhancement
assignees: ''
---
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.
```

---

## 3. Git Branching Policy & Conventional Commit Guidelines

### Branch Naming Conventions
- `main`: Production-ready release baseline. Strictly protected; requires passing Jenkins CI/CD build and PR review.
- `develop`: Integration branch for active sprint features.
- `feature/<feature-name>`: Topic branches created off `develop` (e.g., `feature/energy-data-ingestion`, `feature/alert-management`).
- `bugfix/<bug-name>`: Bug fixes created off `develop`.
- `release/vX.Y.Z`: Release candidate branch for final regression testing and version tagging.

### Conventional Commit Format
All commit messages must follow the standard syntax: `<type>(<scope>): <short description>`
- `feat(ingestion)`: Implement REST endpoint for telemetry ingestion
- `feat(dashboard)`: Add summary KPI metric cards to UI
- `fix(alerts)`: Fix alert status calculation threshold logic
- `docs(readme)`: Update week-4 repository setup instructions
- `test(selenium)`: Add end-to-end Selenium test cases for drill-down modal

---

## 4. Initial Repository Commits Evidence

```bash
# Git Repository Initialization Log
git init
git add .
git commit -m "chore(init): initialize factory energy dashboard repository structure, docs, and application skeleton"
git branch -M main
git checkout -b develop
```

---
*Document Version: 1.0.0 | Author: DevOps & Lead Engineer*
