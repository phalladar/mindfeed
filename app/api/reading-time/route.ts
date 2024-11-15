import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { articleId, duration } = await req.json();

    const readingTime = await prisma.readingTime.create({
      data: {
        userId: session.user.id,
        articleId,
        duration,
      },
    });

    return NextResponse.json(readingTime);
  } catch (error) {
    console.error("Failed to record reading time:", error);
    return new NextResponse("Failed to record reading time", { status: 500 });
  }
}