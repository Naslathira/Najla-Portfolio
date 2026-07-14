# Testing and Quality Assurance

## Test stack

The tests are written in JavaScript and JSX, the same languages used by the application.

- **Vitest** is the test runner and assertion framework. It discovers tests, executes them, and reports pass/fail results.
- **React Testing Library** renders React components and tests their visible behavior instead of their internal implementation.
- **user-event** simulates realistic actions such as clicking buttons and typing into form fields.
- **jest-dom** provides readable UI assertions such as `toBeVisible()` and `toBeInTheDocument()`.
- **jsdom** supplies a simulated browser DOM while tests run in Node.js.
- **Supertest** sends HTTP requests directly to the Express application without requiring the development server to be started manually.
- **V8 coverage** measures which statements, branches, functions, and lines the suite executes.

## Types of tests

### Unit tests

`src/tests/sizeRecommendation.test.js` tests the size recommendation business rule in isolation. It covers normal recommendations, two-out-of-three matching, exact boundary values, missing measurements, and measurements that cannot produce a recommendation.

Unit tests are fast and make failures easy to diagnose because they test one focused function.

### Component and integration tests

- `src/tests/SizeAssistantModal.test.jsx` tests the complete form workflow, including validation, out-of-range measurements, a successful recommendation, and closing the modal.
- `src/tests/Shop.test.jsx` tests the catalog with no filter, a valid category filter, and an empty category.
- `src/tests/ProductDetail.test.jsx` tests valid product lookup, an unknown product, the size chart, and opening the assistant.
- `src/tests/Login.test.jsx` tests login success, Google failure, API rejection, credential submission, user rendering, and logout. Google and network calls are mocked so the tests remain deterministic and do not use real accounts.

These tests exercise multiple pieces together through the interface a shopper sees. They intentionally query accessible roles and labels where possible.

### API tests

`src/tests/authApi.test.js` tests the Express authentication contract:

- Missing Google credentials return HTTP 400.
- Valid credentials create a user response and HTTP-only session cookie.
- Rejected Google credentials return HTTP 401.
- `/me` handles absent, valid, and tampered session cookies.
- `/logout` clears the session cookie.

Google token verification is mocked, but Express middleware, routing, cookies, JWT signing, and JWT verification run normally.

## Running the suite

```bash
npm test
npm run test:watch
npm run test:coverage
```

- `npm test` runs the complete suite once, which is suitable for CI.
- `npm run test:watch` reruns affected tests while developing.
- `npm run test:coverage` creates terminal and HTML coverage reports.

## QA techniques demonstrated

- Positive and negative test cases
- Boundary-value analysis
- Input validation testing
- Error-path and empty-state testing
- Authentication and session testing
- Mocking external services
- HTTP status and cookie assertions
- User-focused component testing
- Regression testing of important business rules
- Code coverage reporting

Coverage is evidence that code executed, not proof that every possible defect was tested. The assertions and chosen scenarios are more important than maximizing the percentage alone.
