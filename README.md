# Credit Operations Workbench

OpenUI5 demo application for a banking credit operations workflow.

The project is being built step by step as a portfolio application. The current version contains the initial OpenUI5 application shell, a local mock OData service, the loan applications worklist with KPI summary, a detail view for individual credit applications, a local approval workflow, and a REST-style risk signals model. Tests will be added in later phases.

## Current scope

Added so far:

- OpenUI5 project setup with UI5 Tooling.
- `package.json` scripts for local development and build checks.
- `ui5.yaml` framework configuration for OpenUI5.
- Component-based application bootstrap via `Component.js`.
- `manifest.json` application descriptor with routing configuration.
- XML view shell with `App.view.xml` and placeholder `Home.view.xml`.
- i18n resource bundle setup.
- `.gitignore` for local dependencies and build output.
- Local OData V2 mock service wired through the application manifest.
- Mock service metadata for loan applications, customers, tasks, documents, and activity log entries.
- Seed mock data for the credit operations workflow.
- Loan applications worklist bound to the mock OData service.
- Search by application ID, product type, or assignee.
- Status and risk filters.
- Sorting by SLA due date, risk score, or requested amount.
- Semantic status/risk display using reusable formatter functions.
- Fiori-style KPI summary for pending approvals, high-risk applications, SLA breaches, and total exposure.
- Reusable `RiskBadge` control for semantic Low/Medium/High risk presentation.
- Route-based navigation from the worklist to a credit application detail page.
- Detail page sections for application summary, customer information, tasks, documents, and activity log entries.
- Related detail data filtered by `applicationId` from the same mock OData service.
- Approve/reject workflow on the detail page.
- Required decision comment validation with UI5 `MessageManager` and `MessagePopover` integration.
- Local status update and activity log entry creation through the mock OData model.
- Separate JSON model for risk signals, simulating a REST/microservice response alongside the core OData service.
- Risk signals tab on the detail page, filtered by the selected credit application.

## Mock data service

The app uses a local UI5 `MockServer` so the frontend can be developed without a real SAP backend.

Core credit operations data is exposed through:

```text
/odata/v2/credit-operations/
```

The mock service is defined in:

```text
webapp/localService/metadata.xml
webapp/localService/mockdata/
```

Loan applications keep `requestedAmount` as an OData V2 decimal string for display and `requestedAmountValue` as a numeric helper field for reliable mock `$orderby` sorting.

This keeps the app close to a real UI5/OData setup while still being easy to run locally.

Risk signals are intentionally loaded from a separate JSON model at `webapp/localService/rest/riskSignals.json` to simulate a REST-style microservice response next to the core OData service.

## Run locally

Install dependencies:

```powershell
npm install
```

Start the UI5 development server:

```powershell
npm start
```

The app opens through the local UI5 server, usually at:

```text
http://localhost:8080/index.html
```

Do not open `webapp/index.html` directly from the file system. UI5 apps should run through a local web server so resources, routing, and module loading work correctly.

## Build check

```powershell
npm test
```

At this stage, `npm test` runs the UI5 build as a smoke test. QUnit and OPA5 tests will be added after the core screens and workflow are implemented.

## Next phase

The next implementation step is adding a reusable risk badge presentation.
