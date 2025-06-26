# Global Research Repository

A modern, multilingual research repository platform designed specifically for developing nations. Built with Next.js 15, TypeScript, and Supabase.

## 🌟 Features

### Core Functionality
- **Research Paper Submission**: Upload and submit research papers with comprehensive metadata
- **Advanced Search**: Search by title, authors, abstract, subject, country, and more
- **Multilingual Support**: Available in English, French, Spanish, German, and Greek
- **File Management**: Secure PDF upload and download with validation
- **User Authentication**: JWT-based authentication system
- **Offline Support**: Save submissions locally when offline

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Performance**: Caching strategies and lazy loading for optimal performance
- **Security**: File validation, rate limiting, and CSRF protection
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML

### Advanced Features
- **Real-time Validation**: Form validation with immediate feedback
- **Progress Tracking**: Upload progress indicators
- **Caching**: Intelligent caching for improved performance
- **Rate Limiting**: API rate limiting to prevent abuse
- **File Type Validation**: Strict PDF-only upload policy

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Git Bash (for Windows users)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd global-research-repository
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Create the following table:
   ```sql
   CREATE TABLE global_research_repository (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     authors TEXT[] NOT NULL,
     abstract TEXT NOT NULL,
     institution TEXT,
     country TEXT NOT NULL,
     subject TEXT NOT NULL,
     level TEXT NOT NULL,
     type TEXT NOT NULL,
     file_path TEXT NOT NULL,
     user_id TEXT NOT NULL,
     submitted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     downloads INTEGER DEFAULT 0,
     views INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
   - Create a storage bucket named `papers` with public access
   - Set up Row Level Security (RLS) policies as needed

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── paper/          # Paper detail pages
│   └── page.tsx        # Main page
├── components/         # React components
├── lib/               # Utilities and configurations
├── types/             # TypeScript type definitions
└── i18n.ts           # Internationalization
```

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components
- **ErrorBoundary**: Catches and handles React errors gracefully
- **LoadingSpinner**: Reusable loading component with progress indicators
- **UploadModal**: Comprehensive file upload with validation
- **SearchSection**: Advanced search functionality
- **PaperList**: Paginated list of research papers

### API Routes
- `/api/auth/verify` - JWT token verification
- `/api/papers` - CRUD operations for papers
- `/api/papers/[id]/download` - File download with validation

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |

### Tailwind Configuration
The project uses a custom color palette inspired by arXiv:
- `arxivRed`: Primary brand color
- `arxivBlue`: Secondary brand color
- `arxivGray`: Background color

### TypeScript Configuration
- Strict mode enabled
- Path mapping configured for `@/*` imports
- Next.js specific configurations included

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Production Checklist
- [ ] Set all environment variables
- [ ] Configure Supabase RLS policies
- [ ] Set up custom domain (optional)
- [ ] Configure CDN for file storage
- [ ] Set up monitoring and analytics

## 🔒 Security Features

### File Upload Security
- File type validation (PDF only)
- File size limits (5MB max)
- Secure file storage in Supabase
- Virus scanning (recommended for production)

### API Security
- Rate limiting (10 requests per minute)
- Input sanitization
- JWT token validation
- CORS configuration

### Data Protection
- Row Level Security (RLS) in Supabase
- Encrypted data transmission
- Secure cookie handling

## 🌍 Internationalization

The application supports 5 languages:
- English (default)
- French
- Spanish
- German
- Greek

Translation files are located in `src/i18n.ts` and can be easily extended.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Paper submission with valid data
- [ ] File upload with different file types
- [ ] Search functionality
- [ ] Pagination
- [ ] Language switching
- [ ] Error handling
- [ ] Offline functionality
- [ ] Mobile responsiveness

### Automated Testing (Future)
- Unit tests with Jest
- Integration tests with Playwright
- E2E tests for critical user flows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🔄 Changelog

### v0.1.0 (Current)
- Initial release
- Core functionality implemented
- Multilingual support
- File upload and download
- Advanced search
- Error handling and validation
- Performance optimizations

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Heroicons](https://heroicons.com/)
