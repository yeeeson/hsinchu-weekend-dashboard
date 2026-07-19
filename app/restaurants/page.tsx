"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  filterRestaurants,
  restaurantCategories,
  restaurantMeals,
  restaurantPriceTiers,
  restaurantRegions,
  restaurants,
  restaurantTagLabels,
} from "@/lib/restaurant-planner.mjs";

type Region = "all" | "city" | "zhubei" | "zhudong" | "guanpu";
type Category = "all" | "japanese" | "chinese" | "snack" | "late" | "hotpot" | "thai" | "indian";
type Meal = "all" | "lunch" | "dinner" | "late";
type PriceTier = "all" | "value" | "mid" | "premium";

function money(value: number) {
  return `NT$${value.toLocaleString("zh-TW")}`;
}

export default function RestaurantsPage() {
  const [region, setRegion] = useState<Region>("all");
  const [category, setCategory] = useState<Category>("all");
  const [meal, setMeal] = useState<Meal>("all");
  const [priceTier, setPriceTier] = useState<PriceTier>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleRestaurants = useMemo(
    () => filterRestaurants(restaurants, { region, category, meal, priceTier }),
    [region, category, meal, priceTier],
  );

  const resetFilters = () => {
    setRegion("all");
    setCategory("all");
    setMeal("all");
    setPriceTier("all");
    setSelectedId(null);
  };

  const pickOne = () => {
    if (visibleRestaurants.length === 0) return;
    const picked = visibleRestaurants[Math.floor(Math.random() * visibleRestaurants.length)];
    setSelectedId(picked.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`restaurant-${picked.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <main className="restaurant-page" id="top">
      <header className="site-header restaurant-header">
        <Link className="brand" href="/" aria-label="回到週末路線首頁">
          <span className="brand-mark">風</span>
          <span>週末風向</span>
        </Link>
        <div className="header-actions">
          <Link className="header-link muted" href="/">找路線</Link>
          <span className="header-link active" aria-current="page">找餐廳</span>
          <div className="header-meta">
            <span className="freshness"><i />資料查核 2026.07.19</span>
          </div>
        </div>
      </header>

      <section className="restaurant-hero">
        <div>
          <p className="eyebrow">HSINCHU · FOOD SELECTOR</p>
          <h1>今天，<br />吃哪間？</h1>
          <p className="restaurant-hero-lede">
            不用再把地圖滑到選擇疲勞。先選地區、想吃的類型、預算與時段，再從符合條件的店裡挑一間。
          </p>
        </div>
        <div className="restaurant-stats" aria-label="餐廳資料摘要">
          <div><strong>{restaurants.length}</strong><span>間餐廳</span></div>
          <div><strong>{String(restaurantRegions.length - 1).padStart(2, "0")}</strong><span>個常用地區</span></div>
          <div><strong>{String(restaurantPriceTiers.length - 1).padStart(2, "0")}</strong><span>段價位帶</span></div>
          <p>新增關埔社區、關新路與科學園區周邊；價位為每人概估，評分為查核當下的第三方平台快照。</p>
        </div>
      </section>

      <section className="restaurant-filter-shell" aria-labelledby="restaurant-filter-title">
        <div className="restaurant-filter-heading">
          <div>
            <p className="eyebrow">01／縮小選擇</p>
            <h2 id="restaurant-filter-title">把今天的條件排好</h2>
          </div>
          <button className="text-button light" type="button" onClick={resetFilters}>清除條件</button>
        </div>

        <div className="restaurant-filter-grid">
          <fieldset className="restaurant-choice-group">
            <legend>地區</legend>
            <div className="choice-row">
              {restaurantRegions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={region === option.id ? "selected" : ""}
                  aria-pressed={region === option.id}
                  onClick={() => { setRegion(option.id as Region); setSelectedId(null); }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="restaurant-choice-group">
            <legend>料理類型</legend>
            <div className="choice-row">
              {restaurantCategories.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={category === option.id ? "selected" : ""}
                  aria-pressed={category === option.id}
                  onClick={() => { setCategory(option.id as Category); setSelectedId(null); }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="restaurant-choice-group">
            <legend>每人價位帶</legend>
            <div className="choice-row">
              {restaurantPriceTiers.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={priceTier === option.id ? "selected" : ""}
                  aria-pressed={priceTier === option.id}
                  onClick={() => { setPriceTier(option.id as PriceTier); setSelectedId(null); }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="restaurant-choice-group">
            <legend>用餐時段</legend>
            <div className="choice-row">
              {restaurantMeals.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={meal === option.id ? "selected" : ""}
                  aria-pressed={meal === option.id}
                  onClick={() => { setMeal(option.id as Meal); setSelectedId(null); }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="restaurant-results" aria-labelledby="restaurant-results-title">
        <div className="restaurant-results-heading">
          <div>
            <p className="eyebrow">02／符合條件</p>
            <h2 id="restaurant-results-title">
              找到 <span>{visibleRestaurants.length}</span> 間，可以出發
            </h2>
          </div>
          <button className="primary-button pick-button" type="button" onClick={pickOne} disabled={visibleRestaurants.length === 0}>
            幫我挑一間
          </button>
        </div>

        {visibleRestaurants.length > 0 ? (
          <div className="restaurant-grid">
            {visibleRestaurants.map((restaurant, index) => (
              <article
                className={`restaurant-card${selectedId === restaurant.id ? " selected" : ""}`}
                id={`restaurant-${restaurant.id}`}
                key={restaurant.id}
              >
                <div className="restaurant-card-top">
                  <span className="restaurant-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="restaurant-region">{restaurant.regionLabel}</span>
                </div>
                <div className="restaurant-card-copy">
                  <div className="restaurant-tags">
                    {restaurant.tags.map((tag) => <span key={tag}>{restaurantTagLabels[tag]}</span>)}
                  </div>
                  <h3>{restaurant.name}</h3>
                  <p className="restaurant-signature">{restaurant.signature}</p>
                  {restaurant.reviewLabel && restaurant.reviewUrl ? (
                    <a className="restaurant-review" href={restaurant.reviewUrl} target="_blank" rel="noreferrer">
                      <span aria-hidden="true">★</span>{restaurant.reviewLabel}
                    </a>
                  ) : null}
                  <p className="restaurant-hours"><b>營業時間</b>{restaurant.hours}</p>
                  <p className="restaurant-note">{restaurant.note}</p>
                </div>
                <dl className="restaurant-facts">
                  <div><dt>預算</dt><dd>每人約 {money(restaurant.budget)}</dd></div>
                  <div><dt>地址</dt><dd>{restaurant.address}</dd></div>
                  <div><dt>交通</dt><dd>{restaurant.parking}</dd></div>
                </dl>
                <div className="restaurant-actions">
                  <a className="primary-link" href={restaurant.mapUrl} target="_blank" rel="noreferrer">開啟 Google Maps</a>
                  <a className="source-link" href={restaurant.sourceUrl} target="_blank" rel="noreferrer">{restaurant.sourceLabel}</a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state restaurant-empty">
            <span>○</span>
            <h3>這組條件目前沒有店家</h3>
            <p>換一個價位帶，或放寬地區、料理類型，就會重新出現選項。</p>
            <button className="primary-button" type="button" onClick={resetFilters}>顯示全部餐廳</button>
          </div>
        )}
      </section>

      <aside className="restaurant-data-note">
        <p className="eyebrow">BEFORE YOU GO</p>
        <h2>營業時間會變，出發前再看一次</h2>
        <p>這份儀表板是決策起點，不是訂位系統。評分來自不同平台，樣本數與更新時間不完全相同；連假、包場、售完與臨時公休也可能變動，出發前請再查看卡片來源。</p>
      </aside>

      <footer>
        <Link className="footer-brand" href="/"><span>風</span>週末風向</Link>
        <p>餐廳價位為每人概估，不含特殊套餐與酒水。資料查核日：2026.07.19。</p>
        <a href="#top">回到頂端 ↑</a>
      </footer>
    </main>
  );
}
