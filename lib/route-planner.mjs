export function routeCost(route, transport, travelers) {
  if (!Number.isInteger(travelers) || travelers < 1) {
    throw new RangeError("travelers must be a positive integer");
  }

  const shared = transport === "public"
    ? route.costs.public
    : Math.ceil(route.costs[transport] / travelers);

  return route.costs.ticket + route.costs.food + route.costs.activity + shared;
}

export function filterRoutes(routes, { transport, budget, weather, pace, travelers }) {
  return routes.filter((route) => {
    const withinBudget = routeCost(route, transport, travelers) <= budget;
    const weatherMatch = weather === "any" || route.weather.includes(weather);
    const paceMatch = pace === "any" || route.pace === pace;
    return withinBudget && weatherMatch && paceMatch;
  });
}
