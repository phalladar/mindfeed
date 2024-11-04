export interface Article {
  title: string;
  content: string;
}

export const TOPIC_KEYWORDS: Record<string, string[]> = {
  'technology': [
    'tech', 'software', 'hardware', 'programming', 'digital', 'ai', 'blockchain',
    'crypto', 'cybersecurity', 'data', 'cloud', 'mobile', 'app', 'startup',
    'innovation', 'web', 'code', 'developer', 'computer', 'algorithm', 'machine learning'
  ],
  'artificial_intelligence': [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 
    'neural network', 'llm', 'large language model', 'transformer', 'gpt',
    'computer vision', 'nlp', 'natural language', 'inference', 'training',
    'model', 'dataset', 'cuda', 'gpu', 'tensor', 'nvidia'
  ],
  'science': [
    'research', 'study', 'scientific', 'discovery', 'experiment', 'physics',
    'biology', 'chemistry', 'astronomy', 'space', 'climate', 'medicine',
    'neuroscience', 'quantum', 'evolution', 'genetics', 'laboratory'
  ],
  'business': [
    'market', 'company', 'startup', 'finance', 'economy', 'investment',
    'stock', 'trade', 'entrepreneur', 'industry', 'revenue', 'profit',
    'corporate', 'management', 'strategy', 'venture', 'acquisition'
  ],
  'legal': [
    'law', 'legal', 'attorney', 'lawyer', 'court', 'litigation', 'judge',
    'judicial', 'statute', 'regulation', 'compliance', 'contract', 'plaintiff',
    'defendant', 'counsel', 'precedent', 'jurisdiction', 'tort', 'liability',
    'patent', 'trademark', 'copyright', 'intellectual property', 'prosecution',
    'defense', 'appellate', 'supreme court', 'constitutional', 'civil rights',
    'criminal', 'corporate law', 'tax law', 'regulatory', 'arbitration',
    'mediation', 'settlement', 'brief', 'motion', 'hearing', 'trial'
  ],
  'politics': [
    'government', 'policy', 'election', 'political', 'democracy', 'congress',
    'senate', 'legislation', 'law', 'regulation', 'vote', 'campaign',
    'diplomatic', 'foreign', 'domestic', 'reform', 'administration'
  ],
  'culture': [
    'art', 'music', 'film', 'movie', 'entertainment', 'culture', 'book',
    'literature', 'fashion', 'design', 'theater', 'festival', 'exhibition',
    'performance', 'creative', 'media', 'celebrity'
  ],
  'health': [
    'health', 'medical', 'wellness', 'fitness', 'nutrition', 'diet',
    'mental health', 'healthcare', 'disease', 'treatment', 'therapy',
    'prevention', 'medicine', 'vaccine', 'research', 'clinical'
  ],
  'sports': [
    'sports', 'game', 'team', 'player', 'competition', 'tournament',
    'championship', 'athlete', 'football', 'basketball', 'baseball',
    'soccer', 'olympic', 'fitness', 'league', 'match', 'score'
  ],
  'environment': [
    'environment', 'climate', 'sustainability', 'renewable', 'energy',
    'green', 'conservation', 'pollution', 'recycling', 'ecosystem',
    'biodiversity', 'carbon', 'environmental', 'sustainable'
  ],
  'education': [
    'education', 'learning', 'teaching', 'student', 'school', 'university',
    'academic', 'research', 'study', 'training', 'skill', 'knowledge',
    'course', 'curriculum', 'teacher', 'professor', 'classroom'
  ],
  'gaming': [
    'game', 'gaming', 'esports', 'playstation', 'xbox', 'nintendo',
    'console', 'multiplayer', 'gameplay', 'streamer', 'twitch',
    'videogame', 'gamer', 'steam', 'rpg', 'fps', 'mmo'
  ]
};

export async function extractTopics(article: Article): Promise<string[]> {
  const text = `${article.title} ${article.content}`.toLowerCase();
  const words = text.split(/\W+/);
  
  const topicMatches = new Map<string, number>();
  const minMatchesRequired = 2; // Require at least 2 matches for a topic
  const maxTopics = 3; // Maximum number of topics per article
  
  // Title matches are worth more (x2)
  const titleWords = article.title.toLowerCase().split(/\W+/);
  
  // Check for multi-word matches first
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    keywords.forEach(keyword => {
      if (keyword.includes(' ')) {
        // Check title for phrase (worth more)
        if (article.title.toLowerCase().includes(keyword)) {
          topicMatches.set(topic, (topicMatches.get(topic) || 0) + 4);
        }
        // Check content for phrase
        if (article.content.toLowerCase().includes(keyword)) {
          topicMatches.set(topic, (topicMatches.get(topic) || 0) + 2);
        }
      }
    });
  }
  
  // Then check individual words
  const processWord = (word: string, isTitle: boolean) => {
    if (word.length < 3) return; // Skip very short words
    
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      for (const keyword of keywords) {
        if (keyword.includes(' ')) continue; // Skip phrases
        
        // Exact matches are worth more
        if (word === keyword) {
          topicMatches.set(
            topic, 
            (topicMatches.get(topic) || 0) + (isTitle ? 2 : 1)
          );
          break;
        }
        
        // Partial matches only for longer words and must be substantial overlap
        if (word.length >= 6 && keyword.length >= 6) {
          if (word.includes(keyword) || keyword.includes(word)) {
            const overlapRatio = Math.min(word.length, keyword.length) / 
                               Math.max(word.length, keyword.length);
            if (overlapRatio > 0.8) { // Must be very similar
              topicMatches.set(
                topic,
                (topicMatches.get(topic) || 0) + (isTitle ? 1 : 0.5)
              );
              break;
            }
          }
        }
      }
    }
  };
  
  // Process title words (worth more)
  titleWords.forEach(word => processWord(word, true));
  
  // Process content words
  words.forEach(word => processWord(word, false));
  
  // Return only topics with enough strong matches
  return Array.from(topicMatches.entries())
    .filter(([_, count]) => count >= minMatchesRequired)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTopics)
    .map(([topic]) => topic);
} 