# Implementation verification

Date: 2026-10-03 (Asia/Kuala_Lumpur). Branch: chaw-ai/codebase-improvements. This report records the initial local implementation stage, including the earlier dependency repair. Publication later completed through PR #45; see RELEASE_VERIFICATION.md for hosted checks, deployment, and live evidence. No GitHub settings change was performed.

## Intended result and decisions

The approved improvement sequence preserves React 18, class components, and static hosting. The site starts with a visible red pattern, has production tests, uses a reproducible local browser runtime, and separates motion from overlays. It exposes deliberate flicker start/stop and handles fullscreen, visibility, and reduced-motion lifecycle changes.

- Local runtime build replaces CDN pins/SRI: existing Babel APIs compile JSX, and installed React UMD files plus licenses are copied from the lockfile. This removes runtime CDN/compiler dependence without a bundler. Development now requires building and serving output/site; opening the source index.html directly is not supported.
- Fullscreen uses the same #background plane as normal mode. Body owns overlays only. Copying animation classes onto body was rejected after review reproduced a grid/bouncing-box pseudo-element conflict.
- GitHub job summaries replace previous PR comments and Codecov uploads. Summaries read enforced thresholds from package.json, and PR validation needs no write credentials. The README no longer advertises Codecov integration. Existing users of that external report will need to use Actions summaries instead.
- Validation stays read-only; only the Pages deployment job receives write/OIDC permissions. Closed PRs no longer deploy independently; only default-branch pushes or deliberate default-branch manual runs deploy after validation.
- Keep Jest 29: current audit is clean, while a Jest 30/jsdom upgrade has broader compatibility effects. Testing Library 15 fixes the act warning within React 18. Transitive install deprecation notices are deferred separately from security findings.
- Use a feature branch in the active checkout and preserve earlier local fixes; no separate worktree or commit was necessary for the approved local implementation.

## Automated evidence

Final commands and results:

| Command | Result |
| --- | --- |
| npm ci --ignore-scripts --cache .npm | Passed; exact graph installed, zero vulnerabilities |
| npm run security:audit -- --cache .npm | Passed; zero vulnerabilities |
| npm run test:coverage -- --runInBand --cacheDirectory .npm/jest | Passed; 24 tests across 2 suites |
| npm run lint | Passed; project script syntax checks |
| npm run build | Passed; output/site generated with local assets and compiled JSX |
| node scripts/coverage-report.js | Passed; metrics and targets read from actual lcov/config |
| git diff --check | Passed |

Jest reports app.js coverage as 98.49% statements, 98.03% branches, 94.44% functions, and 97.97% lines. Every enforced minimum is 80%. The job summary rounds exact counts rather than truncating like Jest: lines 97/99, functions 34/36, branches 100/102.

The production tests cover initial background, pattern navigation/wraparound, batched updates, real keyboard control activation, overlay state, editable-target/modifier exclusions, explicit flicker start/stop, hidden-page stop/no restart, standard/prefixed/unavailable/rejected fullscreen paths, animation-plane separation, Escape-independent fullscreen exit, timer cleanup, focused controls, media-query changes, legacy listeners, and unmount cleanup. Build/workflow contracts check local script availability, absence of CDN/runtime Babel loading, public asset allowlist, default-branch triggers, dependency/test/build validation before upload, and deploy dependency on validation.

Regression proof:

- Initial red-background test failed against the original production code, then passed after mount initialization.
- New lifecycle/control tests failed before implementation, then passed.
- Reviewer findings reproduced with failing tests for a timer hiding normal-mode controls and body animation classes sharing the overlay plane. Both passed after fixes.
- A temporary mutation disabling navigation failed the production navigation test. Source was restored in a finally block; subsequent full tests passed.
- A temporary 100% branch threshold caused the coverage command to fail. The real 80% threshold was restored; subsequent full tests passed.

Disposable mutation and coverage-gate logs are in ignored output/. They are validation scratch artifacts, not permanent project documentation.

## Browser evidence

The built output was served on loopback only and exercised in Codex's in-app browser:

- Red appeared before input, then Next selected green.
- All executed script URLs were local assets; no CDN or browser Babel script remained.
- Checkerboard rendered alternating square quadrants with a 50px tile.
- Horizontal and diagonal scrolling positions changed over successive observations; explicit tile sizes were present.
- Bouncing box stayed vertically centered. In fullscreen, body retained show-grid, the grid pseudo-element spanned the viewport with no animation, and the box animated on #background.
- Fullscreen button entered/exited successfully; native Escape exited fullscreen and left animation-name: none with the Start animation control visible.
- Flicker was inactive on selection, required Start animation, and Stop animation removed it immediately.
- Captured browser error/warning logs were empty.

An initial server start was blocked by the sandbox's socket restriction; the authorized loopback server succeeded. A DOM body-keypress attempt was unsupported by the browser tool, so native Escape input was used and verified. Platform fullscreen properties in the browser tool's read-only DOM evaluation were not reliable; actual viewport changes, fullscreen UI transitions, and native Escape were observed instead.

## Verification boundaries and next work

At this initial stage, GitHub workflows were parsed and gate contracts tested locally; official action tag commits were checked through GitHub metadata and pinned. Hosted Actions/Pages and the public URL were subsequently verified in RELEASE_VERIFICATION.md. Scheduled execution remains unobserved, and repository protection settings were not changed.

This run does not establish physical screen calibration, refresh-rate measurement, mobile-device behavior, every browser's prefixed fullscreen implementation, or accessibility conformance across assistive technologies. Prefixed APIs and reduced-motion behavior were checked with production component tests and platform mocks. Broader device/browser validation and a separately scoped Jest major upgrade remain follow-ups.

## Subsequent toolchain update

The Jest 29 retention decision above records the initial bounded repair. The subsequent coordinated update advances Jest, babel-jest, and jest-environment-jsdom to 30.5.2 with jsdom 26.1.0, while retaining Babel 7 and React 18. See DEPENDENCY_PR_REVIEW.md for the current evaluation and verification.
