# WorkFlo Automation

A cross-platform personal workflow automation app built with **React Native (Expo)** for iOS, Android, and Web. Create, manage, and automate tasks with real-time API integrations — weather, data fetching, and reminders all in one place.

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-green)

---

## Features

- **Auth0 Authentication** — Secure login/logout with Auth0 universal login (includes demo mode)
- **Task Dashboard** — View, filter, and manage all workflow tasks
- **Create / Edit Tasks** — Form with validation for task name, description, category, trigger, and frequency
- **REST API Integration** — Weather tasks fetch from Open-Meteo; Data tasks fetch from JSONPlaceholder
- **Task Detail & Execution** — "Run Now" button triggers API calls and displays results
- **Pull-to-Refresh** — Reload tasks on mobile with pull gesture
- **Dark / Light Mode** — Theme toggle persisted in AsyncStorage
- **Responsive UI** — Works seamlessly across iOS, Android, and Web

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native (Expo) | Cross-platform framework |
| Expo Router | File-based routing (mobile + web) |
| React Native Paper | Material Design 3 UI components |
| Auth0 (expo-auth-session) | Authentication |
| AsyncStorage | Local data persistence |
| Jest | Unit testing |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI** (installed automatically via npx)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd workflo_automation

# Install dependencies
npm install
```

### Auth0 Configuration

1. Create a free account at [auth0.com](https://auth0.com)
2. Create a new **Native Application**
3. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_MOCK=false
```

4. In your Auth0 dashboard, add the following to **Allowed Callback URLs**:
   - `workflo://` (for mobile)
   - `http://localhost:8081` (for web)

> **💡 Demo Mode:** Set `AUTH0_MOCK=true` (default) to skip Auth0 and use a mock user for development.

### Running the App

```bash
# Start the Expo dev server
npx expo start

# Run on web
npx expo start --web

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

---

## Running Tests

```bash
npm test
```

This runs 3 test suites:

| Test File | What It Tests |
|---|---|
| `taskLogic.test.js` | Task creation, status transitions, filtering |
| `validators.test.js` | Form validation logic, edge cases |
| `weatherService.test.js` | API integration with mocked fetch |

---

## Project Structure

```
workflo_automation/
├── app/
│   ├── _layout.js              # Root layout (themes, auth, navigation)
│   ├── index.js                # Entry route (login gate)
│   ├── components/
│   │   ├── TaskCard.js         # Task list card component
│   │   ├── TaskForm.js         # Create/edit form with validation
│   │   ├── LoadingSpinner.js   # Reusable loading indicator
│   │   └── FilterBar.js       # Category & status filter chips
│   ├── context/
│   │   ├── AuthContext.js      # Auth state management
│   │   └── ThemeContext.js     # Dark/light mode state
│   ├── screens/
│   │   ├── LoginScreen.js      # Auth0 login UI
│   │   ├── HomeScreen.js       # Task dashboard
│   │   ├── CreateTaskScreen.js # Task creation/editing
│   │   └── TaskDetailScreen.js # Task detail, run, delete
│   ├── services/
│   │   ├── authService.js      # Auth0 integration
│   │   ├── weatherService.js   # Open-Meteo API
│   │   └── dataFetchService.js # JSONPlaceholder API
│   └── utils/
│       ├── storage.js          # AsyncStorage wrapper
│       └── validators.js       # Form validation
├── tests/
│   ├── taskLogic.test.js
│   ├── validators.test.js
│   └── weatherService.test.js
├── .env.example
├── app.json
├── package.json
└── README.md
```

---

## API Integrations

### Weather (Open-Meteo)
- **URL:** `https://api.open-meteo.com/v1/forecast?latitude=32.78&longitude=-96.80&current_weather=true`
- **Used by:** Weather-category tasks via "Run Now"

### Data Fetch (JSONPlaceholder)
- **URL:** `https://jsonplaceholder.typicode.com/posts/1`
- **Used by:** Data Fetch-category tasks via "Run Now"

---

## License

MIT
