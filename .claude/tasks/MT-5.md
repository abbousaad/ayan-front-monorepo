# MT-5: Auth choice modal

## Goal
Show a bottom-sheet-style modal when the user taps "Proceed" in the cart, offering "Continue as guest" or "Login / Sign up" (placeholder).

## Files to create
- `apps/mobile/src/components/auth-choice-modal.tsx`

## Files to modify
- `apps/mobile/src/cart-screen.tsx` (MT-4) — render `<AuthChoiceModal>` when `showAuthModal` state is true; pass callbacks

## Modal behaviour
- Rendered using React Native `Modal` (`transparent`, `animationType="slide"`)
- Semi-transparent dark backdrop covering the full screen
- White card slides up from the bottom with:
  - Title: "How do you want to continue?"
  - Subtitle: "You don't need an account to place an order."
  - Primary button: "Continue as guest" → calls `onContinueAsGuest()`
  - Secondary button: "Login / Sign up" → shows a "Coming soon" `Alert` (not implemented yet)
  - Dismiss/close button (×) in top-right corner of the card

## Props
```ts
type AuthChoiceModalProps = {
  visible: boolean;
  onClose(): void;
  onContinueAsGuest(): void;
};
```

## Acceptance criteria
- Modal appears on "Proceed" tap
- "Continue as guest" closes modal and triggers navigation to checkout
- "Login / Sign up" shows Alert "Coming soon"
- Tapping backdrop or × closes modal
