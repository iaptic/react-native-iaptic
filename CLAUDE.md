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

- `npm test` now works — `jest.config.js` was switched from the unresolvable
  `react-native` preset to `ts-jest` (with react-native + the fork fully
  mocked). 27 tests pass against `@iaptic/react-native-iap` 13.0.0.
- `npm run lint` fails — no `.eslintrc` config file present (broken since 1.0.1).
