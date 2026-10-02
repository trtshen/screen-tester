# Project working guide

Follow the user's global working rules. Keep task files inside this repository, preserve unrelated changes, update relevant documentation, and use ASCII punctuation.

## Stack and architecture

Screen Tester is a static webapp with 38 visual inspection patterns, no backend, and no persistence. It retains React 18 class components. npm supplies React/ReactDOM 18.3.1, Babel 7, Jest/babel-jest/jest-environment-jsdom 29.7.0, jsdom 20, and Testing Library React 15. Node 24 is used in CI; Node >=22 is required.

app.js holds immutable pattern definitions with stable IDs and labels outside component state. ScreenTester owns navigation, fullscreen state, overlays, explicit animation start/stop, and control visibility. State updater functions do not write to the DOM. componentDidUpdate applies committed pattern changes to #background. Body owns grid/crosshair overlays only; do not duplicate animation classes onto body because their pseudo-elements can collide. Fullscreen events and keyboard/button actions share the same helper. Fullscreen exit, page hiding, and reduced-motion activation stop animations; stopped effects need deliberate restart.

## Files

- app.js: pattern metadata, ScreenTester, fullscreen helper, root startup.
- index.html: inline CSS and local runtime script references; a source template requiring a build.
- app.test.js: real production component tests, DOM/fullscreen/motion mocks where platform APIs require them.
- build.test.js: public asset build and workflow gate contracts.
- src/setupTests.js: common browser API mocks and Jest DOM assertions.
- scripts/build.js: Babel JSX compilation and allowlisted React UMD/license copying to output/site.
- scripts/coverage-report.js: GitHub job summary derived from lcov and package.json thresholds.
- .github/workflows/validate.yml: reusable CI audit/test/build gate.
- .github/workflows/test-coverage.yml: PR validation caller.
- .github/workflows/deploy-page.yml: validated Pages deployment for master/main.
- .github/workflows/security-audit.yml and .github/dependabot.yml: scheduled dependency upkeep.
- docs/PLAN_CODE_IMPROVEMENTS.md: living implementation status and remaining follow-ups.
- docs/IMPLEMENTATION_VERIFICATION.md: local/browser evidence and decisions.
- docs/DEPENDENCY_SECURITY.md: initial repair and subsequent runtime boundary changes.
- docs/RELEASE_VERIFICATION.md: merged PR, hosted CI/deployment identities, and public-site evidence.

## Commands and conventions

- npm ci --ignore-scripts --cache .npm: reproduce dependency graph without lifecycle scripts.
- npm run lint: syntax check project Node scripts; not a formatting/style linter.
- npm test -- --runInBand --cacheDirectory .npm/jest: production and build/workflow tests.
- npm run test:coverage -- --runInBand --cacheDirectory .npm/jest: enforced global 80% thresholds for all metrics.
- npm run test:watch -- --cacheDirectory .npm/jest: watch tests.
- npm run security:audit -- --cache .npm: high/critical advisory gate; requires registry access.
- npm run build: replace only generated output/site, compiling JSX and copying local runtime assets/licenses.
- python3 -m http.server 8765 --bind 127.0.0.1 --directory output/site: local preview.

Keep React 18 and coordinated Jest 29 versions for bounded fixes. Do not add a framework or package without a demonstrated need. Serve/build output/site rather than the repository root. npm lockfile changes now affect the built browser runtime too. Keep pattern definitions and CSS aligned; identify patterns by stable ID in regression tests, not navigation counts. Keep body overlays separate from the animation plane. Use real browser checks for geometry/fullscreen claims, and distinguish local workflow contract checks from GitHub execution. Generated files belong in ignored repository-owned .npm, coverage, or output directories.
