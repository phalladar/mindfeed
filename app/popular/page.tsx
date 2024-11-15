export const dynamic = 'force-dynamic';

import { auth } from "@/lib/auth";
import { Suspense } from "react";
import ArticleList from "@/components/article-list";
import OnboardingPrompt from "@/components/onboarding-prompt";
import { getRecommendedArticles } from "@/lib/article-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export default async function PopularPage() {
  const session = await auth();
  
  if (!session?.user) {
    return <OnboardingPrompt />;
  }

  const articles = await getRecommendedArticles(session.user.id);

  // Show learning message if no recommendations yet
  if (!articles) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Learning Your Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We're still learning what content you enjoy. Interact with more articles 
            in your feed by reading and voting, then check back here for personalized 
            recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            No Recommendations Yet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We haven't found articles that strongly match your interests yet. 
            Keep interacting with your feed, and we'll notify you when we have 
            great recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Recommended For You</h1>
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <ArticleList initialArticles={articles} />
      </Suspense>
    </div>
  );
} 