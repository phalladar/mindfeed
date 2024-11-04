# MindFeed

A modern RSS reader built with Next.js, featuring intelligent article recommendations and a clean reading experience.

## Features

- 🎨 Beautiful, responsive UI built with shadcn/ui components
- 🌓 Dark/light mode with system preference detection
- 🔐 User authentication
- 📱 Mobile-friendly design
- 📖 Clean article reading experience with Mozilla's Readability
- 🤖 Intelligent topic extraction and article recommendations
- 🔔 Toast notifications for user feedback
- 📊 Reading time estimates

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Database**: Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Content Parsing**: Mozilla Readability
- **TypeScript**: For type safety

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mindfeed.git
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

- `/app` - Next.js 13+ app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and shared logic
- `/hooks` - Custom React hooks
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Environment Variables

The following environment variables are required:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

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
