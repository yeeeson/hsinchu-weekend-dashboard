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
