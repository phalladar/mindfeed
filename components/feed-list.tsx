"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import EditFeedDialog from "./edit-feed-dialog";

type Feed = {
  id: string;
  title: string;
  url: string;
  _count: {
    articles: number;
  };
};

export default function FeedList({ feeds }: { feeds: Feed[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);

  const handleDelete = async (feedId: string) => {
    try {
      const response = await fetch(`/api/feeds/${feedId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete feed");

      toast({
        title: "Feed deleted",
        description: "The feed has been removed from your list.",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete feed. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (feeds.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No feeds yet</h3>
        <p className="text-muted-foreground">Add some feeds to get started!</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Articles</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeds.map((feed) => (
            <TableRow key={feed.id}>
              <TableCell className="font-medium">{feed.title}</TableCell>
              <TableCell className="max-w-[300px] truncate">{feed.url}</TableCell>
              <TableCell className="text-right">
                {feed._count.articles}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingFeed(feed)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(feed.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditFeedDialog
        feed={editingFeed}
        onOpenChange={(open) => !open && setEditingFeed(null)}
      />
    </>
  );
} 