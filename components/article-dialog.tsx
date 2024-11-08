"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ExternalLink, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

type ArticleDialogProps = {
  article: any;
  trigger: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  userVote?: number;
  onVote?: (value: number) => void;
};

export default function ArticleDialog({
  article,
  trigger,
  onOpenChange,
  userVote = 0,
  onVote,
}: ArticleDialogProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVote, setCurrentVote] = useState(userVote);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [readStartTime, setReadStartTime] = useState<number | null>(null);
  const { ref: contentRef, inView } = useInView({
    threshold: [0, 0.25, 0.5, 0.75, 1.0],
  });

  useEffect(() => {
    setCurrentVote(userVote);
  }, [userVote]);

  const handleVote = async (value: number) => {
    if (!session) return;

    const previousVote = currentVote;
    const newVote = currentVote === value ? 0 : value;
    setCurrentVote(newVote);
    onVote?.(newVote);

    try {
      await Promise.all([
        fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleId: article.id,
            value: newVote,
          }),
        }),
        fetch("/api/article-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleId: article.id,
            interaction: "vote",
            value: newVote,
          }),
        }),
      ]);
    } catch (error) {
      setCurrentVote(previousVote);
      onVote?.(previousVote);
      console.error("Failed to vote:", error);
    }
  };

  useEffect(() => {
    async function fetchContent() {
      if (!article.url) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/article-content?url=${encodeURIComponent(article.url)}`);
        if (!response.ok) throw new Error("Failed to fetch article content");
        
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError("Failed to load article content. Please try opening in a new tab.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, [article.url]);

  // Track article view
  useEffect(() => {
    if (session?.user) {
      fetch("/api/article-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          interaction: "view",
          value: 1,
        }),
      });
    }
  }, [article.id, session?.user]);

  // Track reading time
  useEffect(() => {
    if (inView && !readStartTime) {
      setReadStartTime(Date.now());
    } else if (!inView && readStartTime && session?.user) {
      const duration = Math.floor((Date.now() - readStartTime) / 1000);
      fetch("/api/article-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          interaction: "readTime",
          value: duration,
        }),
      });
      setReadStartTime(null);
    }
  }, [inView, readStartTime, article.id, session?.user]);

  // Track scroll percentage
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const newScrollPercentage = Math.round(
      (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100
    );
    
    if (
      newScrollPercentage > scrollPercentage &&
      session?.user &&
      newScrollPercentage % 25 === 0 // Only track at 25% intervals
    ) {
      setScrollPercentage(newScrollPercentage);
      fetch("/api/article-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          interaction: "scroll",
          value: 25, // Track each 25% increment
        }),
      });
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-start gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex flex-col items-center -space-y-3 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 -mt-1 hover:bg-transparent focus-visible:ring-0",
                    currentVote === 1 
                      ? "text-green-500 hover:text-green-500" 
                      : "text-muted-foreground hover:text-muted-foreground"
                  )}
                  onClick={() => handleVote(1)}
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
                  onClick={() => handleVote(-1)}
                  disabled={!session}
                >
                  <ArrowDown className="h-5 w-5 fill-current" />
                </Button>
              </div>
              <div>
                {article.title}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="align-middle inline-block h-8 w-8 relative -left-[-6px] -top-[-6px]" 
                  asChild
                >
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div 
          className="flex-1 overflow-y-auto px-6 pb-6"
          onScroll={handleScroll}
        >
          <div 
            ref={contentRef}
            className="prose prose-sm dark:prose-invert max-w-none"
          >
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {error && (
              <div className="text-destructive text-center py-4">
                {error}
              </div>
            )}
            {content && (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}