"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';

export default function OnboardingPrompt() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Welcome to MindFeed</CardTitle>
        <CardDescription>
          Stay up to date with your favorite content in one place
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Sign in to create your personalized feed and start following your
          favorite websites and blogs.
        </p>
        <Button
          onClick={() => signIn('google', { callbackUrl })}
          variant="default"
        >
          Sign in
        </Button>
      </CardContent>
    </Card>
  );
}