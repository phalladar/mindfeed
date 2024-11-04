import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { extractTopics } from '../lib/topic-extractor.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function populateTopics() {
  try {
    const articles = await prisma.article.findMany();
    console.log(`Found ${articles.length} articles to process`);

    for (const article of articles) {
      try {
        const topics = await extractTopics(article);
        console.log(`Found topics for "${article.title}":`, topics);
        
        const topicConnections = await Promise.all(
          topics.map(async (topicName) => {
            const topic = await prisma.topic.upsert({
              where: { name: topicName },
              create: { name: topicName },
              update: {},
            });
            return topic;
          })
        );

        await prisma.article.update({
          where: { id: article.id },
          data: {
            topics: {
              connect: topicConnections.map(topic => ({ id: topic.id })),
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