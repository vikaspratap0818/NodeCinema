# FullStack Movie App 

A modern, full-stack Movie Application built with the MERN stack (MongoDB, Express, React, Node.js). The application allows users to discover trending movies and TV shows, search for specific titles, view detailed information including trailers, and save their favorite content to a personal "My List". It features a sleek glassmorphic UI, mobile responsiveness, and a fully functional Admin dashboard for managing custom movies and platform users.


<img width="1858" height="913" alt="image" src="https://github.com/user-attachments/assets/a6e7830a-d909-4532-8a90-85821c0a638e" />

##  Features

- **User Authentication:** Secure JWT-based registration, login, and profile management.
- **Movie Discovery:** Browse popular, trending, and top-rated movies across categories.
- **Search System:** Real-time search functionality powered by WatchMode API with autocomplete and sorting.
- **My List / Favorites:** Seamlessly save and remove movies from your personal favorites list.
- **Watch History:** Automatically tracks your recently viewed movies.
- **Admin Dashboard:** Role-based access control protecting an admin panel that allows CRUD operations on custom movies and user management (Ban/Delete).
- **Responsive UI:** A "glassmorphic", dark-mode interface optimized for both desktop and mobile devices.
- **Trailers:** Watch YouTube trailers directly within the movie application.

##  Technology Stack

**Frontend:**
- React.js (Vite)
- Redux Toolkit (State Management)
- React Router DOM
- Framer Motion (Animations)
- Lucide React (Icons)
- Vanilla CSS (Glassmorphism design system)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Tokens (JWT) & bcryptjs (Authentication)
- WatchMode API (Movie Data Integration)

##  Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string.
- A free API key from [WatchMode](https://api.watchmode.com/).

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/movie-platform.git
cd movie-platform
```

### 2. Environment Variables
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
WATCHMODE_API_KEY=your_watchmode_api_key
```

### 3. Install Dependencies
This project contains a root `package.json` setup for easy monolithic handling:
```bash
npm run build
```
*(This command installs both client and server dependencies, and builds the React frontend)*

### 4. Running Locally
To start both the client and server concurrently in development mode:
```bash
npm run dev
```
Alternatively, to test the production build locally:
```bash
npm start
```
*(The server will run on `http://localhost:5000` and serve the static built React files)*

##  Project Structure

```
├── client/                 # React Frontend
│   ├── public/             # Static Assets (Favicon, Logo)
│   ├── src/
│   │   ├── components/     # Reusable UI widgets
│   │   ├── features/       # Redux Slices
│   │   ├── pages/          # Route Views
│   │   └── services/       # WatchMode and Backend Axios Config
│   └── vite.config.js      # Vite Configuration
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Route Logic
│   │   ├── middleware/     # Auth & Admin Guards
│   │   ├── models/         # Mongoose Schemas (User, Movie)
│   │   └── routes/         # Express Router endpoints
│   └── index.js            # Server entry point
├── render.yaml             # Render deployment configuration
├── package.json            # Root configuration for concurrent commands
└── README.md
```

##  License
This project is open-source and available under the [MIT License](LICENSE).
