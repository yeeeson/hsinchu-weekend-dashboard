import assert from "node:assert/strict";
import test from "node:test";
import {
  filterRestaurants,
  restaurantCategories,
  restaurantRegions,
  restaurants,
} from "../lib/restaurant-planner.mjs";

test("restaurant catalog keeps all three areas aligned at five entries each", () => {
  assert.equal(restaurants.length, 15);
  assert.deepEqual(
    Object.fromEntries(restaurantRegions.slice(1).map(({ id }) => [id, restaurants.filter((item) => item.region === id).length])),
    { city: 5, zhubei: 5, zhudong: 5 },
  );
  assert.equal(new Set(restaurants.map(({ id }) => id)).size, restaurants.length, "restaurant ids must be unique");
});

test("every restaurant card has decision, transport, source, and map fields", () => {
  for (const restaurant of restaurants) {
    for (const field of ["name", "regionLabel", "hours", "address", "signature", "note", "parking", "sourceLabel"]) {
      assert.ok(restaurant[field], `${restaurant.id} is missing ${field}`);
    }
    assert.ok(restaurant.budget > 0 && restaurant.budget <= 1000, `${restaurant.id} has an invalid budget`);
    assert.ok(restaurant.tags.length > 0, `${restaurant.id} needs at least one category`);
    assert.ok(restaurant.meals.length > 0, `${restaurant.id} needs at least one meal period`);
    assert.equal(new URL(restaurant.sourceUrl).protocol, "https:");
    assert.equal(new URL(restaurant.mapUrl).hostname, "www.google.com");
    if (restaurant.tags.includes("late")) {
      assert.ok(restaurant.meals.includes("late"), `${restaurant.id} is tagged as late-night but not available in the late filter`);
    }
  }
});

test("requested cuisine categories are represented", () => {
  const requested = ["japanese", "chinese", "snack", "late"];
  const defined = new Set(restaurantCategories.map(({ id }) => id));
  const represented = new Set(restaurants.flatMap(({ tags }) => tags));

  for (const category of requested) {
    assert.ok(defined.has(category), `${category} filter is not defined`);
    assert.ok(represented.has(category), `${category} has no restaurant`);
  }
});

test("combined restaurant filters return only matching entries", () => {
  const cityLateJapanese = filterRestaurants(restaurants, {
    region: "city",
    category: "japanese",
    meal: "late",
    budget: 700,
  });
  assert.deepEqual(cityLateJapanese.map(({ id }) => id), ["city-sishi-skewers"]);

  const zhudongSnacks = filterRestaurants(restaurants, {
    region: "zhudong",
    category: "snack",
    budget: 200,
  });
  assert.deepEqual(
    zhudongSnacks.map(({ id }) => id),
    ["zhudong-huangji", "zhudong-chenji-noodles", "zhudong-zhuangji-beef-noodles"],
  );

  assert.equal(filterRestaurants(restaurants, { region: "zhudong", category: "japanese" }).length, 0);
});
