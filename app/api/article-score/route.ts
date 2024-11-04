import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Scoring weights
const WEIGHTS = {
  VOTE: 10,       // Base score for votes (multiplied by vote value)
  VIEW: 1,        // Opening the article
  SCROLL: 0.1,    // Per percentage scrolled
  READ_TIME: 0.05 // Per second spent reading
};

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { articleId, interaction, value } = await req.json();
    
    let scoreIncrement = 0;
    
    switch (interaction) {
      case 'vote':
        scoreIncrement = WEIGHTS.VOTE * value; // value: 1 or -1
        break;
      case 'view':
        scoreIncrement = WEIGHTS.VIEW;
        break;
      case 'scroll':
        scoreIncrement = WEIGHTS.SCROLL * value; // value: percentage scrolled
        break;
      case 'readTime':
        scoreIncrement = WEIGHTS.READ_TIME * value; // value: seconds spent
        break;
    }

    const articleScore = await prisma.articleScore.upsert({
      where: {
        userId_articleId: {
          userId: session.user.id,
          articleId,
        },
      },
      update: {
        score: {
          increment: scoreIncrement,
        },
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        articleId,
        score: scoreIncrement,
      },
    });

    return NextResponse.json(articleScore);
  } catch (error) {
    console.error("Failed to update article score:", error);
    return new NextResponse("Failed to update article score", { status: 500 });
  }
} 