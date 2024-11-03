import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ArticleCard from "./article-card";
import OnboardingPrompt from "./onboarding-prompt";
import ArticleListClient from "./article-list-client";

const ARTICLES_PER_PAGE = 10;

async function getArticles() {
  const session = await auth();

  const articles = !session?.user?.id
    ? await prisma.article.findMany({
        take: ARTICLES_PER_PAGE,
        orderBy: {
          publishedAt: "desc",
        },
        include: {
          feed: true,
          votes: true,
        },
      })
    : await prisma.article.findMany({
        where: {
          feed: {
            userId: session.user.id,
          },
        },
        take: ARTICLES_PER_PAGE,
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

  return articles;
}

export default async function ArticleList() {
  const session = await auth();
  const initialArticles = await getArticles();

  if (!session?.user?.id && initialArticles.length === 0) {
    return <OnboardingPrompt />;
  }

  if (initialArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No articles yet</h3>
        <p className="text-muted-foreground">Add some feeds to get started!</p>
      </div>
    );
  }

  return <ArticleListClient initialArticles={initialArticles} />;
}