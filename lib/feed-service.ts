import { PrismaClient } from '@prisma/client';
import { extractTopics } from '../lib/topic-extractor';

const prisma = new PrismaClient();

export async function createFeedArticle(articleData: any) {
  const topics = await extractTopics(articleData);
  
  // Create or get topics
  const topicConnections = await Promise.all(
    topics.map(async (topicName) => {
      const topic = await prisma.topic.upsert({
        where: { name: topicName },
        create: { name: topicName },
        update: {},
      });
      return { id: topic.id };
    })
  );

  // Create article with topics
  return prisma.article.create({
    data: {
      ...articleData,
      topics: {
        connect: topicConnections,
      },
    },
  });
} 