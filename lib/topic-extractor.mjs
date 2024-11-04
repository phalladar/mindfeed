const TOPIC_KEYWORDS = {
  'technology': [
    'tech', 'software', 'hardware', 'programming', 'digital', 'ai', 'blockchain',
    'crypto', 'cybersecurity', 'data', 'cloud', 'mobile', 'app', 'startup',
    'innovation', 'web', 'code', 'developer', 'computer', 'algorithm', 'machine learning'
  ],
  // ... rest of the topics stay the same ...
};

async function extractTopics(article) {
  const text = `${article.title} ${article.content}`.toLowerCase();
  const words = text.split(/\W+/);
  
  const topicMatches = new Map();
  
  words.forEach(word => {
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      if (keywords.some(keyword => 
        word.includes(keyword) || keyword.includes(word)
      )) {
        topicMatches.set(topic, (topicMatches.get(topic) || 0) + 1);
      }
    }
  });
  
  return Array.from(topicMatches.entries())
    .filter(([_, count]) => count > 0)
    .map(([topic]) => topic);
}

export { extractTopics, TOPIC_KEYWORDS }; 