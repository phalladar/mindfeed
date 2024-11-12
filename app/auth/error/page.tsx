"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You have denied access to your Google account.";
      case "OAuthSignin":
        return "Error occurred during Google sign in initialization.";
      case "OAuthCallback":
        return "Error occurred during Google sign in completion.";
      case "OAuthCreateAccount":
        return "Error creating OAuth account.";
      case "EmailSignin":
        return "The email sign in link is invalid or has expired.";
      case "CredentialsSignin":
        return "Sign in failed. Check the details you provided are correct.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return errorDescription || "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Authentication Error
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {getErrorMessage(error)}
        </p>
        <Button asChild className="w-full">
          <Link href="/login">Try Again</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto max-w-md py-12">
      <Suspense 
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
} 