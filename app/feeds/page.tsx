import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FeedList from "@/components/feed-list";
import OnboardingPrompt from "@/components/onboarding-prompt";

export default async function FeedsPage() {
  const session = await auth();

  if (!session?.user) {
    return <OnboardingPrompt />;
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