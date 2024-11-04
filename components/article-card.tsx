"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import ArticleDialog from "./article-dialog";

type ArticleCardProps = {
  article: any;
  userVote?: number;
};

export default function ArticleCard({ article, userVote = 0 }: ArticleCardProps) {
  const { data: session } = useSession();
  const [currentVote, setCurrentVote] = useState(userVote);
  const [isReading, setIsReading] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    setCurrentVote(userVote);
  }, [userVote]);

  useEffect(() => {
    if (isReading && !readingStartTime) {
      setReadingStartTime(Date.now());
    } else if (!isReading && readingStartTime) {
      const duration = Math.floor((Date.now() - readingStartTime) / 1000);
      if (duration > 5 && session?.user) {
        fetch("/api/reading-time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleId: article.id,
            duration,
          }),
        });
      }
      setReadingStartTime(null);
    }
  }, [isReading, readingStartTime, article.id, session?.user]);

  const handleVote = async (value: number) => {
    if (!session) return;

    const previousVote = currentVote;
    const newVote = currentVote === value ? 0 : value;
    setCurrentVote(newVote);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          value: newVote,
        }),
      });

      if (!response.ok) {
        setCurrentVote(previousVote);
      }
    } catch (error) {
      setCurrentVote(previousVote);
      console.error("Failed to vote:", error);
    }
  };

  const handleVoteChange = (newVote: number) => {
    setCurrentVote(newVote);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="flex flex-col items-center -space-y-3">
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 -mt-1 hover:bg-transparent focus-visible:ring-0",
              currentVote === 1 
                ? "text-green-500 hover:text-green-500" 
                : "text-muted-foreground hover:text-muted-foreground"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVote(1);
            }}
            disabled={!session}
          >
            <ArrowUp className="h-5 w-5 fill-current" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 hover:bg-transparent focus-visible:ring-0",
              currentVote === -1 
                ? "text-red-500 hover:text-red-500" 
                : "text-muted-foreground hover:text-muted-foreground"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVote(-1);
            }}
            disabled={!session}
          >
            <ArrowDown className="h-5 w-5 fill-current" />
          </Button>
        </div>
        <ArticleDialog
          article={article}
          onOpenChange={setIsReading}
          userVote={currentVote}
          onVote={handleVoteChange}
          trigger={
            <div className="flex-1 cursor-pointer">
              <h3 className="font-semibold hover:text-blue-500">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Posted by {article.feed.title}{" "}
                {formatDistanceToNow(new Date(article.publishedAt))} ago
              </p>
              <CardContent className="px-0">
                <p className="text-sm line-clamp-3">{article.content}</p>
              </CardContent>
            </div>
          }
        />
      </CardHeader>
    </Card>
  );
}