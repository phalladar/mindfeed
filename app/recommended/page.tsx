export const dynamic = 'force-dynamic';

import { auth } from "@/auth";
import { Suspense } from "react";
import RecommendedArticleList from "@/components/recommended-article-list";
import OnboardingPrompt from "@/components/onboarding-prompt";
import { getRecommendedArticles } from "@/lib/article-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import RecommendedHeader from "@/components/recommended-header";

export default async function RecommendedPage() {
  const session = await auth();
  
  if (!session?.user) {
    return <OnboardingPrompt />;
  }

  console.log('Fetching initial recommendations for user:', session.user.id);
  const articles = await getRecommendedArticles(session.user.id, false);
  console.log('Received articles:', articles ? articles.length : 'null');

  // Show learning message if no recommendations yet
  if (!articles) {
    console.log('No articles returned (null)');
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
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
    console.log('Empty articles array returned');
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
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

  console.log('Rendering article list with', articles.length, 'articles');
  return (
    <div className="space-y-8">
      <RecommendedHeader />
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <RecommendedArticleList initialArticles={articles} />
      </Suspense>
    </div>
  );
} 