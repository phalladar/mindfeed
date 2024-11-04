import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SortOrder = 'recommended' | 'date';

interface RecommendationSettings {
  includeExternalFeeds: boolean;
  sortOrder: SortOrder;
  toggleExternalFeeds: () => void;
  setSortOrder: (order: SortOrder) => void;
}

export const useRecommendationSettings = create<RecommendationSettings>()(
  persist(
    (set) => ({
      includeExternalFeeds: false,
      sortOrder: 'recommended',
      toggleExternalFeeds: () => set((state) => ({ 
        includeExternalFeeds: !state.includeExternalFeeds 
      })),
      setSortOrder: (order) => set({ sortOrder: order }),
    }),
    {
      name: 'recommendation-settings',
    }
  )
); 