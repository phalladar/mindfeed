import { prisma } from './prisma';

interface Topic {
  id: string;
  name: string;
}

interface ArticleWithTopics {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  feed: {
    id: string;
    title: string;
  };
  topics: Topic[];
  votes: Array<{ value: number }>;
}

interface TopicPreference {
  name: string;
  score: number;
}

interface FeedPreference {
  feedId: string;
  score: number;
}

// Recommendation tuning parameters
const RECOMMENDATION_SETTINGS = {
  TOPIC_WEIGHT: 0.6,        // How much topic matching matters
  FEED_WEIGHT: 0.2,         // How much feed source matters
  RECENCY_WEIGHT: 0.2,      // How much article freshness matters
  MIN_SCORE: 0.2,           // Minimum score to be recommended
  UPVOTE_STRENGTH: 1,       // How strongly upvotes affect preferences
  DOWNVOTE_STRENGTH: -2,    // How strongly downvotes affect preferences (negative)
  DAYS_LOOKBACK: 30,        // How far back to look for articles
};

export async function getRecommendedArticles(
  userId: string, 
  includeExternalFeeds: boolean = false,
  sortOrder: 'recommended' | 'date' = 'recommended'
) {
  const ARTICLES_PER_PAGE = 10;

  try {
    // Get all user votes to understand preferences
    console.log('\n=== USER PREFERENCES ===');
    const userVotes = await prisma.vote.findMany({
      where: { userId },
      include: {
        article: {
          include: {
            topics: true,
            feed: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    console.log('\nUpvoted Articles:');
    userVotes
      .filter(vote => vote.value === 1)
      .forEach(vote => {
        console.log(`- "${vote.article.title}"`);
        console.log(`  Feed: ${vote.article.feed.title}`);
        console.log(`  Topics: ${vote.article.topics.map(t => t.name).join(', ')}`);
      });

    console.log('\nDownvoted Articles:');
    userVotes
      .filter(vote => vote.value === -1)
      .forEach(vote => {
        console.log(`- "${vote.article.title}"`);
        console.log(`  Feed: ${vote.article.feed.title}`);
        console.log(`  Topics: ${vote.article.topics.map(t => t.name).join(', ')}`);
      });

    // Calculate preferences
    const topicPreferences = new Map<string, number>();
    const feedPreferences = new Map<string, number>();

    userVotes.forEach(vote => {
      const weight = vote.value === 1 ? 
        RECOMMENDATION_SETTINGS.UPVOTE_STRENGTH : 
        RECOMMENDATION_SETTINGS.DOWNVOTE_STRENGTH;

      vote.article.topics.forEach(topic => {
        const currentScore = topicPreferences.get(topic.name) || 0;
        topicPreferences.set(topic.name, currentScore + weight);
      });

      const currentFeedScore = feedPreferences.get(vote.article.feed.id) || 0;
      feedPreferences.set(vote.article.feed.id, currentFeedScore + weight);
    });

    console.log('\nTopic Preferences:');
    Array.from(topicPreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([topic, score]) => {
        console.log(`${topic}: ${score}`);
      });

    console.log('\nFeed Preferences:');
    Array.from(feedPreferences.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([feedId, score]) => {
        const feed = userVotes.find(v => v.article.feed.id === feedId)?.article.feed;
        console.log(`${feed?.title}: ${score}`);
      });

    // Get candidate articles
    const candidateArticles = await prisma.article.findMany({
      where: {
        ...(includeExternalFeeds ? {} : {
          feed: {
            userId,
          },
        }),
        publishedAt: {
          gte: new Date(Date.now() - RECOMMENDATION_SETTINGS.DAYS_LOOKBACK * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        feed: true,
        topics: true,
        votes: {
          where: {
            userId,
          },
        },
      },
      take: ARTICLES_PER_PAGE * 3,
    }) as ArticleWithTopics[];

    // Score all articles regardless of sort order
    console.log('\n=== SCORING ARTICLES ===');
    const scoredArticles = candidateArticles.map(article => {
      // Calculate topic score (-1 to 1 range)
      const topicScores = article.topics.map(topic => 
        topicPreferences.get(topic.name) || 0
      );
      const topicScore = topicScores.length > 0 ?
        topicScores.reduce((a, b) => a + b, 0) / topicScores.length :
        0;
      const normalizedTopicScore = Math.tanh(topicScore);

      // Calculate feed score (-1 to 1 range)
      const feedScore = Math.tanh(feedPreferences.get(article.feed.id) || 0);

      // Calculate recency score (0 to 1 range)
      const ageInDays = (Date.now() - new Date(article.publishedAt).getTime()) 
        / (1000 * 60 * 60 * 24);
      const recencyScore = 1 - (ageInDays / RECOMMENDATION_SETTINGS.DAYS_LOOKBACK);

      // Combine scores with weights
      const finalScore = (
        normalizedTopicScore * RECOMMENDATION_SETTINGS.TOPIC_WEIGHT +
        feedScore * RECOMMENDATION_SETTINGS.FEED_WEIGHT +
        recencyScore * RECOMMENDATION_SETTINGS.RECENCY_WEIGHT
      );

      console.log(`\nArticle: "${article.title}"`);
      console.log(`Feed: ${article.feed.title}`);
      console.log(`Topics: ${article.topics.map(t => t.name).join(', ')}`);
      console.log('Scores:', {
        topicScore: normalizedTopicScore.toFixed(3),
        feedScore: feedScore.toFixed(3),
        recencyScore: recencyScore.toFixed(3),
        finalScore: finalScore.toFixed(3),
      });

      return { 
        article, 
        score: finalScore,
        publishedAt: article.publishedAt 
      };
    });

    // Filter by minimum score first
    const recommendedArticles = scoredArticles
      .filter(item => item.score >= RECOMMENDATION_SETTINGS.MIN_SCORE);

    // Then sort based on selected order
    const sortedArticles = sortOrder === 'recommended'
      ? recommendedArticles.sort((a, b) => b.score - a.score)
      : recommendedArticles.sort((a, b) => 
          new Date(b.article.publishedAt).getTime() - 
          new Date(a.article.publishedAt).getTime()
        );

    // Finally take the top N articles
    return sortedArticles
      .slice(0, ARTICLES_PER_PAGE)
      .map(item => item.article);

  } catch (error) {
    console.error('Error fetching recommended articles:', error);
    return null;
  }
} 