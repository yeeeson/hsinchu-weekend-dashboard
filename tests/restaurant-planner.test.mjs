import assert from "node:assert/strict";
import test from "node:test";
import {
  filterRestaurants,
  restaurantCategories,
  restaurantPriceTiers,
  restaurantRegions,
  restaurants,
} from "../lib/restaurant-planner.mjs";

test("restaurant catalog keeps every target area and expands the complete catalog", () => {
  assert.equal(restaurants.length, 46);
  assert.deepEqual(
    Object.fromEntries(restaurantRegions.slice(1).map(({ id }) => [id, restaurants.filter((item) => item.region === id).length])),
    { city: 19, zhubei: 10, zhudong: 8, guanpu: 9 },
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

test("every cuisine and price-tier combination keeps at least three base choices", () => {
  const categories = restaurantCategories.filter(({ id }) => id !== "all");
  const priceTiers = ["value", "mid", "premium"];

  for (const category of categories) {
    for (const priceTier of priceTiers) {
      const matches = filterRestaurants(restaurants, { category: category.id, priceTier });
      assert.ok(
        matches.length >= 3,
        `${category.label} × ${priceTier} only has ${matches.length} restaurant(s)`,
      );
      assert.ok(matches.every(({ tags }) => tags.includes(category.id)));
      assert.ok(matches.every((restaurant) => restaurant.priceTier === priceTier));
    }
  }
});

test("Guanpu offers three choices in every price tier and keeps its reviewed shortlist", () => {
  const guanpuRestaurants = restaurants.filter(({ region }) => region === "guanpu");
  const counts = Object.fromEntries(
    ["value", "mid", "premium"].map((tier) => [tier, guanpuRestaurants.filter(({ priceTier }) => priceTier === tier).length]),
  );

  assert.deepEqual(counts, { value: 3, mid: 3, premium: 3 });
  const reviewedRestaurants = guanpuRestaurants.filter(({ reviewLabel }) => reviewLabel);
  assert.equal(reviewedRestaurants.length, 8);
  for (const restaurant of reviewedRestaurants) {
    assert.ok(restaurant.reviewLabel, `${restaurant.id} needs a review snapshot`);
    assert.equal(new URL(restaurant.reviewUrl).protocol, "https:");
  }
});

test("all 84 region, cuisine, and price combinations return exactly three choices", () => {
  const regions = restaurantRegions.filter(({ id }) => id !== "all");
  const categories = restaurantCategories.filter(({ id }) => id !== "all");
  const priceTiers = restaurantPriceTiers.filter(({ id }) => id !== "all");
  let checkedCombinations = 0;

  for (const region of regions) {
    for (const category of categories) {
      for (const priceTier of priceTiers) {
        const matches = filterRestaurants(restaurants, {
          region: region.id,
          category: category.id,
          priceTier: priceTier.id,
        });
        const label = `${region.label} × ${category.label} × ${priceTier.label}`;

        assert.equal(matches.length, 3, `${label} must return exactly three choices`);
        assert.ok(matches.every(({ tags }) => tags.includes(category.id)), `${label} has a wrong category`);
        assert.ok(matches.every((restaurant) => restaurant.priceTier === priceTier.id), `${label} has a wrong price tier`);

        let nearbySeen = false;
        for (const restaurant of matches) {
          if (restaurant.isNearbyRecommendation) {
            nearbySeen = true;
            assert.notEqual(restaurant.region, region.id, `${label} marked a local restaurant as nearby`);
            assert.equal(restaurant.nearbyForRegion, region.id);
            assert.match(restaurant.nearbyTravelLabel, /離峰約/);
          } else {
            assert.equal(nearbySeen, false, `${label} must place local choices before nearby choices`);
            assert.equal(restaurant.region, region.id, `${label} has an unlabelled nearby restaurant`);
          }
        }

        checkedCombinations += 1;
      }
    }
  }

  assert.equal(checkedCombinations, 84);
});

test("combined restaurant filters return only matching entries", () => {
  const cityLateJapanese = filterRestaurants(restaurants, {
    region: "city",
    category: "japanese",
    meal: "late",
    priceTier: "premium",
  });
  assert.deepEqual(
    cityLateJapanese.map(({ id }) => id),
    ["city-sishi-skewers", "guanpu-abv-japanese", "zhubei-sishi-skewers"],
  );
  assert.equal(cityLateJapanese.filter(({ isNearbyRecommendation }) => isNearbyRecommendation).length, 2);

  const zhudongSnacks = filterRestaurants(restaurants, {
    region: "zhudong",
    category: "snack",
    priceTier: "value",
  });
  assert.deepEqual(
    zhudongSnacks.map(({ id }) => id),
    ["zhudong-huangji", "zhudong-chenji-noodles", "zhudong-zhuangji-beef-noodles"],
  );

  assert.deepEqual(
    filterRestaurants(restaurants, { region: "zhudong", category: "japanese" }).map(({ id }) => id),
    ["zhudong-kuairou-curry"],
  );
  assert.deepEqual(
    filterRestaurants(restaurants, { region: "guanpu", category: "indian", priceTier: "premium" }).map(({ id }) => id),
    ["guanpu-chillies", "city-baan-phadthai", "zhubei-siammore"],
  );
});
