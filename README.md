# Huduma360 🇰🇪

**A unified digital gateway to Kenyan government services.**

Huduma360 is a full-stack web application concept designed to simplify access to government services in Kenya. Citizens can explore service categories, submit applications, make simulated payments, save services, and track application progress through a centralized digital platform.

The application transforms the original HTML, CSS, and JavaScript prototype into a modern full-stack solution featuring a React frontend, a Node.js API, PostgreSQL persistence, secure authentication, role-based access control, and a payment-provider abstraction.

> **Disclaimer:** Huduma360 is an independent demo and portfolio project. It is not affiliated with, endorsed by, or operated by the Government of Kenya. All payments are simulated through a mock payment provider. No real money is processed.

---

## 📸 Screenshots

### Application Preview

| Screenshot 1                                       | Screenshot 2                                       |
| -------------------------------------------------- | -------------------------------------------------- |
| ![Huduma360 Screenshot 1](docs2/screenshots/1.png) | ![Huduma360 Screenshot 2](docs2/screenshots/2.png) |

| Screenshot 3                                       | Screenshot 4                                       |
| -------------------------------------------------- | -------------------------------------------------- |
| ![Huduma360 Screenshot 3](docs2/screenshots/3.png) | ![Huduma360 Screenshot 4](docs2/screenshots/4.png) |

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Demo Accounts](#-demo-accounts)
- [Running Tests](#-running-tests)
- [Payment Integration](#-payment-integration)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Design Decisions](#-design-decisions)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Disclaimer](#-disclaimer)

---

## 🎯 Overview

Huduma360 explores how a unified digital platform could make government services easier to discover and access.

Instead of navigating separate service portals, users can browse a centralized catalogue, submit service applications, follow their progress, and review relevant notifications.

The project demonstrates modern full-stack development practices, including typed API contracts, relational database design, authentication, authorization, automated testing, and modular third-party payment integration.

### Project Goals

- Provide a centralized catalogue of government services.
- Simplify the application submission and tracking process.
- Implement secure user authentication and role-based access.
- Support simulated service-fee payments.
- Provide administrative tools for managing users, applications, and payments.
- Establish an architecture that can accommodate real external integrations in the future.

---

## ✨ Features

### 👤 Authentication and User Accounts

- User registration, login, and logout.
- Password hashing using bcrypt.
- JWT-based authentication using HTTP-only cookies.
- Email verification and password-reset token workflows.
- Role-based access control for citizens, staff, and administrators.

### 🏛️ Service Catalogue

- Browse services organized into categories.
- Search and filter available services.
- View service information and applicable fees.
- Save services for later.
- Track recently viewed services.

### 📝 Applications

- Submit service applications.
- Generate application reference numbers.
- Track application status.
- View application status history.
- Receive user-facing notifications when application events occur.

### 💳 Payments

- Simulated payments through a mock payment provider.
- Payment records associated with applications.
- A provider abstraction designed to support future payment integrations.
- An M-Pesa integration stub for future Safaricom Daraja API development.

### 🛠️ Administration

- Dashboard statistics.
- Application status management.
- Payment record management.
- User management and role assignment.
- Audit logging for sensitive administrative actions.

### 🔐 Security and Reliability

- Server-side authorization checks.
- CSRF protection using a double-submit cookie approach.
- Rate limiting.
- Security headers using Helmet.
- Centralized error handling.
- Automated unit and integration tests.

---

## 🧰 Technology Stack

| Layer             | Technology                 | Purpose                                           |
| ----------------- | -------------------------- | ------------------------------------------------- |
| Language          | TypeScript                 | Type safety and maintainable code                 |
| Frontend          | React                      | Component-based user interface                    |
| Frontend tooling  | Vite                       | Development server and production builds          |
| Backend           | Node.js                    | Server-side JavaScript runtime                    |
| API framework     | Express                    | REST API and request handling                     |
| Database          | PostgreSQL                 | Persistent relational data storage                |
| ORM               | Prisma                     | Type-safe database access and migrations          |
| Authentication    | JWT and HTTP-only cookies  | Authenticated user sessions                       |
| Password security | bcrypt                     | Password hashing                                  |
| Validation        | Schema-based validation    | Request and data validation                       |
| Testing           | Unit and integration tests | Verify application behaviour                      |
| Payments          | Mock provider abstraction  | Simulated payments and future gateway integration |

---

## 🏗️ Architecture

Huduma360 follows a client-server architecture with a separate frontend and backend.

```text
┌───────────────────────────────────────┐
│             React Frontend            │
│                                       │
│ Pages · Components · Context · API     │
│ Client · Authentication · UI          │
└───────────────────┬───────────────────┘
                    │
                    │ HTTP / REST API
                    ▼
┌───────────────────────────────────────┐
│          Express Backend API          │
│                                       │
│ Routes · Validation · Middleware      │
│ Authentication · Authorization        │
│ Business Logic · Integrations         │
└───────────────────┬───────────────────┘
                    │
                    │ Prisma ORM
                    ▼
┌───────────────────────────────────────┐
│             PostgreSQL                │
│                                       │
│ Users · Services · Applications       │
│ Payments · Notifications · Audit Data │
└───────────────────────────────────────┘
```

### Request Flow

1. A user interacts with the React frontend.
2. The frontend sends an HTTP request through the typed API client.
3. Express middleware handles security checks, authentication, validation, and authorization.
4. The appropriate backend service executes the business logic.
5. Prisma communicates with PostgreSQL when persistent data is required.
6. The backend returns a structured response to the frontend.

### Payment Flow

The application communicates with a payment-provider abstraction rather than depending directly on a specific payment gateway.

The current mock provider simulates payment outcomes. A future production implementation can introduce a real provider without unnecessarily coupling payment-specific logic to application services.

---

## 📁 Project Structure

The following is the intended high-level structure. Individual filenames may differ slightly depending on the current implementation.

```text
huduma360/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── categories/
│   │   │   ├── services/
│   │   │   ├── applications/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   ├── saved/
│   │   │   ├── recent/
│   │   │   └── admin/
│   │   │
│   │   ├── integrations/
│   │   │   └── payments/
│   │   └── utils/
│   │
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── types/
│   │   ├── services/
│   │   ├── context/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── pages/
│   │       └── admin/
│   │
│   ├── public/
│   ├── vite.config.ts
│   └── package.json
│
├── docs2/
│   └── screenshots/
│       ├── 1.png
│       ├── 2.png
│       ├── 3.png
│       └── 4.png
│
├── docs/
│   └── API.md
│
└── README.md
```

**Note:** The tree illustrates the documented architecture. Keep it aligned with the actual files and folders in your repository.

---

## ⚙️ Prerequisites

Install the following before running the application:

- **Node.js 18 or later** — use a version compatible with your installed dependencies.
- **npm** — included with Node.js.
- **PostgreSQL 14 or later** — running locally or available through a hosted database.
- **Git** — for version control.
- A code editor such as Visual Studio Code.

You will also need the database connection details and environment variables required by the backend.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DENNISMYNER/huduma360.git
cd huduma360
```

> If your repository uses a different GitHub URL, replace the example above with your actual repository URL.

### 2. Configure the Backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Copy the example environment file:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Open `backend/.env` and configure the required environment variables.

At minimum, configure the PostgreSQL connection string and frontend origin.

For example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/huduma360"
CLIENT_ORIGIN="http://localhost:5173"
PAYMENT_PROVIDER="mock"
```

Replace the database username, password, host, and database name with your actual PostgreSQL settings.

**Important:** Use the project's `.env.example` as the source of truth for all required variables. Do not commit `.env` files or real credentials to GitHub.

### 3. Set Up the Database

Ensure PostgreSQL is running and the database specified in `DATABASE_URL` exists.

Generate the Prisma Client:

```bash
npm run prisma:generate
```

Apply the database migrations:

```bash
npm run prisma:migrate
```

Seed the database with the sample service catalogue and demo accounts:

```bash
npm run seed
```

The seed script is intended to populate the application with 10 service categories, 60 services, and three demo accounts.

### 4. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The API runs at:

**http://localhost:4000**

Keep this terminal running.

### 5. Start the Frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend in your browser:

**http://localhost:5173**

During development, Vite proxies `/api` requests to the backend at `http://localhost:4000`. This avoids the need for separate cross-origin API requests during local development.

### 6. Build the Frontend for Production

From the `frontend` directory:

```bash
npm run build
```

The production build is generated in:

```text
frontend/dist/
```

Preview the production build locally:

```bash
npm run preview
```

The preview server is intended for local verification, not as a replacement for a production hosting setup.

---

## 🔑 Demo Accounts

After running the database seed script, use the following accounts to explore the application's different roles.

| Role          | Email                    | Password     |
| ------------- | ------------------------ | ------------ |
| Administrator | `admin@huduma360.demo`   | `Admin1234`  |
| Staff         | `staff@huduma360.demo`   | `Staff1234`  |
| Citizen       | `citizen@huduma360.demo` | `Citizen123` |

These are **development-only demo credentials**. Never use them in a production environment.

---

## 🧪 Running Tests

The backend includes unit tests and integration tests.

### Unit Tests

From the `backend` directory:

```bash
npm test
```

Unit tests cover areas such as:

- Validation schemas.
- JWT utilities.
- Password hashing.
- Reference number generation.
- Mock payment-provider behaviour.

The unit tests are designed to run without a database.

### Integration Tests

Configure the test database using the project's `.env.test` file.

Ensure the test database is available and its schema has been prepared before running:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run test:integration
```

Use the exact environment-variable and migration commands documented in your backend configuration if your project defines a separate test-database setup process.

**Important:** Integration tests can create or modify database records. Always use a dedicated test database, never your production database.

---

## 💳 Payment Integration

### Current Implementation

Huduma360 uses a mock payment provider by default.

```env
PAYMENT_PROVIDER="mock"
```

The mock provider simulates payment outcomes without processing real money.

The payment-provider abstraction keeps gateway-specific operations separate from the application's core business logic.

### Future M-Pesa Integration

The project includes a structural M-Pesa integration stub intended for future Safaricom Daraja API integration.

A production implementation would generally require:

1. Obtaining the appropriate Daraja API credentials.
2. Configuring the required M-Pesa environment variables.
3. Implementing OAuth access-token handling.
4. Implementing the appropriate payment request flow, such as STK Push.
5. Handling and validating payment callbacks.
6. Verifying transaction status before marking payments as successful.
7. Implementing secure logging, error handling, idempotency, and reconciliation.

When the integration is implemented and tested, the payment provider can be selected through the configured environment variable:

```env
PAYMENT_PROVIDER="mpesa"
```

**This setting alone does not make real payments functional.** The M-Pesa provider must be fully implemented, configured, secured, and tested against the appropriate Daraja environment before being used.

Never commit API credentials, callback secrets, or other sensitive payment configuration to the repository.

---

## 🔐 Security

Security is an important part of the project's backend architecture.

Implemented security measures include:

- **Password hashing:** Passwords are hashed using bcrypt rather than stored as plaintext.
- **HTTP-only authentication cookies:** JWTs are stored in cookies that cannot be accessed directly by browser JavaScript.
- **Role-based authorization:** Protected operations enforce permissions on the backend.
- **CSRF protection:** State-changing requests use a double-submit cookie protection approach.
- **Rate limiting:** Limits excessive requests to help mitigate abuse.
- **Helmet:** Applies HTTP security headers.
- **Input validation:** Validates incoming request data.
- **Centralized error handling:** Provides a consistent way to handle application errors.
- **Audit logging:** Records selected sensitive actions.

### Security Notes

- Store secrets in environment variables, not source code.
- Use HTTPS in production.
- Configure secure cookie attributes for the production environment.
- Restrict CORS to trusted frontend origins.
- Use strong, unique production secrets.
- Configure appropriate password-reset and verification-token expiry.
- Ensure payment callbacks are authenticated or cryptographically verified as supported by the payment provider.
- Review authentication, authorization, logging, and database access before deploying publicly.

The project is a portfolio application and should undergo a full security review before being used to handle real citizen information or financial transactions.

---

## 🧠 Design Decisions

### 1. Express Instead of NestJS

Express provides a straightforward foundation for this project's API requirements without introducing additional framework complexity.

The modular backend structure keeps routes, validation, business logic, and integrations organized.

### 2. PostgreSQL with Prisma

PostgreSQL is well suited to related records such as users, applications, payments, and notifications.

Prisma provides typed database access, schema management, and migrations.

### 3. JWTs in HTTP-Only Cookies

HTTP-only cookies prevent browser JavaScript from directly reading the authentication token.

Cookie-based authentication still requires appropriate CSRF protection, secure cookie configuration, and careful handling of authentication and authorization.

### 4. A Payment-Provider Abstraction

The application uses a provider interface to separate payment logic from gateway-specific implementation.

This allows a mock provider to be used during development while creating a clear path toward a future real payment integration.

### 5. Role-Based Access Control

The application uses three primary roles:

- `USER`
- `STAFF`
- `ADMIN`

A role enum is sufficient for the current project scope. A more elaborate permissions system could be introduced if future requirements justify it.

### 6. Frontend Catalogue Caching

The service catalogue can be loaded once and filtered on the frontend.

For a relatively small catalogue, this reduces unnecessary requests and keeps the user experience responsive without requiring a more complex search infrastructure.

### 7. Development-Only Email Workflows

Email verification and password-reset flows generate and manage tokens, but the delivery step is currently a development stand-in.

Tokens are logged to the backend console rather than sent through a configured email provider.

A production deployment would need a real email delivery service and additional security review.

---

## 🛠️ Troubleshooting

### Prisma Client Generation Fails

Run:

```bash
npm run prisma:generate
```

Check your internet connection, installed Prisma dependencies, and compatibility between your Prisma packages and project configuration.

### Database Connection Errors

Verify that:

- PostgreSQL is running.
- The database exists.
- The username and password are correct.
- `DATABASE_URL` points to the correct database.
- The database user has the required permissions.

### Frontend Cannot Reach the Backend

Confirm that the backend is running at:

```text
http://localhost:4000
```

Also check that the Vite proxy configuration points to the correct backend address.

### CORS Errors

In local development, the Vite proxy should route `/api` requests to the backend.

For deployments using separate frontend and backend origins, configure the backend's `CLIENT_ORIGIN` to match the frontend's origin exactly, including the protocol and any port.

Configure the frontend API base URL according to the project's Vite configuration.

### Login Works, but Requests Return a CSRF Error

Ensure the frontend's HTTP client obtains the CSRF cookie before sending state-changing requests such as `POST`, `PATCH`, and `DELETE`.

If testing through a REST client, follow the same cookie and CSRF-token flow as the frontend.

### Demo Accounts Cannot Log In

Run the database seed command again if appropriate:

```bash
npm run seed
```

Ensure the frontend and backend are connected to the same intended database.

### Application or Service Data Is Missing

Check that database migrations and the seed script completed successfully.

Verify that both the backend and frontend are using the expected environment configuration.

---

## 🗺️ Future Improvements

Potential areas for future development include:

- Integrating a production-ready M-Pesa payment provider.
- Connecting a real email service for verification and password-reset messages.
- Adding stronger integration and end-to-end test coverage.
- Improving application search, filtering, and pagination as the catalogue grows.
- Adding richer administrative reporting and analytics.
- Improving accessibility and automated accessibility testing.
- Adding production deployment configuration and CI/CD pipelines.
- Introducing monitoring, structured logging, and error reporting.
- Completing a security review before handling real personal information or payments.

These are potential improvements, not claims that the features are already implemented.

---

## 🤝 Contributing

Contributions, suggestions, and constructive feedback are welcome.

To propose a change:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the relevant tests.
5. Submit a pull request describing the changes.

For substantial changes, consider opening an issue first to discuss the proposed approach.

---

## 📄 License

No license has been specified here. Check the repository for an existing `LICENSE` file before reusing or distributing this project.

If you intend to publish the project as open source, consider adding an appropriate license.

---

## ⚠️ Disclaimer

Huduma360 is an independent educational and portfolio project intended to demonstrate full-stack web development.

It is not an official Kenyan government platform and is not affiliated with any government ministry, department, agency, or service.

Government services, application workflows, and payment operations are illustrative. Payments are simulated, and no real government applications or financial transactions are processed.
