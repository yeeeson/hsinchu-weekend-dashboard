export type RestaurantRegion = "city" | "zhubei" | "zhudong" | "guanpu";
export type RestaurantCategory = "japanese" | "chinese" | "snack" | "late" | "hotpot" | "thai" | "indian";
export type RestaurantMeal = "lunch" | "dinner" | "late";
export type RestaurantPriceTier = "value" | "mid" | "premium";

export type Restaurant = {
  id: string;
  name: string;
  region: RestaurantRegion;
  regionLabel: string;
  tags: RestaurantCategory[];
  meals: RestaurantMeal[];
  budget: number;
  priceTier: RestaurantPriceTier;
  hours: string;
  address: string;
  signature: string;
  note: string;
  parking: string;
  reviewLabel?: string;
  reviewUrl?: string;
  isNearbyRecommendation?: boolean;
  nearbyForRegion?: RestaurantRegion;
  nearbyTravelLabel?: string;
  sourceLabel: string;
  sourceUrl: string;
  mapUrl: string;
};

export const restaurantRegions: { id: "all" | RestaurantRegion; label: string }[];
export const restaurantCategories: { id: "all" | RestaurantCategory; label: string }[];
export const restaurantMeals: { id: "all" | RestaurantMeal; label: string }[];
export const restaurantPriceTiers: { id: "all" | RestaurantPriceTier; label: string }[];
export const restaurantTagLabels: Record<RestaurantCategory, string>;
export const restaurants: Restaurant[];
export function filterRestaurants(
  catalog: Restaurant[],
  filters?: {
    region?: "all" | RestaurantRegion;
    category?: "all" | RestaurantCategory;
    meal?: "all" | RestaurantMeal;
    priceTier?: "all" | RestaurantPriceTier;
  },
): Restaurant[];
