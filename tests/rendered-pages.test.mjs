import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the generated map and route-card section render the same catalog", async () => {
  const [html, page, layout] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  const routeData = page.slice(page.indexOf("const routes:"), page.indexOf("const transportLabels"));
  const routeIds = [...routeData.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((match) => match[1]);
  const expectedCount = routeIds.length;
  const mapNodes = html.match(/class="map-node(?:\s[^"]*)?"/g) ?? [];
  const routeCards = html.match(/class="route-card(?:\s[^"]*)?"/g) ?? [];

  assert.ok(expectedCount > 0, "the route catalog must not be empty");
  assert.equal(mapNodes.length, expectedCount, "the default map should show the complete route catalog");
  assert.equal(routeCards.length, expectedCount, "the default route-card section should show the complete route catalog");
  assert.equal(mapNodes.length, routeCards.length, "map nodes and route cards must stay aligned");
  assert.match(html, new RegExp(`>${expectedCount}(?:<!-- -->)? 條路線符合目前條件`));
  assert.match(layout, new RegExp(`description: "${expectedCount} 條新竹週末路線`));
  assert.match(html, new RegExp(`content="${expectedCount} 條新竹週末路線，含行程、交通與每人預算。"`));
  assert.match(html, /新竹市區/);
  assert.match(html, /綠世界放空日/);
  assert.match(html, /巨城到東門夜食/);
  assert.match(html, /左岸滑板與單車放電/);
  assert.match(html, /新科運動與關新補給/);
  assert.match(html, /南寮南堤合法海釣/);
  assert.match(html, /香山丘陵與長興熱炒/);
});

test("the generated restaurant page renders the full catalog and home navigation", async () => {
  const [homeHtml, restaurantHtml] = await Promise.all([
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/restaurants/index.html", import.meta.url), "utf8"),
  ]);
  const restaurantCards = restaurantHtml.match(/class="restaurant-card(?:\s[^\"]*)?"/g) ?? [];

  assert.equal(restaurantCards.length, 23, "the default restaurant page must render the complete catalog");
  assert.match(homeHtml, /href="\/hsinchu-weekend-dashboard\/restaurants\/"/);
  assert.match(restaurantHtml, /今天，/);
  assert.match(restaurantHtml, /新竹市區/);
  assert.match(restaurantHtml, /竹北/);
  assert.match(restaurantHtml, /竹東/);
  assert.match(restaurantHtml, /關埔・園區/);
  assert.match(restaurantHtml, /日式/);
  assert.match(restaurantHtml, /小吃/);
  assert.match(restaurantHtml, /宵夜/);
  assert.match(restaurantHtml, /廟口鴨香飯/);
  assert.match(restaurantHtml, /十一街麵食館/);
  assert.match(restaurantHtml, /黃記粄條商行/);
  assert.match(restaurantHtml, /墨竹亭/);
  assert.match(restaurantHtml, /淇里思印度餐廳/);
  assert.match(restaurantHtml, /老爺鐵板燒/);
  assert.match(restaurantHtml, /NT\$501 以上/);
  assert.match(restaurantHtml, /restaurant-review/);
  assert.match(restaurantHtml, /營業時間/);
  assert.match(restaurantHtml, /Google Maps/);
});
