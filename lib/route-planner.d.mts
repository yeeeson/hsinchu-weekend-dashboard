export type PlannerTransport = "public" | "car" | "scooter";

export type PlannerRoute = {
  costs: {
    ticket: number;
    food: number;
    activity: number;
    public: number;
    car: number;
    scooter: number;
  };
  weather: string[];
  pace: string;
};

export type RouteFilters = {
  transport: PlannerTransport;
  budget: number;
  weather: string;
  pace: string;
  travelers: number;
};

export function routeCost(
  route: PlannerRoute,
  transport: PlannerTransport,
  travelers: number,
): number;

export function filterRoutes<T extends PlannerRoute>(
  routes: readonly T[],
  filters: RouteFilters,
): T[];
