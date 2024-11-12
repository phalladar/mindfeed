'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <Card className="mx-auto max-w-md mt-8">
      <CardHeader>
        <CardTitle>Authentication Error</CardTitle>
        <CardDescription>An error occurred during authentication.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Error details: {error}
        </div>
      </CardContent>
    </Card>
  );
}