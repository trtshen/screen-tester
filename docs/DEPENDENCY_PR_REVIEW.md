# Dependabot PR review

Reviewed 2026-10-03 (Asia/Kuala_Lumpur). Scope: the ten open PRs shown in the user's screenshot. These are version update proposals; an open or failed PR does not itself establish a vulnerability. The combined update retains React 18, Babel 7, and Jest 29.

## Decisions

| PR | Proposal | Decision |
| --- | --- | --- |
| #44 | browserslist 4.28.9 | Superseded: the released lockfile already resolves patched 4.29.3. Do not downgrade. |
| #46 | upload-pages-artifact 5.0.0 | Accept in combined update; retain output/site as the public artifact. |
| #47 | checkout 7.0.1 | Accept in combined update. |
| #48 | deploy-pages 5.0.1 | Accept in combined update; retain deploy-only Pages/OIDC permissions. |
| #49 | Testing Library React 16.3.3 | Accept; React 18 is supported. Explicitly declare its DOM 10 peer. |
| #50 | setup-node 7.0.0 | Accept in combined update; retain Node 24. |
| #51 | user-event 14.6.7 | Accept in combined update. |
| #52 | Babel preset-react 8.0.1 | Defer: its core ^8 peer conflicts with installed core 7.29.7. |
| #53 | Babel core 8.0.6 | Defer: preset-env 7 requires core ^7, and babel-jest 29 requires core ^7.8.0. |
| #54 | jest-dom 7.0.1 | Accept; Node >=22 and DOM >=10 <11 match this project. |

The failed #52/#53 hosted install logs report ERESOLVE for those peer conflicts. Upgrading the Babel packages together is insufficient while babel-jest 29 still requires core 7. Babel 8 is ESM-only and requires a coordinated migration of presets/plugins and callers; see the [official migration guide](https://babeljs.io/docs/v8-migration). Do not bypass peer checks with --force or --legacy-peer-deps. No current audit finding requires this migration.

Routine Dependabot updates now group Testing Library packages and official actions. Babel/Jest minor and patch releases are grouped, and Babel package major updates are ignored until the separate migration is planned. The weekly audit remains enabled. This policy does not replace security advisory review.

## Supply chain and compatibility

Installed testing packages: react 16.3.3, jest-dom 7.0.1, user-event 14.6.7, DOM 10.4.2. DOM was already a transitive dependency and is now explicit because React Testing Library 16 needs it as a peer. None of these four packages declares preinstall/install/postinstall scripts.

Risk: updated third-party packages and workflow actions execute in the test/build environment; checkout and artifact/deployment actions use GitHub APIs and scoped job credentials.

Reason: testing package updates preserve the supported React version. Official checkout/setup/deploy releases use Node 24; upload-pages-artifact is composite and pins upload-artifact. Their action metadata and exact official revisions were checked. This is a metadata and integration review, not an exhaustive source audit of upstream code.

Safer alternative: retain exact action commit pins, npm integrity hashes, scripts-disabled reproducible installs, read-only validation permissions, and the existing public artifact boundary. Defer Babel/Jest major migration rather than forcing incompatible peers. Keep Pages write/OIDC credentials limited to deployment.

| Action | Version | Pinned official revision |
| --- | --- | --- |
| checkout | 7.0.1 | 3d3c42e5aac5ba805825da76410c181273ba90b1 |
| setup-node | 7.0.0 | 820762786026740c76f36085b0efc47a31fe5020 |
| upload-pages-artifact | 5.0.0 | fc324d3547104276b827a68afc52ff2a11cc49c9 |
| deploy-pages | 5.0.1 | 368f82528645a54fb793d4d04e342629a3f51346 |

## Verification

A clean npm ci --ignore-scripts install and npm audit both report zero vulnerabilities. An independent read-only review found no blocking issues. All 24 tests pass with the combined versions. Coverage: statements 98.49%, branches 98.03%, functions 94.44%, lines 97.97%. Syntax checks, production build, YAML parsing, npm dependency resolution, and git diff --check pass. Installed Babel core remains 7.29.7 and babel-jest remains 29.7.0. Application behavior and shipped React versions are unchanged.

