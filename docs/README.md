# Limitless Infotech

A modern, responsive website for Limitless Infotech built with Next.js, TypeScript, and Tailwind CSS. Features include an AI-powered chatbot, comprehensive admin dashboard, portfolio showcase, and enterprise-grade performance optimizations.

## Features

- 🚀 **Next.js 14** with App Router and Server Components
- 🎨 **Tailwind CSS** for utility-first styling
- 🤖 **AI-Powered Chatbot (Auralis)** with intent detection and contextual responses
- 📊 **Admin Dashboard** for full content management and analytics
- 🎯 **PWA Support** with offline functionality and service workers
- 🔍 **SEO Optimized** with dynamic meta tags and structured data
- 🌐 **Internationalization** with multi-language support
- 📱 **Responsive Design** optimized for all devices
- 🔐 **Supabase Authentication** with role-based access control
- 📧 **Email Integration** with SMTP and template support
- 📈 **Analytics & Tracking** with real-time metrics
- 🎨 **Theme Support** with light/dark mode and system preference detection
- ⚡ **Performance Monitoring** with Core Web Vitals tracking
- 🛡️ **Security Features** including rate limiting and audit logging

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: Custom Auralis AI engine for intelligent chatbot
- **Deployment**: Netlify with CI/CD
- **Testing**: Jest, React Testing Library, Playwright
- **Linting**: ESLint, Prettier
- **Package Manager**: npm
- **Monitoring**: Vercel Analytics, custom performance tracking

## Getting Started

### Prerequisites

- Node.js 18.17+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Supabase account and project
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/limitless-infotech.git
cd limitless-infotech
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values (see Environment Variables section below).

4. **Set up the database:**
```bash
# Install Supabase CLI if not already installed
npm i supabase --save-dev

# Link to your Supabase project
npx supabase link --project-ref your-project-ref

# Run migrations
npx supabase db push
```

5. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_DATABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Configuration
AURALIS_API_KEY=your-auralis-api-key

# Email Configuration
EMAIL_API_KEY=your-email-api-key
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Analytics (optional)
GOOGLE_ANALYTICS_ID=your-ga-id
VERCEL_ANALYTICS_ID=your-vercel-id

# Other
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Project Structure

