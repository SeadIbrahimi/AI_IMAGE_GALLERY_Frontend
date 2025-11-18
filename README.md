# AI-Powered Image Gallery UI

A modern, full-featured image gallery application with AI-powered features, built as a skills assessment project. This application demonstrates proficiency in modern web development, API integration, authentication, and UI/UX design.

## 🎯 Project Purpose

This project was developed as part of a technical skills assessment to demonstrate:

- Modern React development with TypeScript
- Integration with RESTful APIs and AI services
- User authentication and session management
- Responsive design and UX best practices
- State management and component architecture

## ✨ Features

### Core Functionality

- **User Authentication**: Complete auth system with login, signup, and email verification
- **Session Management**: Automatic token refresh when sessions expire with user-friendly modal
- **Image Upload**: Single and bulk image upload with progress tracking
- **Gallery View**: Responsive grid layout with infinite scroll pagination
- **Search & Filter**: Real-time search with advanced filtering by tags, colors, and sorting options
- **Image Details**: Comprehensive view with metadata, tags, colors, and AI-generated descriptions
- **Similar Images**: AI-powered image similarity search showing visually related images
- **Metadata Editing**: Update descriptions, tags, and colors with an intuitive modal interface

### AI-Powered Features

- **AI Description Generation**: Automatic image description using computer vision
- **Smart Tagging**: AI-generated tags for better organization
- **Color Extraction**: Dominant color detection and display
- **Visual Similarity**: Find similar images based on AI embeddings

### Technical Features

- **Session Expiry Handling**: Modal prompt to refresh session or logout when token expires
- **Email Verification**: Users must verify email before accessing the application
- **Dynamic Data**: Tags and colors fetched from backend based on actual image data
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Comprehensive error messages and fallback states
- **Toast Notifications**: Non-intrusive success/error messages

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Motion (Framer Motion)** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### Backend Integration

- **FastAPI** - Python REST API
- **Supabase** - Authentication and database
- **OpenAI Vision API** - AI image analysis
- **CLIP Embeddings** - Visual similarity search

### Key Libraries

- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional class names
- **react-hook-form** - Form validation
- **embla-carousel-react** - Touch-enabled carousels

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (FastAPI server)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file is already set up with the local API URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8001
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix + Tailwind)
│   ├── figma/           # Figma-exported components
│   ├── Gallery.tsx      # Main gallery view
│   ├── ImageDetail.tsx  # Image detail page
│   ├── SimilarImages.tsx # Similar images view
│   ├── EditImageModal.tsx # Edit metadata modal
│   ├── SessionExpiredModal.tsx # Session refresh modal
│   ├── Login.tsx        # Login page
│   ├── Signup.tsx       # Signup page
│   └── ...
├── contexts/            # React context providers
│   └── AuthContext.tsx  # Authentication state management
├── services/            # API integration
│   └── api.ts          # API service with typed endpoints
├── App.tsx             # Main app component with routing
└── main.tsx           # Application entry point
```

## 🔐 Authentication Flow

1. **Signup**: User creates account → Redirected to login → Verify email via link
2. **Login**: User logs in → Receives access_token and refresh_token → Redirected to gallery
3. **Session Expiry**: When token expires → Modal appears → User can refresh session or logout
4. **Session Refresh**: Uses refresh_token to get new access_token → Page reloads → User continues

## 🎨 Design System

The application follows a consistent design system:

- **Primary Gradient**: Purple gradient (#667EEA → #764BA2)
- **Colors**: Semantic color palette for states and actions
- **Typography**: Clear hierarchy with readable font sizes
- **Spacing**: 8px grid system
- **Shadows**: Subtle elevation for depth
- **Animations**: Smooth transitions and micro-interactions

## 🌐 API Integration

The application integrates with the following backend endpoints:

### Authentication

- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login with credentials
- `POST /auth/refresh` - Refresh access token

### Images

- `GET /images` - List images with pagination and filters
- `GET /images/{id}` - Get image details
- `POST /images/upload` - Upload single image
- `POST /images/upload/bulk` - Upload multiple images
- `PATCH /images/{id}` - Update image metadata
- `DELETE /images/{id}` - Delete image
- `GET /images/{id}/similar` - Get similar images

### Metadata

- `GET /tags/recent` - Get recent tags
- `GET /colors/popular` - Get popular colors

## 🎯 Key Implementation Details

### Token Refresh Flow

- API service dispatches `session-expired` event on 401 errors
- App component listens for event and shows SessionExpiredModal
- User can choose to refresh session or logout
- On refresh, new tokens are stored and page reloads

### Dynamic Filters

- Tags and colors are fetched from backend on component mount
- Fallback to default values if API fails
- Filters update URL query params for shareable links

### Image Editing

- Color picker for visual color selection
- Hex validation for manual color input
- Tag management with add/remove functionality
- Optimistic UI updates with error rollback

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px (single column, mobile menu)
- **Tablet**: 768px - 1024px (2 column grid)
- **Desktop**: > 1024px (3+ column grid, sidebar always visible)

## 🔄 State Management

- **AuthContext**: Global authentication state
- **Component State**: Local state with useState
- **URL State**: Search params for filters and pagination
- **Event System**: Custom events for cross-component communication

## 🚀 Performance Optimizations

- Lazy loading for images
- Debounced search input (500ms)
- Pagination with offset/limit
- Optimized re-renders with React.memo where appropriate
- Code splitting with dynamic imports

## 📝 Future Enhancements

- Collections/Albums feature
- Batch operations (multi-select, bulk delete)
- Advanced search with multiple criteria
- Image export in different formats
- Dark mode support
- PWA capabilities for offline access
