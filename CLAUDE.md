# react-native-iaptic

Iaptic React Native SDK for in-app purchase integration. Wraps
`react-native-iap` with Iaptic-server receipt validation, entitlement
tracking, and a ready-to-use subscription UI.

## Lessons

- [`react-native-iap` podspec breaks on RN ≥ 0.83](lessons/rniap-podspec-rn83.md)
- [Peer dependencies rationale](lessons/peer-deps-rationale.md)
- [GPBL V9 migration impact](lessons/gpbl-v9-impact.md)

## Repro / experiment

Minimal Expo SDK 55 / RN 0.83 / new-arch reproduction project lives at
`../experiments/react-native-expo-55-test/`.

## Pre-existing infrastructure issues (unrelated to current work)

- `npm test` — 27 tests pass. Uses `ts-jest` with `react-native` and
  `@iaptic/react-native-iap` fully mocked. UI components (SubscriptionView,
  etc.) are also mocked since they import react-native deep paths.
- `npm run lint` fails — no `.eslintrc` config file present (broken since 1.0.1).