```
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Authentication routes
│   ├── admin/                    # Admin dashboard pages
│   │   ├── dashboard/           # Main dashboard
│   │   ├── faq/                 # FAQ management
│   │   ├── leads/               # Lead management
│   │   ├── mail/                # Email campaigns
│   │   ├── pages/               # Dynamic page editor
│   │   ├── portfolio/           # Portfolio management
│   │   ├── projects/            # Project management
│   │   ├── seo/                 # SEO tools
│   │   ├── testimonials/        # Testimonial management
│   │   └── users/               # User management
│   ├── api/                     # API routes
│   │   ├── analytics/           # Analytics endpoints
│   │   ├── auth/                # Authentication
│   │   ├── chat/                # Chatbot API
│   │   │   ├── auralis-brain/  # AI processing
│   │   │   └── session/         # Chat sessions
│   │   ├── email/               # Email sending
│   │   │   ├── inbound/         # Email processing
│   │   │   └── send/            # Email dispatch
│   │   ├── faq/                 # FAQ CRUD
│   │   ├── leads/               # Lead capture
│   │   ├── pages/               # Page management
│   │   ├── testimonials/        # Testimonial CRUD
│   │   └── webhooks/            # External integrations
│   ├── contact/                 # Contact page
│   ├── faq/                     # FAQ page
│   ├── portfolio/               # Portfolio showcase
│   ├── services/                # Services page
│   ├── testimonials/            # Testimonials page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── loading.tsx              # Loading UI
│   ├── metadata.ts              # SEO metadata
│   ├── not-found.tsx            # 404 page
│   └── page.tsx                 # Home page
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ...
│   │   ├── admin/               # Admin-specific components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── ...
│   │   ├── chatbot/             # Chatbot components
│   │   │   ├── ChatWidget.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ...
│   │   ├── common/              # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── SEOHead.tsx
│   │   │   └── ...
│   │   ├── contact/             # Contact page components
│   │   ├── faq/                 # FAQ components
│   │   ├── home/                # Home page components
│   │   ├── portfolio/           # Portfolio components
│   │   ├── services/            # Services components
│   │   └── testimonials/        # Testimonial components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAdaptiveForms.ts  # Form adaptation
│   │   ├── useCache.ts          # Caching logic
│   │   ├── useContactBehaviorTracking.ts
│   │   ├── useDebounce.ts       # Debounce utility
│   │   ├── useLazyImage.ts      # Image lazy loading
│   │   ├── usePersonalization.ts # User personalization
│   │   ├── useTheme.ts          # Theme management
│   │   ├── useToast.ts          # Toast notifications
│   │   ├── useTouchGestures.ts  # Touch interactions
│   │   └── useTranslation.ts    # i18n support
│   ├── lib/                     # Utility functions
│   │   ├── analytics.ts         # Analytics helpers
│   │   ├── auditLogger.ts       # Security logging
│   │   ├── auralisAI.ts         # AI chatbot engine
│   │   ├── auralisBrain.ts      # AI processing logic
│   │   ├── i18n.ts              # Internationalization
│   │   ├── logger.ts            # Application logging
│   │   ├── rateLimit.ts         # Rate limiting
│   │   ├── supabaseClient.ts    # Supabase client
│   │   └── validation.ts        # Form validation
│   ├── types/                   # TypeScript definitions
│   │   ├── chat.ts              # Chat types
│   │   ├── index.ts             # Common types
│   │   ├── supabase.ts          # Database types
│   │   └── ...
│   ├── messages/                # i18n messages
│   │   ├── en.json
│   │   ├── en-AE.json
│   │   ├── es.json
│   │   └── ...
│   └── utils/                   # Utility functions
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   │   ├── office-delhi.jpg
│   │   ├── office-mumbai.jpg
│   │   └── team/
│   ├── icons/                   # Icon assets
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── supabase/                    # Supabase configuration
│   ├── config.toml              # Supabase config
│   ├── functions/               # Edge functions
│   │   ├── generate-embeddings/
│   │   └── knowledge-upload/
│   ├── migrations/              # Database migrations
│   │   └── 20250922163825_consolidated_schema.sql
│   └── seed.sql                 # Database seed data
├── scripts/                     # Build and utility scripts
│   ├── generate-knowledge-base.ts
│   ├── seed-database.ts
│   └── update_mock_data.mjs
├── .github/                     # GitHub configuration
│   └── workflows/               # CI/CD workflows
├── coverage/                    # Test coverage reports
├── eslint.config.js             # ESLint configuration
├── jest.config.cjs              # Jest configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## Key Features

### AI-Powered Chatbot (Auralis)

The Auralis AI chatbot provides intelligent customer support with:

- **Intent Detection**: Automatically identifies user intent from natural language
- **Contextual Responses**: Tailored responses based on current page and user history
- **Knowledge Base Integration**: Draws from a comprehensive knowledge base for accurate answers
- **Proactive Suggestions**: Offers relevant next steps and suggestions
- **Multi-language Support**: Supports English, Spanish, and Arabic
- **Escalation Detection**: Identifies complex queries for human intervention
- **Location-based Pricing**: Adjusts pricing information based on user location
- **Session Management**: Maintains conversation context across sessions

### Admin Dashboard

Comprehensive content management system featuring:

- **Dynamic Page Editor**: Create and edit pages with rich text editor
- **Lead Management**: Track and manage customer inquiries
- **Analytics Dashboard**: Real-time metrics and performance tracking
- **SEO Tools**: Meta tag management and SEO optimization
- **Email Campaigns**: Create and send marketing emails
- **Testimonial Management**: Approve and manage customer testimonials
- **Portfolio Management**: Showcase projects and case studies
- **User Management**: Role-based access control and user administration
- **FAQ Management**: Maintain and organize frequently asked questions

### Performance & Security

- **PWA Support**: Offline functionality and app-like experience
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Security Headers**: Comprehensive security headers and CSP
- **Rate Limiting**: Protection against abuse and DoS attacks
- **Audit Logging**: Complete activity tracking for compliance
- **Data Validation**: Client and server-side validation
- **Error Boundaries**: Graceful error handling and recovery

## API Reference

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration

### Chatbot Endpoints

- `POST /api/chat/auralis-brain` - Process AI chat messages
- `GET /api/chat/session` - Get chat session history
- `POST /api/chat/session` - Create new chat session

### Content Management

- `GET /api/pages` - List pages
- `POST /api/pages` - Create page
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page

- `GET /api/testimonials` - List testimonials
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/[id]` - Update testimonial

