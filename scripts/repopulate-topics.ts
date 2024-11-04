import { PrismaClient } from '@prisma/client';
import { extractTopics } from '../lib/topic-extractor';

const prisma = new PrismaClient();

async function repopulateTopics() {
  try {
    // Get all articles
    const articles = await prisma.article.findMany();
    console.log(`Found ${articles.length} articles to process`);

    for (const article of articles) {
      try {
        // Extract topics
        const topics = await extractTopics(article);
        console.log(`Found topics for "${article.title}":`, topics);
        
        // First remove existing topics
        await prisma.article.update({
          where: { id: article.id },
          data: {
            topics: {
              set: [], // Clear existing topics
            },
          },
        });

        // Then add new topics
        if (topics.length > 0) {
          await prisma.article.update({
            where: { id: article.id },
            data: {
              topics: {
                connectOrCreate: topics.map(name => ({
                  where: { name },
                  create: { name },
                })),
              },
            },
          });
        }
        
        console.log(`✓ Processed article: ${article.title}`);
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
      }
    }

    console.log('\nTopic repopulation completed!');
  } catch (error) {
    console.error('Failed to repopulate topics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

repopulateTopics(); 