export type RestaurantRegion = "city" | "zhubei" | "zhudong";
export type RestaurantCategory = "japanese" | "chinese" | "snack" | "late" | "hotpot";
export type RestaurantMeal = "lunch" | "dinner" | "late";

export type Restaurant = {
  id: string;
  name: string;
  region: RestaurantRegion;
  regionLabel: string;
  tags: RestaurantCategory[];
  meals: RestaurantMeal[];
  budget: number;
  hours: string;
  address: string;
  signature: string;
  note: string;
  parking: string;
  sourceLabel: string;
  sourceUrl: string;
  mapUrl: string;
};

export const restaurantRegions: { id: "all" | RestaurantRegion; label: string }[];
export const restaurantCategories: { id: "all" | RestaurantCategory; label: string }[];
export const restaurantMeals: { id: "all" | RestaurantMeal; label: string }[];
export const restaurantTagLabels: Record<RestaurantCategory, string>;
export const restaurants: Restaurant[];
export function filterRestaurants(
  catalog: Restaurant[],
  filters?: {
    region?: "all" | RestaurantRegion;
    category?: "all" | RestaurantCategory;
    meal?: "all" | RestaurantMeal;
    budget?: number;
  },
): Restaurant[];
