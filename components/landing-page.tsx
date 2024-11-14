"use client";

import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center mt-[10vh]">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your Personal Feed, <span className="text-muted-foreground">Intelligently Curated</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          MindFeed helps you stay informed by bringing all your favorite content 
          into one place, with smart recommendations based on your interests.
        </p>
        <div className="mt-10">
          <Button onClick={() => signIn("google")} size="lg">
            Get Started Free
          </Button>
        </div>

        <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="rounded-lg bg-muted p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M4 18h6"/><path d="M14.5 9c1.5-5 4.5-5 5.5-5 .5 1.5.5 4-1.5 5s-3 2-3 6"/></svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">RSS Integration</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Follow your favorite websites, blogs, and news sources in one unified feed.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-lg bg-muted p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Smart Recommendations</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Discover content you'll love with our AI-powered recommendation engine.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-lg bg-muted p-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Clean Reading Experience</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              Enjoy distraction-free reading with our beautifully formatted article view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 