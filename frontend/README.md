# Bare & Best Frontend

A modern e-commerce and pharmacy management system built with React, Redux, and Material UI.

## Overview

Bare & Best is a full-featured e-commerce platform specializing in pharmaceutical and personal care products, with separate interfaces for customers and administrators.

## Key Features

### User Features
- Secure authentication system with JWT and cookie-based sessions
- Product browsing and searching
- Real-time chat support through enquiry system
- User profile management
- Shopping cart functionality
- Order history tracking
- Password reset functionality

### Admin Features
- Product management (CRUD operations)
- Real-time enquiry management system
- Admin dashboard for monitoring
- User query response system
- Inventory management
- Protected admin routes

### General Features
- Responsive design
- Role-based access control
- Real-time data updates
- Image upload and management
- Form validations
- Error handling
- Loading states

## Tech Stack

- **Frontend Framework:** React 18
- **State Management:** Redux Toolkit
- **UI Components:** Material-UI
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **API Integration:** Axios
- **Icons:** React Icons
- **Date Handling:** Moment.js
- **Form Handling:** Native Forms with validation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components
│   └── ...
├── pages/              # Page components
├── store/              # Redux store setup
│   └── slices/         # Redux slices
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── layouts/            # Layout components
└── App.jsx            # Main application component
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to project directory:
```bash
cd pharma_frontend/pharma
```

3. Install dependencies:
```bash
npm install
```

4. Create `.env` file:
```env
REACT_APP_API_URL
```

5. Start development server:
```bash
npm run dev
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL

## API Integration

The application uses Axios for API calls with the following configuration:
- Base URL: `REACT_APP_API_URL`
- Credentials: Includecd ph 
- Headers:
  - Accept: application/json
    - Content Type: application/json

## Authentication Flow

- JWT-based authentication
- Cookie-based session management
- Role-based access control (admin/user)
- Protected route implementation

## Routing Structure

- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/products` - Product listing
- `/product/:id` - Product details
- `/admin/enquiries` - Admin enquiry management
- `/userProfile` - User profile management
- `/addProduct` - Add new product (admin only)
- `/editProduct/:id` - Edit product (admin only)

## State Management

Redux Toolkit is used for state management with the following slices:
- `auth` - Authentication state
- `products` - Product management
- `enquiry` - Enquiry system
- `cart` - Shopping cart
- `banner` - Banner management

## Best Practices

- Component-based architecture
- Custom hooks for logic reuse
- Protected routes implementation
- Proper error handling
- Loading state management
- Form validation
- Responsive design
- Code splitting

## Support

For support, please raise an issue in the repository or contact the development team.

## License

This project is proprietary software. All rights reserved.
