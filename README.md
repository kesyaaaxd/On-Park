# On-Park 

### Smart Parking Reservation System

On-Park is a Smart Parking Reservation System designed to help users find parking locations, explore available parking slots, and manage parking reservations through a web-based interface.

The project is being developed as part of the Web & Mobile Development course. Its long-term goal is to provide a shared backend and database architecture that supports a web administration interface and a mobile client application.

**Project Status:** In Development

##  Live Demo

**Frontend:** https://kesyaaaxd.github.io/On-Park/

> Note: The live deployment currently represents the frontend prototype. Backend integration and persistent data operations are still in development.

##  Features

The current frontend prototype includes the following interfaces and workflows:

* **Role-Based Dashboards** — Separate dashboard experiences for administrators and clients.
* **Parking Location Management** — Interfaces for viewing and managing parking locations.
* **Parking Slot Management** — Interfaces for managing parking slots.
* **Reservation Management** — Interfaces for viewing and managing parking reservations.
* **Client Reservations** — A reservation workflow for client users.
* **Reservation Confirmation** — A confirmation interface after creating a reservation.
* **Payment Simulation** — A prototype workflow for simulating reservation payments.
* **Occupancy Monitoring** — An interface for monitoring parking occupancy.

Some features currently rely on mock data or frontend state. Their integration with the backend and persistent database is not yet complete.

##  Technology Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* CSS

### Backend

* Node.js
* Express.js
* SQLite
* JSON Web Token (JWT)
* bcryptjs

The backend environment is being developed to support authentication, authorization, data management, and communication with the frontend.

##  System Architecture

The planned application architecture consists of three main components:

```text
                   ┌──────────────────────┐
                   │     Web Frontend     │
                   │   React + Vite       │
                   └──────────┬───────────┘
                              │
                         HTTP / REST API
                              │
                   ┌──────────▼───────────┐
                   │      Backend API     │
                   │   Node.js + Express  │
                   └──────────┬───────────┘
                              │
                   ┌──────────▼───────────┐
                   │       Database      │
                   │        SQLite        │
                   └──────────────────────┘
```

The frontend and backend are being developed incrementally. The diagram represents the intended architecture; complete integration is still pending.

##  Project Structure

The project is organized into frontend and backend directories.

```text
On-Park/
├── src/
│   ├── components/
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   └── ...
├── public/
├── backend/
│   ├── server.js
│   ├── db.js
│   └── ...
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

The exact files may change as backend routes, middleware, and additional application modules are implemented.

##  Getting Started

### Prerequisites

Make sure the following tools are installed:

* Node.js
* npm
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/kesyaaaxd/On-Park.git
cd On-Park
```

### 2. Run the Frontend

Open a terminal in the project root directory:

```bash
npm install
npm run dev
```

Vite will display the local development URL in the terminal, typically:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

### 3. Run the Backend

Open a separate terminal:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following development configuration:

```env
PORT=5000
JWT_SECRET=replace_with_a_local_development_secret
JWT_EXPIRES_IN=1d
FRONTEND_ORIGIN=http://localhost:5173
```

Then start the backend:

```bash
node server.js
```

If the server starts successfully, its initial endpoint can be accessed at:

```text
http://localhost:5000/
```

The initial backend setup has been verified. However, the complete authentication and application API workflows still require implementation and verification.

**Important:** Use a private development secret for local testing. Never commit the `.env` file or production secrets to the repository.

##  Authentication

The frontend prototype includes a demonstration login flow. Backend authentication using JWT is part of the planned implementation.

The intended authentication workflow is:

1. The user submits their login credentials.
2. The backend validates the credentials.
3. The backend issues a JWT upon successful authentication.
4. The frontend uses the token when accessing protected API endpoints.
5. The backend verifies authentication and authorization before allowing protected operations.

This workflow is a development target and should not be considered fully implemented until the frontend and backend have been connected and verified.

##  Development Roadmap

* [x] Initialize the React and Vite frontend.
* [x] Develop the main frontend prototype and application interfaces.
* [x] Deploy the frontend prototype to GitHub Pages.
* [x] Initialize the Express backend.
* [x] Initialize the SQLite database and initial users table.
* [ ] Implement and verify backend authentication using JWT.
* [ ] Integrate frontend login with the backend.
* [ ] Connect parking location and slot management to the database.
* [ ] Connect reservation operations to the backend.
* [ ] Verify the primary end-to-end application workflow.
* [ ] Develop and integrate the mobile client.
* [ ] Complete deployment of the integrated application.

##  Team Members

* Geovani Ariel Puntodewo Isliko
* Kesya Adelia Madarani Elenled
* Vanya Ester Bano
* Vince Christiant Wiejaya

##  Project Repository

GitHub: https://github.com/kesyaaaxd/On-Park

## 📄 License

This project is developed for educational purposes as part of a university course.