[Combined PR #56](https://github.com/trtshen/screen-tester/pull/56) merged after successful hosted validation. Pages upload/deployment passed on merge revision 2540012eb2301d1cfae70e3f93c69db0084db02c. Public HTML and three scripts returned HTTP 200 and matched the local build bytes. All ten original proposals are closed: seven implemented through #56, #44 superseded by patched browserslist 4.29.3, and #52/#53 deferred because of incompatible peers. See RELEASE_VERIFICATION.md for run identities.

Remaining boundary: ubuntu-latest image migration and a coordinated Jest/Babel major upgrade are separate maintenance decisions. Physical device/browser validation remains outstanding from the original improvement plan.

## Remaining five proposals: coordinated Jest 30 update

The second screenshot contains #57-#61. The first review above records the earlier release; the toolchain now advances from Jest 29 to Jest 30.

| PR | Proposal | Decision |
| --- | --- | --- |
| #57 | Babel preset-env and preset-react 7.29.7 | Accept together, retaining Babel core 7.29.7. |
| #58 | React 19.3.0 alone | Defer as incompatible with ReactDOM 18 and the existing UMD-based public build. |
| #59 | babel-jest 30.5.2 | Accept with Jest and its environment. |
| #60 | jest-environment-jsdom 30.5.2 | Accept with Jest; upgrades jsdom to 26.1.0. |
| #61 | Jest 30.5.2 | Accept as a coordinated toolchain update. |

The #58 install log reports ERESOLVE: ReactDOM 18.3.1 requires React ^18.3.1, but the proposal installs React 19.3.0. Updating both packages would still break scripts/build.js, which copies their UMD production artifacts. The [React 19 migration guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) documents removal of UMD builds and the modern JSX transform requirement. Retain React/ReactDOM 18.3.1 until a separately reviewed build migration. Routine React major updates are ignored, and compatible React/ReactDOM updates are grouped.

The [Jest 30 migration guide](https://jestjs.io/docs/upgrading-to-jest30) documents the jsdom 26 change, removed matcher aliases, and environment requirements. The existing assertions and platform mocks pass under the coordinated upgrade without application or test behavior changes. Babel-jest 30 accepts installed Babel 7.29.7. Jest packages now form their own Dependabot group across update types, preventing the three separate major proposals from recurring. Babel minor/patch updates retain their own group and Babel major updates remain deferred.

Risk: this upgrade changes a substantial transitive test-tooling graph, including DOM emulation and Babel plugins. Transitive dependencies can execute code, access environment variables, or use process/network APIs during tests; lifecycle scripts remain disabled during installs. Changed packages declare two install hooks: @parcel/watcher 2.6.0 can spawn node-gyp through a shell when npm_config_build_from_source is enabled; unrs-resolver 1.12.2 delegates postinstall native-binary preparation to napi-postinstall. These hooks were not executed. Normal installed platform binaries worked in local tests; hosted CI must verify Linux separately.

Reason: the existing Jest packages are upgraded together rather than introducing a new test framework. jsdom 26 changes DOM behavior, so the complete production suite and build/workflow contracts were rerun.

Safer alternative: retain the audited React runtime and Babel major, use lockfile integrity hashes and scripts-disabled reproducible installs, and gate publication on full tests, audit, build, and fresh hosted CI. No new direct package or build framework is added.

Clean scripts-disabled reinstall and combined validation passed all 24 tests with unchanged coverage (98.49% statements, 98.03% branches, 94.44% functions, 97.97% lines), syntax checks, production build, and zero audit vulnerabilities. No test weakening or forced peer resolution was needed. Hosted validation and Pages deployment both passed for [combined PR #63](https://github.com/trtshen/screen-tester/pull/63). All five original proposals #57-#61 are closed: four implemented by #63 and React 19 deferred. No open PRs or dependency alerts remained at this check. See RELEASE_VERIFICATION.md for run identities and public asset verification.
