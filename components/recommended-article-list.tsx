'use client';

import { useEffect, useState } from 'react';
import ArticleCard from "./article-card";
import { useRecommendationSettings } from "@/lib/stores/recommendation-settings";

export default function RecommendedArticleList({ initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);
  const { includeExternalFeeds, sortOrder } = useRecommendationSettings();

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(
          `/api/recommended?includeExternal=${includeExternalFeeds}&sortOrder=${sortOrder}`
        );
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        if (data) {
          setArticles(data);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
    
    fetchArticles();
  }, [includeExternalFeeds, sortOrder]);

  if (!articles?.length) {
    return (
      <div className="text-center py-6">
        <h3 className="text-lg font-semibold">No recommendations found</h3>
        <p className="text-muted-foreground">
          Try adjusting your feed settings or interact with more articles.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          userVote={article.votes[0]?.value}
        />
      ))}
    </div>
  );
} 