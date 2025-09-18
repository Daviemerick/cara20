# ExecutiveAI Pro - Premium Business AI Assistant Platform

## Overview

ExecutiveAI Pro is a comprehensive business intelligence and AI assistant platform designed for enterprise clients. The system provides a premium dashboard experience for managing client interactions, scheduling meetings, analyzing conversations, and integrating with various business tools. Built with a modern React frontend and Express backend, the platform emphasizes luxury design aesthetics while delivering powerful business functionality.

The application serves as a multi-tenant SaaS platform where different business clients can manage their customer interactions, view analytics, schedule appointments, and configure integrations with popular business tools like Google Calendar, WhatsApp Business, and meeting platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React 18 with TypeScript** and employs a component-based architecture with the following key decisions:

- **UI Framework**: Uses Radix UI primitives with shadcn/ui components for consistent, accessible design
- **Styling**: Tailwind CSS with custom luxury dark theme focused on premium aesthetics using gold accents and dark backgrounds
- **Routing**: React Router v6 for client-side navigation with protected routes
- **State Management**: React Context API for authentication state, with React Query for server state management
- **Form Handling**: React Hook Form with Zod validation for robust form management

### Backend Architecture
The backend follows a **RESTful API design** with Express.js:

- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **Middleware**: Custom authentication middleware for protected routes
- **Multi-tenancy**: Client tenant mapping system for data isolation
- **Route Structure**: Organized into separate route modules (auth, dashboard)
- **Environment Configuration**: Flexible configuration supporting both development and production environments

### Data Layer
The application implements a **hybrid data architecture**:

- **Primary Database**: Supabase (PostgreSQL) for production data storage
- **Fallback Data**: JSON-based mock data for development and testing
- **Data Access**: Custom hooks (useClientData) that handle both live and fallback data scenarios
- **Type Safety**: Full TypeScript coverage with defined interfaces for all data models

### Authentication & Authorization
**JWT-based authentication system** with the following features:

- **Multi-client Support**: Each client has isolated authentication with their own credentials
- **Environment Variables**: Configurable login credentials per deployment
- **Token Management**: Secure token handling with refresh capabilities
- **Role-based Access**: Admin and viewer roles with appropriate permissions

### Integration Architecture
**Plugin-based integration system** supporting:

- **Google Workspace**: Calendar and Meet integration for scheduling
- **WhatsApp Business**: Message automation through Evolution API
- **Third-party APIs**: Extensible credential management system
- **Configuration Management**: Per-client integration settings with status tracking

### Deployment Strategy
The application is designed for **Replit deployment** with:

- **Concurrent Development**: Separate client and server processes during development
- **Production Build**: Single process serving both static files and API
- **Environment Handling**: Automatic environment detection and configuration
- **Static Asset Serving**: Optimized static file serving with proper caching headers

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and modern patterns
- **Express.js**: Backend web framework for API services
- **TypeScript**: Type safety across the entire application stack

### UI and Styling
- **Radix UI**: Accessible component primitives for consistent UI patterns
- **Tailwind CSS**: Utility-first CSS framework with custom luxury theme
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe styling variants

### Data Management
- **Supabase**: Primary database and backend services
- **React Query**: Server state management and caching
- **Zod**: Schema validation for forms and API data

### Authentication & Security
- **bcryptjs**: Password hashing for secure authentication
- **jsonwebtoken**: JWT token generation and verification
- **CORS**: Cross-origin resource sharing configuration

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting with TypeScript support
- **PostCSS**: CSS processing with Tailwind integration
- **Concurrently**: Running multiple development processes

### Charts and Visualization
- **Recharts**: Chart library for analytics and dashboard visualizations

The architecture prioritizes scalability, maintainability, and a premium user experience while maintaining flexibility for different client configurations and deployment scenarios.