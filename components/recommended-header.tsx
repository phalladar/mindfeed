'use client';

import { Sparkles, Settings2 } from "lucide-react";
import { useRecommendationSettings } from "@/lib/stores/recommendation-settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function RecommendedHeader() {
  const { 
    includeExternalFeeds, 
    toggleExternalFeeds,
    sortOrder,
    setSortOrder
  } = useRecommendationSettings();

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Sparkles className="h-6 w-6" />
        Recommended For You
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Feed Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Feed Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={includeExternalFeeds}
            onCheckedChange={toggleExternalFeeds}
          >
            Include external feeds
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
          <DropdownMenuRadioGroup 
            value={sortOrder} 
            onValueChange={(value) => setSortOrder(value as 'recommended' | 'date')}
          >
            <DropdownMenuRadioItem value="recommended">
              Highest Recommended
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">
              Most Recent
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 