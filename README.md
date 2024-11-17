# MindFeed

A modern RSS reader built with Next.js that uses machine learning to provide intelligent article recommendations. MindFeed helps you stay informed by bringing all your favorite content into one place, with smart recommendations based on your interests.

## Features

- 🤖 **Intelligent Recommendations**
  - ML-powered content recommendations based on reading habits
  - Topic extraction and categorization
  - Personalized feed preferences
  - Customizable recommendation settings

- 📖 **Clean Reading Experience**
  - Distraction-free article view powered by Mozilla's Readability
  - Reading time estimates
  - Vote on articles to improve recommendations
  - Article content extraction and formatting

- 🎨 **Modern UI/UX**
  - Beautiful, responsive design built with shadcn/ui
  - Dark/light mode with system preference detection
  - Mobile-friendly interface
  - Toast notifications for user feedback

- 🔐 **Secure Authentication**
  - Google OAuth integration
  - Protected API routes
  - Secure session management
  - User-specific feed management

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google provider
- **UI Components**: shadcn/ui + Tailwind CSS
- **Content Processing**:
  - Mozilla Readability for article parsing
  - RSS Parser for feed management
  - ML-based topic extraction
- **State Management**: Zustand for client-side state
- **Type Safety**: TypeScript throughout

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/phalladar/mindfeed.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```


## Project Structure

- `/app` - Next.js 14 app router pages and API routes
  - `/api` - Backend API endpoints
  - `/feeds` - Feed management pages
  - `/recommended` - Recommendation system pages
- `/components` - Reusable React components
  - UI components (cards, dialogs, etc.)
  - Feed and article components
  - Authentication components
- `/lib` - Core functionality and utilities
  - Authentication setup
  - Database services
  - Article processing
  - Recommendation engine
- `/prisma` - Database schema and migrations

## Key Features Implementation

### Recommendation System
- Topic extraction from articles
- User preference learning from interactions
- Weighted scoring based on topics, feeds, and recency
- Customizable recommendation settings

### Feed Management
- RSS feed addition and parsing
- Article content extraction
- Reading progress tracking
- Vote-based feedback system

### Authentication Flow
- Google OAuth integration
- Protected routes and API endpoints
- Session management
- User-specific data isolation

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postinstall` - Generate Prisma client

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Mozilla Readability](https://github.com/mozilla/readability) for article parsing
- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://www.prisma.io/) for the powerful ORM
- [NextAuth.js](https://next-auth.js.org/) for authentication