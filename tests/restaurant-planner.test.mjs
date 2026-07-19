import assert from "node:assert/strict";
import test from "node:test";
import {
  filterRestaurants,
  restaurantCategories,
  restaurantRegions,
  restaurants,
} from "../lib/restaurant-planner.mjs";

test("restaurant catalog keeps the original areas and adds a complete Guanpu catalog", () => {
  assert.equal(restaurants.length, 23);
  assert.deepEqual(
    Object.fromEntries(restaurantRegions.slice(1).map(({ id }) => [id, restaurants.filter((item) => item.region === id).length])),
    { city: 5, zhubei: 5, zhudong: 5, guanpu: 8 },
  );
  assert.equal(new Set(restaurants.map(({ id }) => id)).size, restaurants.length, "restaurant ids must be unique");
});

test("every restaurant card has decision, transport, source, and map fields", () => {
  for (const restaurant of restaurants) {
    for (const field of ["name", "regionLabel", "hours", "address", "signature", "note", "parking", "sourceLabel"]) {
      assert.ok(restaurant[field], `${restaurant.id} is missing ${field}`);
    }
    assert.ok(restaurant.budget > 0, `${restaurant.id} has an invalid budget`);
    const expectedTier = restaurant.budget <= 200 ? "value" : restaurant.budget <= 500 ? "mid" : "premium";
    assert.equal(restaurant.priceTier, expectedTier, `${restaurant.id} is in the wrong price tier`);
    assert.ok(restaurant.tags.length > 0, `${restaurant.id} needs at least one category`);
    assert.ok(restaurant.meals.length > 0, `${restaurant.id} needs at least one meal period`);
    assert.equal(new URL(restaurant.sourceUrl).protocol, "https:");
    assert.equal(new URL(restaurant.mapUrl).hostname, "www.google.com");
    if (restaurant.tags.includes("late")) {
      assert.ok(restaurant.meals.includes("late"), `${restaurant.id} is tagged as late-night but not available in the late filter`);
    }
  }
});

test("requested and new cuisine categories are represented", () => {
  const requested = ["japanese", "chinese", "snack", "late", "thai", "indian"];
  const defined = new Set(restaurantCategories.map(({ id }) => id));
  const represented = new Set(restaurants.flatMap(({ tags }) => tags));

  for (const category of requested) {
    assert.ok(defined.has(category), `${category} filter is not defined`);
    assert.ok(represented.has(category), `${category} has no restaurant`);
  }
});

test("Guanpu offers two or three reviewed choices in every price tier", () => {
  const guanpuRestaurants = restaurants.filter(({ region }) => region === "guanpu");
  const counts = Object.fromEntries(
    ["value", "mid", "premium"].map((tier) => [tier, guanpuRestaurants.filter(({ priceTier }) => priceTier === tier).length]),
  );

  assert.deepEqual(counts, { value: 2, mid: 3, premium: 3 });
  for (const restaurant of guanpuRestaurants) {
    assert.ok(restaurant.reviewLabel, `${restaurant.id} needs a review snapshot`);
    assert.equal(new URL(restaurant.reviewUrl).protocol, "https:");
  }
});

test("combined restaurant filters return only matching entries", () => {
  const cityLateJapanese = filterRestaurants(restaurants, {
    region: "city",
    category: "japanese",
    meal: "late",
    priceTier: "premium",
  });
  assert.deepEqual(cityLateJapanese.map(({ id }) => id), ["city-sishi-skewers"]);

  const zhudongSnacks = filterRestaurants(restaurants, {
    region: "zhudong",
    category: "snack",
    priceTier: "value",
  });
  assert.deepEqual(
    zhudongSnacks.map(({ id }) => id),
    ["zhudong-huangji", "zhudong-chenji-noodles", "zhudong-zhuangji-beef-noodles"],
  );

  assert.equal(filterRestaurants(restaurants, { region: "zhudong", category: "japanese" }).length, 0);
  assert.deepEqual(
    filterRestaurants(restaurants, { region: "guanpu", category: "indian", priceTier: "premium" }).map(({ id }) => id),
    ["guanpu-chillies"],
  );
});
