# Onboarding Form Application

A React-based web application for collecting and managing onboarding information, including business cases, goals, key players, technical stack details, feature requests, and trouble areas.

## Features

### Primary Business Case
- Multi-line text input for describing the primary business case

### Goals Section
- Short-term goals
- Medium-term goals
- Long-term goals
- Each goal has a multi-line text input

### Key Players Section
- Add/remove key players with the following information:
  - Name
  - Focus Area
  - Geographic Location
  - KPIs

### Technical Stack Section
Multi-select dropdowns with "Other" free text options for:
- Source Control
  - GitHub, GitLab, BitBucket Cloud, BitBucket Stash, Azure Repos, Azure TFS, Gerrit, AWS Code Commit
- CI/CD
  - Azure Pipelines, CircleCI, Drone CI, GitHub Actions, GitLab CI/CD, Jenkins
- Registry
  - Amazon ECR, Azure Container Registry, Docker Hub, GitLab Container Registry, Google Artifact Registry, Harbor, JFrog Artifactory
- Cloud Deployment
  - AWS, Azure
- Kubernetes
  - AKS, EKS
- Project Management
  - Jira, Asana, Azure Boards, Github Issues, Monday, ServiceNow
- Dev Alerts
  - Slack, Microsoft Teams

### Feature Requests Section
- Add/remove feature requests with:
  - Description
  - Priority
  - Status
  - Due Date (using date picker)

### Trouble Areas Section
- Multi-line text input for describing trouble areas

### PDF Generation
- Generate a PDF report containing all form data
- Organized sections with proper formatting
- Includes all selected options and free text entries

## Technical Stack
- React with TypeScript
- Material-UI components
- Dayjs for date handling
- jsPDF for PDF generation
- Emotion for styling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Development History
- Initial setup with React and TypeScript
- Implemented form sections with Material-UI components
- Added multi-select functionality for technical stack
- Implemented free text input for "Other" options
- Added PDF generation functionality
- Improved UI/UX with proper spacing and layout
