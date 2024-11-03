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
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          userVote={article.votes[0]?.value}
        />
      ))}
      
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isLoading && hasMore && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
        {!hasMore && articles.length > 0 && (
          <p className="text-sm text-muted-foreground">No more articles to load</p>
        )}
      </div>
    </div>
  );
} 