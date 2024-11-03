"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Home, Star, Rss } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Popular", href: "/popular", icon: Star },
    ...(session
      ? [
          { name: "My Feeds", href: "/feeds", icon: Rss },
        ]
      : []),
  ];

  return (
    <div className="hidden w-[200px] flex-col md:flex">
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}