import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the generated map and route-card section render the same catalog", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  const mapNodes = html.match(/class="map-node(?:\s[^"]*)?"/g) ?? [];
  const routeCards = html.match(/class="route-card(?:\s[^"]*)?"/g) ?? [];

  assert.equal(mapNodes.length, 10, "the default map should show all 10 routes");
  assert.equal(routeCards.length, 10, "the default route-card section should show all 10 routes");
  assert.equal(mapNodes.length, routeCards.length, "map nodes and route cards must stay aligned");
  assert.match(html, />10(?:<!-- -->)? 條路線符合目前條件</);
  assert.match(html, /content="10 條新竹週末路線，含行程、交通與每人預算。"/);
  assert.match(html, /新竹市區/);
  assert.match(html, /綠世界放空日/);
  assert.match(html, /巨城到東門夜食/);
});
