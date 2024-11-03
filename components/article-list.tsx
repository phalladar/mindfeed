import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ArticleCard from "./article-card";
import OnboardingPrompt from "./onboarding-prompt";

async function getArticles() {
  const session = await auth();

  if (!session?.user?.id) {
    // Return default feeds for non-logged-in users
    return prisma.article.findMany({
      take: 20,
      orderBy: {
        publishedAt: "desc",
      },
      include: {
        feed: true,
        votes: true,
      },
    });
  }

  // Get articles from user's feeds with their votes
  return prisma.article.findMany({
    where: {
      feed: {
        userId: session.user.id,
      },
    },
    take: 20,
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      feed: true,
      votes: {
        where: {
          userId: session.user.id,
        },
        select: {
          value: true,
        },
      },
    },
  });
}

export default async function ArticleList() {
  const session = await auth();
  const articles = await getArticles();

  if (!session?.user?.id && articles.length === 0) {
    return <OnboardingPrompt />;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No articles yet</h3>
        <p className="text-muted-foreground">Add some feeds to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          userVote={article.votes[0]?.value}
        />
      ))}
    </div>
  );
}