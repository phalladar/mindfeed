import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { url } = await req.json();
    const feed = await parser.parseURL(url);

    const newFeed = await prisma.feed.create({
      data: {
        title: feed.title || "Untitled Feed",
        url,
        userId: session.user.id,
        articles: {
          create: feed.items.map((item) => ({
            title: item.title || "Untitled",
            content: item.content || item.contentSnippet || "",
            url: item.link || "",
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          })),
        },
      },
    });

    return NextResponse.json(newFeed);
  } catch (error) {
    console.error("Failed to add feed:", error);
    return new NextResponse("Failed to add feed", { status: 500 });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const feeds = await prisma.feed.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return NextResponse.json(feeds);
  } catch (error) {
    console.error("Failed to fetch feeds:", error);
    return new NextResponse("Failed to fetch feeds", { status: 500 });
  }
}