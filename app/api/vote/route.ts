import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { articleId, value } = await req.json();

    // Validate the vote value
    if (![1, 0, -1].includes(value)) {
      return new NextResponse("Invalid vote value", { status: 400 });
    }

    let vote;
    if (value === 0) {
      // Delete the vote if value is 0
      vote = await prisma.vote.delete({
        where: {
          userId_articleId: {
            userId: session.user.id,
            articleId,
          },
        },
      }).catch(() => null); // Ignore if vote doesn't exist
    } else {
      // Upsert the vote for other values
      vote = await prisma.vote.upsert({
        where: {
          userId_articleId: {
            userId: session.user.id,
            articleId,
          },
        },
        update: {
          value: value,
        },
        create: {
          userId: session.user.id,
          articleId,
          value,
        },
      });
    }

    return NextResponse.json(vote);
  } catch (error) {
    console.error("Failed to vote:", error);
    return new NextResponse("Failed to vote", { status: 500 });
  }
}