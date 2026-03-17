import { GrowGuideInput, CropRecommendation } from '@/types';
import { mockCropRecommendations } from '@/data/mock-data'; // We will replace this with DB data in next step

export class GrowGuideService {
  /**
   * Calculates a match score for crops based on user input.
   * Deterministic scoring algorithm:
   * - Space match: +3 points
   * - Sunlight match: +2 points
   * - Difficulty match: +1 point (filtering is strict, scoring is bonus)
   */
  async getRecommendations(input: GrowGuideInput): Promise<CropRecommendation[]> {
    // In Phase 3, fetch base crops from MongoDB. For now, use mock data as "database".
    const allCrops = mockCropRecommendations;

    const { growingSpace, sunlight, maintenancePreference } = input;

    // Strict Filtering Logic
    const difficultyMap: Record<string, ('easy' | 'medium' | 'hard')[]> = {
      low: ['easy'],
      medium: ['easy', 'medium'],
      high: ['easy', 'medium', 'hard'],
    };
    const allowedDifficulties = difficultyMap[maintenancePreference];

    const filtered = allCrops.filter((crop) => {
      // Space logic: Large space can grow small crops, but small space cannot grow large crops
      const spaceHierarchy = { small: 1, medium: 2, large: 3 };
      const spaceMatch = spaceHierarchy[growingSpace] >= spaceHierarchy[crop.space];
      
      // Sunlight logic: Full sun input allows partial crops (sometimes), but Shade input strictly limits
      // Simplifying for deterministic behavior:
      const sunlightMatch = crop.sunlight === sunlight ||
        (sunlight === 'full' && crop.sunlight === 'partial'); // Full sun spots can usually accommodate partial shade crops
      
      const difficultyMatch = allowedDifficulties.includes(crop.difficulty);

      return spaceMatch && difficultyMatch; // Sunlight is a soft filter in scoring, hard filter here if strict
    });

    // Scoring Logic
    const scored = filtered.map(crop => {
      let score = 0;
      if (crop.space === growingSpace) score += 3;
      if (crop.sunlight === sunlight) score += 2;
      score += crop.rating; // Use existing rating as a base popularity score
      
      return { ...crop, matchScore: score };
    });

    // Sort by score descending
    return scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}
