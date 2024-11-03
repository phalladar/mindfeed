import { NextResponse } from "next/server";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("URL is required", { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const dom = new JSDOM(html);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    return NextResponse.json({
      title: article?.title,
      content: article?.content,
      textContent: article?.textContent,
      length: article?.length,
      excerpt: article?.excerpt,
    });
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return new NextResponse("Failed to fetch article content", { status: 500 });
  }
} 