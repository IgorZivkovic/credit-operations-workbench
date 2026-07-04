# Credit Operations Workbench

OpenUI5 demo application for a banking credit operations workflow.

The application simulates a back-office workbench used to review, prioritize, and approve credit applications. It is intentionally built without a real backend: core banking data is served through a local UI5 OData V2 `MockServer`, while risk signals are loaded from a separate JSON model to represent a REST-style microservice response.

## Why This Project Exists

This project is a focused SAP UI5/OpenUI5 demo for financial services workflows. The goal is not to clone a full loan origination platform, but to demonstrate practical UI5/Fiori development patterns in a realistic banking domain:

- OpenUI5 application structure with UI5 Tooling.
- MVC controllers with XML views.
- Manifest-driven routing and model configuration.
- OData V2 binding with local MockServer data.
- Separate JSON model consumption for REST-style data.
- Fiori-style worklist/detail workflow.
- Validation with UI5 `MessageManager`.
- Reusable custom UI5 control.
- QUnit unit tests and OPA5 integration tests.

## Functional Scope

The app covers a compact credit operations workflow:

- Review loan applications in a searchable worklist.
- Filter by approval status and risk level.
- Sort by SLA due date, risk score, or requested amount.
- Monitor KPI summary values for pending approvals, high-risk cases, SLA breaches, and total exposure.
- Open a credit application detail page.
- Review customer data, tasks, documents, risk signals, and activity log entries.
- Approve or reject an application with a required decision comment.
- Persist local status updates and activity log entries through the mock OData model.

## UX Approach

The layout follows a low-fi Fiori-style worklist/detail sketch:

- Worklist first: users start with a dense, searchable operational list.
- Risk/status prioritization: KPIs, status labels, and risk badges help identify urgent cases.
- Detail context: customer, tasks, documents, risk signals, and activity are grouped around the selected application.
- Action placement: approval and rejection actions are placed on the detail page header, close to the decision context.

This keeps the first screen operational rather than marketing-like, which is more appropriate for enterprise banking software.

## Architecture

```text
webapp/
  Component.js
  manifest.json
  controller/
  control/
  css/
  i18n/
  localService/
  model/
  test/
  view/
```

Key implementation points:

- `manifest.json` defines routing, models, dependencies, app metadata, and CSS resources.
- `Component.js` initializes the application shell.
- `index.html` starts the local MockServer before ComponentSupport instantiates the app.
- XML views keep UI structure declarative.
- Controllers contain UI interaction and routing behavior.
- Formatters and small model helpers keep reusable logic out of views.
- `RiskBadge` is a custom control extending `sap.m.ObjectStatus` for reusable risk presentation.

## Data Model

Core credit operations data is exposed through:

```text
/odata/v2/credit-operations/
```

The local OData service is defined in:

```text
webapp/localService/metadata.xml
webapp/localService/mockdata/
```

Mock OData entities:

- `LoanApplications`
- `Customers`
- `Tasks`
- `Documents`
- `ActivityLog`

Loan applications keep both amount fields on purpose:

- `requestedAmount`: OData V2 decimal string used for display.
- `requestedAmountValue`: numeric helper field used for reliable mock `$orderby` sorting.

This avoids a known local MockServer limitation where decimal strings are sorted lexicographically instead of numerically.

Risk signals are loaded separately from:

```text
webapp/localService/rest/riskSignals.json
```

This simulates a REST/microservice response next to the core OData service.

## Testing

The project includes both unit and integration-style UI5 tests.

Unit coverage:

- amount formatter behavior
- status formatter behavior
- decision comment validation
- `RiskBadge` severity mapping

OPA5 integration coverage:

- load the worklist
- search for a credit application
- open the detail route
- validate the approval dialog when the comment is empty
- enter a decision comment
- confirm approval and verify the updated status

## Run Locally

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

## Build Check

```powershell
npm test
```

`npm test` runs:

```powershell
npm run build
```

## Unit Tests

```powershell
npm run test:unit
```

This opens the QUnit browser runner at:

```text
http://localhost:8080/test/unit/unitTests.qunit.html
```

## Integration Tests

```powershell
npm run test:integration
```

This opens the OPA5 browser runner at:

```text
http://localhost:8080/test/integration/opaTests.qunit.html
```

The OPA5 tests are written as one continuous user journey. Running a single test from the middle of the journey may not work in isolation because it depends on the state created by the previous step.

## Mapping To SAP UI5/Fiori Requirements

| Requirement area | Where it is shown |
|---|---|
| OpenUI5 / SAP UI5 fundamentals | UI5 Tooling, `manifest.json`, `Component.js`, XML views, controllers |
| Fiori UX patterns | Worklist/detail flow, KPI summary, semantic statuses, approval action placement |
| MVC architecture | `webapp/view`, `webapp/controller`, `webapp/model` separation |
| OData services | Local OData V2 `MockServer`, metadata, entity sets, OData-bound tables |
| REST / JSON integration | `riskSignals` JSON model loaded separately from OData |
| Routing | Manifest-driven routes for worklist and application detail |
| Validation | Required approval comment with `MessageManager` and `MessagePopover` |
| Custom controls | `RiskBadge` control extending `sap.m.ObjectStatus` |
| Testing | QUnit unit tests and OPA5 user journey tests |
| Accessibility basics | labels, semantic states, keyboard-friendly standard UI5 controls |

## Current Limitations

- No real backend, database, authentication, or SAP BTP deployment.
- Mock data is local and resets with the development server/session.
- Theme switching is not part of the current scope; custom KPI and risk badge colors should be revisited before adding Horizon Dark support.
- The project uses JavaScript ES6 for idiomatic UI5 speed in this version, while TypeScript can be introduced later if needed.
