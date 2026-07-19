import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { filterRoutes, routeCost } from "../lib/route-planner.mjs";

const fixtureRoutes = [
  {
    id: "free-half-day",
    costs: { ticket: 0, food: 300, activity: 0, public: 30, car: 180, scooter: 60 },
    weather: ["sunny", "rain"],
    pace: "half",
  },
  {
    id: "sunny-full-day",
    costs: { ticket: 480, food: 280, activity: 0, public: 100, car: 300, scooter: 140 },
    weather: ["sunny"],
    pace: "full",
  },
];

test("routeCost keeps public fares per person and shares vehicle costs", () => {
  assert.equal(routeCost(fixtureRoutes[0], "public", 2), 330);
  assert.equal(routeCost(fixtureRoutes[0], "car", 2), 390);
  assert.equal(routeCost(fixtureRoutes[0], "scooter", 3), 320);
  assert.throws(() => routeCost(fixtureRoutes[0], "car", 0), RangeError);
});

test("filterRoutes applies budget, weather, and pace as one shared rule", () => {
  assert.deepEqual(
    filterRoutes(fixtureRoutes, {
      transport: "public",
      budget: 500,
      weather: "rain",
      pace: "half",
      travelers: 2,
    }).map((route) => route.id),
    ["free-half-day"],
  );

  assert.deepEqual(
    filterRoutes(fixtureRoutes, {
      transport: "public",
      budget: 1000,
      weather: "any",
      pace: "any",
      travelers: 2,
    }).map((route) => route.id),
    ["free-half-day", "sunny-full-day"],
  );
});

test("dashboard route data and both route views stay in sync", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const routeData = page.slice(page.indexOf("const routes:"), page.indexOf("const transportLabels"));
  const ids = [...routeData.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((match) => match[1]);
  const numbers = [...routeData.matchAll(/^\s{4}number:\s*"(\d+)"/gm)].map((match) => Number(match[1]));
  const stopCount = [...routeData.matchAll(/\{\s*time:\s*"/g)].length;
  const hoursCount = [...routeData.matchAll(/\bhours:\s*"/g)].length;
  const costs = [...routeData.matchAll(
    /costs:\s*\{\s*ticket:\s*(\d+),\s*food:\s*(\d+),\s*activity:\s*(\d+),\s*public:\s*(\d+),\s*car:\s*(\d+),\s*scooter:\s*(\d+)\s*\}/g,
  )];

  assert.ok(ids.length >= 10, "expected the full Hsinchu route catalog");
  assert.equal(new Set(ids).size, ids.length, "route ids must be unique");
  assert.deepEqual(numbers, Array.from({ length: ids.length }, (_, index) => index + 1));
  assert.equal(stopCount, hoursCount, "every stop must include opening-hours information");
  assert.equal(costs.length, ids.length, "every route must include a complete cost record");

  for (const [index, cost] of costs.entries()) {
    const [, ticket, food, activity, publicFare] = cost.map(Number);
    assert.ok(
      ticket + food + activity + publicFare <= 1000,
      `route ${numbers[index]} exceeds the default NT$1,000 budget`,
    );
  }

  assert.match(page, /const \[budget, setBudget\] = useState\(1000\)/);
  assert.equal((page.match(/\{filtered\.map\(/g) ?? []).length, 2, "map and cards must both render filtered routes");
  assert.doesNotMatch(page, /\{routes\.map\(/, "no route view may bypass the shared filter");
  assert.match(page, /filtered\.find\(\(route\) => route\.id === selectedId\) \?\? filtered\[0\]/);

  for (const number of numbers) {
    assert.match(css, new RegExp(`\\.node-${number}\\s*\\{`), `missing map position for route ${number}`);
  }
});
