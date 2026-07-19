# 週末風向｜新竹去哪玩

以預算、交通方式、天氣與時間篩選新竹週末路線的互動式儀表板。每條路線都包含景點營業時間、每人預算、交通建議、資料來源與 Google Maps 導航。

## Prerequisites

- Node.js `>=22.13.0`

## 本機開發

```bash
npm install
npm run dev
```

## 測試與發布門檻

```bash
npm run test:regression
```

完整回歸測試會依序執行：

1. 路線費用與篩選規則的單元測試。
2. 圖譜、路線卡、編號、營業時間、預算、資料來源與導航連結的一致性測試。
3. GitHub Pages 靜態建置。
4. 建置後頁面的路線數量與關鍵內容測試。

GitHub Pages 工作流程會在每次推送至 `main` 時先通過同一組回歸測試，成功後才發布。

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## 常用指令

- `npm run dev`：啟動本機網站。
- `npm test`：執行單元與資料一致性測試。
- `npm run build:pages`：產生 GitHub Pages 靜態網站。
- `npm run build`：驗證 OpenAI Sites 部署版本。
- `npm run test:regression`：執行完整回歸測試。
