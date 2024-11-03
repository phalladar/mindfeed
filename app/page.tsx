export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import ArticleList from '@/components/article-list';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddFeedDialog from '@/components/add-feed-dialog';
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Feed</h1>
        {session && (
          <AddFeedDialog>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Feed
            </Button>
          </AddFeedDialog>
        )}
      </div>
      <Suspense fallback={<div>Loading articles...</div>}>
        <ArticleList />
      </Suspense>
    </div>
  );
}