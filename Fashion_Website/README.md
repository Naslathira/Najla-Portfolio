# NP Active Fashion Store

NP Active is a React and Express activewear storefront with catalog filtering, Google authentication, session cookies, product size charts, and a measurement-based size assistant.

## Technology

- React 19 and Vite
- React Router
- Tailwind CSS
- Express
- Google OAuth
- JSON Web Tokens stored in HTTP-only cookies
- Vitest, React Testing Library, and Supertest

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and enter your Google OAuth client ID and a secure JWT secret.

3. Start the API:

   ```bash
   npm run server
   ```

4. In another terminal, start the web application:

   ```bash
   npm run dev
   ```

## Scripts

```bash
npm run dev
npm run server
npm run build
npm run lint
npm test
npm run test:watch
npm run test:coverage
```

## Architecture

```text
src/
├── api/             Shared HTTP and authentication requests
├── components/      Reusable UI and layout components
├── config/          Client environment configuration
├── data/            Product, category, and size-chart data
├── features/auth/   Global authentication state
├── pages/           Route-level screens
├── tests/           Unit, component, integration, and API tests
└── utils/           Pure business rules

server/
├── app.js           Express routes and middleware
└── index.js         Environment loading and server startup
```

Routing is declared centrally in `src/App.jsx`. Authentication requests are isolated from the UI, and `AuthProvider` restores the current session and shares the authenticated user across the application. Product category identifiers are explicit data rather than being inferred from image filenames.

See [TESTING.md](./TESTING.md) for the QA strategy and test coverage details.
