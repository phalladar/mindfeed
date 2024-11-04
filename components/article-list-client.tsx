"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import ArticleCard from "./article-card";
import { Loader2 } from "lucide-react";

type Article = {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  feed: {
    id: string;
    title: string;
  };
  votes: Array<{ value: number }>;
};

type ArticlesResponse = {
  articles: Article[];
  nextCursor: string | null;
  hasMore: boolean;
};

export default function ArticleListClient({
  initialArticles,
}: {
  initialArticles: Article[];
}) {
  const [cursor, setCursor] = useState<string | null>(
    initialArticles.length > 0 ? initialArticles[initialArticles.length - 1].id : null
  );
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);

  const loadedArticleIds = useRef(new Set(initialArticles.map(article => article.id)));

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    async function loadMoreArticles() {
      if (!hasMore || isLoading || loadingRef.current || !inView || !cursor) {
        return;
      }

      try {
        loadingRef.current = true;
        setIsLoading(true);
        
        const url = new URL("/api/articles", window.location.origin);
        url.searchParams.set("cursor", cursor);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data: ArticlesResponse = await response.json();
        
        if (data.articles.length === 0) {
          setHasMore(false);
          return;
        }

        const newArticles = data.articles.filter(
          article => !loadedArticleIds.current.has(article.id)
        );

        newArticles.forEach(article => loadedArticleIds.current.add(article.id));

        if (newArticles.length === 0) {
          setHasMore(false);
          return;
        }

        setArticles(prev => [...prev, ...newArticles]);
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error loading more articles:", error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    }

    loadMoreArticles();
  }, [inView, cursor, hasMore, isLoading]);

  return (
    <div className="space-y-1">
      <div className="grid gap-2">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            userVote={article.votes[0]?.value}
          />
        ))}
      </div>
      
      {/* Loading indicator and end message */}
      <div 
        ref={ref} 
        className={`flex items-center justify-center ${hasMore ? 'h-4' : 'h-auto'}`}
      >
        {isLoading && hasMore && (
          <div className="flex items-center gap-2 text-muted-foreground py-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading more articles...</span>
          </div>
        )}
        {!hasMore && articles.length > 0 && (
          <div className="flex items-center gap-2 py-1 text-muted-foreground">
            <div className="h-px w-8 bg-border" />
            <p className="text-sm">End of feed</p>
            <div className="h-px w-8 bg-border" />
          </div>
        )}
      </div>
    </div>
  );
} 