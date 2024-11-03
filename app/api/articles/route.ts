import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ARTICLES_PER_PAGE = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const session = await auth();

  try {
    const baseQuery = {
      take: ARTICLES_PER_PAGE,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      orderBy: {
        publishedAt: "desc" as const,
      },
      include: {
        feed: true,
        votes: session?.user?.id
          ? {
              where: {
                userId: session.user.id,
              },
              select: {
                value: true,
              },
            }
          : true,
      },
    };

    const articles = !session?.user?.id
      ? await prisma.article.findMany({
          ...baseQuery,
        })
      : await prisma.article.findMany({
          ...baseQuery,
          where: {
            feed: {
              userId: session.user.id,
            },
          },
        });

    const lastArticle = articles[articles.length - 1];
    const nextCursor = lastArticle?.id;

    return NextResponse.json({
      articles,
      nextCursor,
      hasMore: articles.length === ARTICLES_PER_PAGE,
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return new NextResponse("Failed to fetch articles", { status: 500 });
  }
} 