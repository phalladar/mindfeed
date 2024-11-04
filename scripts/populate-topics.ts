const { PrismaClient } = require('@prisma/client');
const { extractTopics } = require('../lib/topic-extractor');

const prisma = new PrismaClient();

interface Article {
  id: string;
  title: string;
  content: string;
}

interface Topic {
  id: string;
  name: string;
}

async function populateTopics() {
  try {
    // Get all articles
    const articles = await prisma.article.findMany();
    console.log(`Found ${articles.length} articles to process`);

    for (const article of articles) {
      try {
        // Extract topics
        const topics: string[] = await extractTopics(article);
        console.log(`Found topics for "${article.title}":`, topics);
        
        // Create or connect topics
        const topicConnections = await Promise.all(
          topics.map(async (topicName: string) => {
            const topic = await prisma.topic.upsert({
              where: { name: topicName },
              create: { name: topicName },
              update: {},
            });
            return topic;
          })
        );

        // Connect topics to article
        await prisma.article.update({
          where: { id: article.id },
          data: {
            topics: {
              connect: topicConnections.map((topic: Topic) => ({ id: topic.id })),
            },
          },
        });
        
        console.log(`✓ Processed article: ${article.title}`);
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
      }
    }

    console.log('\nTopic population completed!');
  } catch (error) {
    console.error('Failed to populate topics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateTopics();