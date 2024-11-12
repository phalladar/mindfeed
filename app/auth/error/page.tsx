'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ErrorContent() {
  // Get error from URL in client component
  const error = new URLSearchParams(window.location.search).get('error');
  
  return (
    <div className="text-sm text-muted-foreground">
      Error details: {error}
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Card className="mx-auto max-w-md mt-8">
      <CardHeader>
        <CardTitle>Authentication Error</CardTitle>
        <CardDescription>An error occurred during authentication.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading error details...</div>}>
          <ErrorContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}