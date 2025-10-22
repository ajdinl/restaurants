# Restaurant Management System

Full-stack restaurant management application with user authentication, menu management, table reservations, and order tracking. Built with modern architecture following SOLID principles and Command Pattern.

## Tech Stack

-   **Frontend:** Next.js 14, React 18, Tailwind CSS
-   **Backend:** Next.js API Routes, NextAuth.js
-   **Database:** MongoDB with Mongoose
-   **Authentication:** NextAuth.js (JWT)
-   **Architecture:** Command Pattern, Custom Hooks, Modular Components

## Features

-   User authentication with admin/user roles
-   Restaurant CRUD operations with validation
-   Menu management with full CRUD
-   Table management and capacity tracking
-   Order tracking and management
-   Reservation system with status management
-   Dark mode support
-   Comprehensive input validation (frontend & backend)
-   Centralized error handling
-   Modular and reusable components

## Architecture Highlights

### Custom Hooks

-   `useAuth` - Authentication management
-   `useRestaurants` - Restaurant data fetching
-   `useModal` - Modal state management
-   `useTheme` - Theme management

### Commands Pattern

-   Single Responsibility operations
-   Consistent validation
-   Testable business logic
-   Commands for all entities (User, Restaurant, Menu, Table, Order, Reservation)

### Validators

-   Comprehensive input validation
-   Reusable validation logic
-   Frontend and backend validation
-   Clear error messages

For detailed architecture information, see [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)

## Installation

### 1. Install MongoDB

**macOS:**

```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**

```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

**Windows:**  
Download from [mongodb.com](https://www.mongodb.com/try/download/community)

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Create `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/restaurants
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

Generate secret key:

```bash
openssl rand -base64 32
```

### 4. Create Admin User

```bash
# Default admin (admin@example.com / admin123)
npm run create-admin

# Custom admin
npm run create-admin your@email.com password123 "Your Name"
```

## Run Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run create-admin # Create admin user
```

## Project Structure

```
restaurants/
├── hooks/                  # Custom React hooks
├── commands/               # Command Pattern implementation
├── lib/
│   ├── validators/        # Input validation
│   ├── error-handler.js   # Error handling
│   └── constants.js       # Application constants
├── components/
│   ├── common/            # Reusable components
│   ├── layout/            # Layout components
│   ├── dashboard/         # Dashboard sections & cards
│   └── modals/            # Modal components & forms
├── app/api/               # API routes with Commands
├── models/                # Mongoose models
└── services/              # API services
```

## Database Structure

-   **users** - User accounts (email, password, full_name, is_admin)
-   **restaurants** - Restaurant information
-   **menus** - Menu items with ingredients and prices
-   **tables** - Restaurant tables with capacity
-   **orders** - Customer orders
-   **reservations** - Table reservations

All models include validation and are managed through Commands for consistency.

## Production Deployment

### MongoDB Atlas

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in environment variables