- `GET /api/faq` - List FAQ items
- `POST /api/faq` - Create FAQ item
- `PUT /api/faq/[id]` - Update FAQ item

### Analytics

- `GET /api/analytics/chatbot` - Chatbot usage analytics
- `GET /api/analytics/contact` - Contact form analytics

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

### Commit Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Ensure all tests pass
4. Update documentation if needed
5. Create PR to `develop`
6. Code review and approval
7. Merge to `develop`
8. Deploy to staging for testing
9. Merge to `main` for production

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes
- `npm run db:reset` - Reset database to initial state

## Deployment

### Automatic Deployment (Netlify)

The project is configured for automatic deployment on Netlify:

1. Push to `main` branch triggers production deployment
2. Push to `develop` branch triggers staging deployment
3. All deployments include:
   - Build optimization
   - Asset optimization
   - Performance testing
   - Security scanning

### Manual Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Deploy to hosting provider:**
```bash
# For Netlify
netlify deploy --prod --dir .next

# For Vercel
vercel --prod
```

3. **Environment Setup:**
Ensure all environment variables are configured in your hosting platform.

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- src/components/ui/Button.test.tsx
```

### Test Structure

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint and database interaction testing
- **E2E Tests**: Full user journey testing with Playwright

### Test Coverage Goals

- Components: 80%+ coverage
- Utilities: 90%+ coverage
- API Routes: 85%+ coverage

## Monitoring & Analytics

### Performance Monitoring

- **Core Web Vitals**: Tracked via Vercel Analytics
- **Custom Metrics**: Page load times, API response times
- **Error Tracking**: Sentry integration for error monitoring

### Business Analytics

- **User Behavior**: Track page views, session duration
- **Conversion Tracking**: Lead generation and contact form submissions
- **Chatbot Analytics**: Conversation success rates, escalation metrics

## Security

### Authentication & Authorization

- Supabase Auth with JWT tokens
- Role-based access control (Admin, User, Guest)
- Secure password policies
- Session management with automatic expiration

### Data Protection

- SSL/TLS encryption for all data transmission
- Data sanitization and validation
- GDPR compliance for data handling
- Regular security audits and penetration testing

### Infrastructure Security

- Rate limiting on API endpoints
- CORS configuration
- Security headers (CSP, HSTS, etc.)
- Regular dependency updates and vulnerability scanning

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch:**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes** with proper tests
4. **Run the test suite:**
```bash
npm run test
npm run lint
```

5. **Commit your changes:**
```bash
git commit -m "feat: add new feature"
```

6. **Push to your branch:**
```bash
git push origin feature/your-feature-name
```

7. **Create a Pull Request** with detailed description

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write comprehensive tests
- Update documentation for API changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.limitlessinfotech.com](https://docs.limitlessinfotech.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/limitless-infotech/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/limitless-infotech/discussions)
- **Email**: support@limitlessinfotech.com
- **Discord**: [Join our community](https://discord.gg/limitlessinfotech)

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.io/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Auralis AI](https://auralis.ai/) - Advanced AI chatbot platform
- [Vercel](https://vercel.com/) - Deployment and analytics platform
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
