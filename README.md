# 🚀 AI-Powered Blog Management System

A comprehensive full-stack blog system with AI-powered content generation, built with modern web technologies.

## ✨ Features

### 🤖 AI-Powered Content Generation
- **Blog Post Generation**: Create complete blog posts with customizable tone, length, and target audience
- **Content Improvement**: Enhance existing content for readability, SEO, engagement, and clarity
- **Tag Generation**: Automatic tag suggestions based on content analysis
- **SEO Optimization**: Generate SEO-friendly titles and excerpts
- **Post Ideas**: Get creative topic suggestions with descriptions and keywords
- **Content Analysis**: Comprehensive analysis of content quality and characteristics

### 📝 Complete Blog Management
- **CRUD Operations**: Create, read, update, and delete blog posts
- **Categories & Tags**: Organize content with categories and tags
- **Comments System**: Threaded comments with moderation
- **User Authentication**: Secure registration and login system
- **Role-Based Access**: Admin and user role management
- **Dashboard**: Comprehensive admin and analytics dashboard

### 🎨 Modern User Interface
- **React + TypeScript**: Type-safe modern React application
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Mode**: Theme switching support

## 🏗️ Architecture

### Backend
- **Node.js + Express**: RESTful API server
- **Prisma ORM**: Type-safe database access
- **SQLite**: Lightweight database for development
- **JWT Authentication**: Secure token-based auth
- **OpenAI Integration**: GPT-4 powered AI features

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Full type safety
- **React Query**: Efficient data fetching and caching
- **React Router**: Client-side routing
- **Vite**: Fast development and build tool

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Anirach/genspark-persona-extract.git
cd genspark-persona-extract
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies  
cd backend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env and add your OpenAI API key
OPENAI_API_KEY="your-openai-api-key-here"
```

4. **Database Setup**
```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed
cd ..
```

5. **Start Development Servers**

**Option A: Development Mode (with hot reload)**
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend  
npm run dev
```

**Option B: Production Mode (using PM2)**
```bash
# Install PM2 globally
npm install -g pm2

# Build and start both services
npm run build
pm2 start ecosystem.config.js
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Blog Management
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### AI Features
- `POST /api/ai/generate-post` - Generate blog post
- `GET /api/ai/generate-ideas` - Get post ideas
- `POST /api/ai/improve-content` - Improve content
- `POST /api/ai/generate-tags` - Generate tags
- `POST /api/ai/generate-seo-titles` - Generate SEO titles
- `POST /api/ai/analyze-content` - Analyze content

### Categories & Tags
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag

### Comments
- `GET /api/comments` - Get comments
- `POST /api/comments` - Create comment

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"
PORT=8000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
```

### PM2 Configuration

The project includes PM2 ecosystem configurations for production deployment:
- `backend.ecosystem.config.js` - Backend server
- `frontend.ecosystem.config.js` - Frontend static server

## 🎯 AI Integration

The system integrates with OpenAI's GPT-4 for powerful content generation:

1. **Blog Post Generation**: Creates comprehensive blog posts with customizable parameters
2. **Content Enhancement**: Improves existing content for various aspects
3. **SEO Optimization**: Generates SEO-friendly titles and meta descriptions
4. **Tag Suggestion**: Analyzes content to suggest relevant tags
5. **Content Analysis**: Provides insights on content quality and engagement

## 🔐 Security Features

- JWT-based authentication
- Input validation and sanitization  
- Rate limiting on API endpoints
- CORS protection
- Environment variable protection
- Secret scanning prevention

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🚢 Deployment

### Production Build
```bash
# Build frontend for production
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Monitor processes
pm2 status
pm2 logs
```

### Docker Deployment (Optional)
```bash
# Build Docker image
docker build -t blog-system .

# Run container
docker run -p 3000:3000 -p 8000:8000 blog-system
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Anirach/genspark-persona-extract/issues) section
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🙏 Acknowledgments

- OpenAI for the GPT-4 API
- Prisma team for the excellent ORM
- shadcn for the beautiful UI components
- Vercel team for Vite and development tools

---

Made with ❤️ using modern web technologies