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