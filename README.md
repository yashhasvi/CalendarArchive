# Calendar Archive - AI-Powered Educational Platform

A modern, interactive calendar-based educational platform that helps users explore historical events and learn through AI-powered tools.

## 🚀 Features

- **Interactive Calendar**: Browse historical events by date with beautiful animations
- **AI Assistant**: Powered by Ollama for generating essays, quizzes, and explanations
- **User Authentication**: Google OAuth and email/password authentication via Supabase
- **Role-based Access**: Guest, User, and Admin roles with different permissions
- **Responsive Design**: Mobile-first design with glassmorphism effects
- **Dark/Light Theme**: Smooth theme switching with system preference detection
- **Personal Dashboard**: Track bookmarks, notes, and learning progress
- **Admin Panel**: Manage events, users, and platform settings

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI Integration**: Ollama (local AI model)
- **State Management**: React Context API
- **Routing**: React Router v6

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Ollama** installed and running locally
4. **Supabase** account and project

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd calendar-archive
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Ollama (AI Integration)

#### Install Ollama:
- **macOS**: `brew install ollama`
- **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`
- **Windows**: Download from [ollama.ai](https://ollama.ai)

#### Start Ollama service:
```bash
ollama serve
```

#### Pull a model (recommended: llama2):
```bash
ollama pull llama2
```

#### Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

### 4. Set up Supabase

#### Create a Supabase Project:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready

#### Configure Authentication:
1. Go to Authentication > Settings
2. Enable Google OAuth provider
3. Add your domain to allowed origins
4. Configure redirect URLs

#### Get your credentials:
1. Go to Settings > API
2. Copy your project URL and anon key

### 5. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Database Setup (Optional)

The app works with mock data by default. To set up a real database:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create the following tables:

```sql
-- Users table (handled by Supabase Auth)
-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🔐 Authentication Setup

### Admin Access
- The admin user is configured as: `dasariyashasvi@gmail.com`
- Any user with this email will have admin privileges
- Admin can access the admin panel and manage events

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
6. Add the credentials to your Supabase project

## 🤖 AI Integration

The AI assistant uses Ollama running locally. Make sure:

1. Ollama is installed and running (`ollama serve`)
2. A model is pulled (`ollama pull llama2`)
3. The service is accessible at `http://localhost:11434`

### Supported AI Features:
- Essay generation
- Quiz creation
- Quote generation
- Simple explanations
- Custom prompts

## 📱 Features Overview

### For Guests:
- Browse calendar and view events
- Limited AI assistant access
- View event details

### For Users:
- All guest features
- Personal bookmarks and notes
- Full AI assistant access
- User dashboard
- Settings management

### For Admins:
- All user features
- Admin panel access
- Event management (CRUD)
- User management
- CSV upload for bulk events

## 🎨 Design System

The app uses a custom design system with:
- **Colors**: Earth tones with blue accents
- **Typography**: Inter for headings, DM Sans for body
- **Components**: Glassmorphism effects with rounded corners
- **Animations**: Smooth transitions with Framer Motion

## 🔧 Troubleshooting

### Common Issues:

1. **Ollama not responding**:
   - Check if Ollama is running: `ollama serve`
   - Verify the model is installed: `ollama list`

2. **Supabase connection issues**:
   - Verify environment variables
   - Check Supabase project status
   - Ensure correct API keys

3. **Authentication not working**:
   - Check Google OAuth configuration
   - Verify redirect URLs
   - Ensure Supabase Auth is enabled

4. **Build errors**:
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

## 📚 Project Structure

```
src/
├── components/          # React components
├── context/            # React context providers
├── data/              # Mock data and types
├── lib/               # Utility libraries
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🚀 Deployment

### Local Deployment:
1. Build the project: `npm run build`
2. Serve the build: `npm run preview`

### Production Deployment:
1. Configure environment variables for production
2. Update Supabase settings for production domain
3. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review Supabase documentation
- Check Ollama documentation
- Create an issue in the repository