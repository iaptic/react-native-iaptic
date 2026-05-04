# `react-native-iap` and async-storage are peerDependencies (as of 1.1.0)

Why peer, not regular dep:

1. `react-native-iap` ships an Expo config plugin (`app.plugin.js` →
   `withIAP`) that's referenced as `"react-native-iap"` in `app.config.{js,ts}`
   under `expo.plugins`. Node module resolution from the project root only
   finds it when `react-native-iap` is **hoisted to project root**. With it as
   a regular dep of `react-native-iaptic`, npm installs it nested at
   `node_modules/react-native-iaptic/node_modules/react-native-iap/`, which
   breaks the plugin reference.

2. Users need to be able to pin or `patch-package` `react-native-iap`
   independently to apply the RN 0.83+ podspec fix (see
   `rniap-podspec-rn83.md`). A regular dep makes that harder.

Peer ranges in `package.json`:
- `react-native-iap`: `>=12.16.1 <14` — v14+ is a Nitro rewrite (incompatible).
- `@react-native-async-storage/async-storage`: `>=1.19.0 <4` — only
  `getItem`/`setItem`/`removeItem` are used (`TokensManager.ts`); stable
  across 1.x → 3.x.

README pins `react-native-iap@^12.16.1` in the install command because v13.x,
while API-compatible, still ships the broken podspec.
