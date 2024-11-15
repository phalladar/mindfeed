import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRecommendedArticles } from "@/lib/article-service";

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const includeExternal = searchParams.get("includeExternal") === "true";
  const sortOrder = searchParams.get("sortOrder") as "recommended" | "date";

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const articles = await getRecommendedArticles(
      session.user.id, 
      includeExternal,
      sortOrder
    );
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return new NextResponse("Failed to fetch recommendations", { status: 500 });
  }
} 