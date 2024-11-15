import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FeedList from "@/components/feed-list";

export default async function FeedsPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Not authorized</h3>
        <p className="text-muted-foreground">Please sign in to view your feeds.</p>
      </div>
    );
  }

  const feeds = await prisma.feed.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Feeds</h1>
      <FeedList feeds={feeds} />
    </div>
  );
} 