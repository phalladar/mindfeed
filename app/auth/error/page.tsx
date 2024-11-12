'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only access window on client side
    const searchParams = new URLSearchParams(window.location.search);
    setError(searchParams.get('error'));
  }, []);

  return (
    <Card className="mx-auto max-w-md mt-8">
      <CardHeader>
        <CardTitle>Authentication Error</CardTitle>
        <CardDescription>An error occurred during authentication.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {error ? `Error details: ${error}` : 'Loading error details...'}
        </div>
      </CardContent>
    </Card>
  );
}