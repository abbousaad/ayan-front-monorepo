# MT-8 — Mobile I18nProvider + switcher + expo-localization

## Goal
Runtime i18n for the mobile app with the same contract as web.

## Requirements
- Add dep `expo-localization` (AsyncStorage already present).
- `apps/mobile/src/contexts/i18n-context.tsx` — same `{ locale, setLocale, t, dir,
  availableLocales, isLoading }` contract as web, but:
  - Persist active locale via AsyncStorage key `ayan.locale`.
  - Default from `expo-localization` device locale (guarded by `isLocale`), then
    server `defaultLocale`, then `'en'`.
  - Fetch via `getTranslationSetting()`; fall back to `enBaseline` on failure.
- `apps/mobile/App.tsx` — wrap around `CartProvider`.
- Language switcher in `home-screen.tsx` header.

## Done when
- [ ] Switching language updates strings and persists across app restart
- [ ] `pnpm lint` passes
