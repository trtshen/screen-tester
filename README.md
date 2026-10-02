# Screen Tester

[![Test Coverage](https://github.com/trtshen/screen-tester/actions/workflows/test-coverage.yml/badge.svg)](https://github.com/trtshen/screen-tester/actions/workflows/test-coverage.yml)
[![Deploy to GitHub Pages](https://github.com/trtshen/screen-tester/actions/workflows/deploy-page.yml/badge.svg)](https://github.com/trtshen/screen-tester/actions/workflows/deploy-page.yml)

Inspect your screen with 38 solid-color, gradient, grid, checkerboard, edge, motion, and flicker patterns. These support visual inspection, not calibrated color or refresh-rate measurements.

Demo: [GitHub Pages](https://trtshen.github.io/screen-tester/). Local changes reach the demo only after merging/pushing a supported default branch and successful deployment.

## Controls

- Click the test surface or use Left/Right to navigate; buttons and editable controls do not advance the pattern accidentally.
- F or Fullscreen toggles fullscreen. Failures appear in the control panel.
- G/Grid and C/Crosshair toggle overlays with visible pressed state.
- Help shows instructions and the selected pattern is labeled.
- Flicker requires an explicit Start animation action. Reduced-motion preferences prevent automatic motion tests, with deliberate start still available.
- Stop animation or Escape ends animation. Fullscreen exit and hiding the page also stop it; returning does not restart it automatically.
- In fullscreen, controls fade after pointer/touch activity, but remain visible while focused, showing Help, or reporting an error. Stop animation remains visible independently.

## Development and build

Use Node.js 24 LTS (minimum Node 22).

```bash
npm ci --ignore-scripts
npm run lint
npm test -- --runInBand --cacheDirectory .npm/jest
npm run test:coverage -- --runInBand --cacheDirectory .npm/jest
npm run build
python3 -m http.server 8765 --bind 127.0.0.1 --directory output/site
```

Open http://127.0.0.1:8765/ after starting the server. Serve the built output, not the repository root. Watch mode: `npm run test:watch -- --cacheDirectory .npm/jest`.

The small build uses installed Babel tooling to compile JSX and copies React 18's production UMD files and licenses into `output/site/assets`. It installs no additional build dependency and ships no runtime compiler or external CDN scripts. Dependency versions and integrity hashes come from package-lock.json. The site uses a Content Security Policy allowing local scripts and inline CSS needed by the patterns. `npm run lint` performs syntax checks on project scripts; JSX syntax is checked by tests/build, not by a style linter.

## Validation and deployment

The 2026-10-03 local run passed 24 tests against production components and build/workflow contracts. Production app.js coverage exceeds the enforced 80% minimum for lines, functions, statements, and branches. See [implementation verification](docs/IMPLEMENTATION_VERIFICATION.md) for measured coverage and browser checks.

PR CI and Pages deployment share `.github/workflows/validate.yml`: reproducible install with scripts disabled, high/critical dependency audit, syntax checks, coverage tests, build, then optional upload of only `output/site`. Coverage summaries use thresholds from package.json and appear in the GitHub Actions job summary. This replaces the previous PR bot comments and external Codecov upload.

Pages deploys on pushes to master/main, or a manual run on those branches, after validation succeeds. Only the deployment job receives Pages write and OIDC permissions. The validated release is deployed; see [release verification](docs/RELEASE_VERIFICATION.md). Weekly audit and Dependabot configuration are on the default branch; their first scheduled executions remain unobserved. Existing Pages environment settings permit master. Branch protection settings were left unchanged.

## Dependency security

```bash
npm run security:audit -- --cache .npm
npm audit fix --package-lock-only --ignore-scripts --cache .npm
```

Review the lockfile diff, reinstall reproducibly, and rerun tests/build/audit after a repair. Avoid `--force` major upgrades. The [dependency security review](docs/DEPENDENCY_SECURITY.md) records the repaired advisories. GitHub Actions also defines a weekly Monday 09:00 Malaysia time audit (01:00 UTC), and Dependabot checks npm and GitHub Actions weekly. Testing Library and official Actions updates are grouped. Babel/Jest minor and patch updates are grouped; standalone Babel major updates are deferred until a coordinated toolchain migration. See the [Dependabot PR review](docs/DEPENDENCY_PR_REVIEW.md) for compatibility decisions and tested versions.

## Project documentation

[AGENTS.md](AGENTS.md) describes current architecture and commands. The [improvement plan](docs/PLAN_CODE_IMPROVEMENTS.md) tracks completed work and remaining validation boundaries.
