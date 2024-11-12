import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, url } = await req.json();

    // Verify ownership
    const feed = await prisma.feed.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!feed || feed.userId !== session.user.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    const updatedFeed = await prisma.feed.update({
      where: { id: params.id },
      data: { title, url },
    });

    return NextResponse.json(updatedFeed);
  } catch (error) {
    console.error("Failed to update feed:", error);
    return new NextResponse("Failed to update feed", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Verify ownership
    const feed = await prisma.feed.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!feed || feed.userId !== session.user.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    await prisma.feed.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete feed:", error);
    return new NextResponse("Failed to delete feed", { status: 500 });
  }
} 