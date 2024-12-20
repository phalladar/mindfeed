import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindFeed',
  description: 'A modern RSS reader built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <div className="container mx-auto flex gap-6 px-4 flex-1 pt-4">
                <Sidebar />
                <main className="flex-1">{children}</main>
              </div>
              <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                <div className="container mx-auto">
                  <p>
                    Copyright © MindFeed - 2024 |{' '}
                    <a 
                      href="https://auriemmai.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}