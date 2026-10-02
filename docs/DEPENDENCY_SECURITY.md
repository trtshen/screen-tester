# Dependency security review

Date: 2026-10-03 (Asia/Kuala_Lumpur). Outcome: fixed for the npm advisory findings below. Browser CDN security remains separately unverified.

## Findings and repair

The initial live npm audit reported three high-severity vulnerable package entries. All are transitive development dependencies, reached by Jest coverage tooling or Babel configuration processing, rather than directly shipped browser scripts.

| Package | Previous | Patched | Tooling path |
| --- | --- | --- | --- |
| brace-expansion | 1.1.16 | 1.1.21 | babel-jest -> babel-plugin-istanbul -> test-exclude -> minimatch |
| browserslist | 4.25.0 | 4.29.3 | @babel/core -> @babel/helper-compilation-targets; @babel/preset-env -> core-js-compat |
| js-yaml | 3.15.0 | 3.15.2 | babel-jest -> babel-plugin-istanbul -> @istanbuljs/load-nyc-config |

The invariant is that the reproducible npm graph resolves outside every reported affected range while preserving legitimate test/configuration behavior. Compatible lockfile updates were sufficient; no direct dependency ranges, React/Jest major versions, application logic, or CI behavior changed.

Advisories reported by npm:

- brace-expansion: [expansion length](https://github.com/advisories/GHSA-mh99-v99m-4gvg), [intermediate-array limits](https://github.com/advisories/GHSA-rgw5-rvv9-x895), [rewrite CPU growth](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [nested-group recursion](https://github.com/advisories/GHSA-qhr7-859c-m2p7), [comma-part recursion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p).
- browserslist: [unbounded query caches](https://github.com/advisories/GHSA-c83g-rgw3-j3cx), [custom statistics handling](https://github.com/advisories/GHSA-73wf-gq98-2v4g).
- js-yaml: [ordered-map CPU consumption](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj), [empty merge source CPU consumption](https://github.com/advisories/GHSA-2883-xcg3-v3hh).

This is evidence of vulnerable versions in tooling, not proof of a remotely exploitable path in the hosted app. No application input passes user-controlled YAML, browser queries, or glob patterns into these packages.

## Supply chain review

The patched browserslist also refreshes caniuse-lite, electron-to-chromium, node-releases, and update-browserslist-db, and adds its required baseline-browser-mapping dependency. Existing parent ranges accept all updates. node-releases now requires Node >=18; observed Node 22 and CI Node 24 satisfy it.

Risk: third-party package updates and one new transitive package expand reviewed supply chain content; explicit package maintenance commands can execute child processes or contact the network.

Reason: these packages support browserslist metadata and updates. None of the eight added/changed packages declares install lifecycle scripts. This is a metadata/script review, not an exhaustive third-party source audit.

Safer alternative: preserve current major versions, registry integrity hashes, and reproducible installs; use --ignore-scripts during repair and verification. Avoid --force and unnecessary new direct dependencies. CI still uses ordinary npm ci and can execute lifecycle scripts of other existing dependencies.

## Verification

1. Inspection: reviewed the lockfile diff and caller version constraints; npm ls brace-expansion browserslist js-yaml --all confirmed only patched versions after reinstall.
2. Security gate: npm audit --json --cache .npm initially returned 3 high findings. npm audit fix --package-lock-only --ignore-scripts --cache .npm returned zero. npm ci --ignore-scripts --cache .npm successfully reproduced the graph and returned zero vulnerabilities.
3. Focused probes: inline Node assertions passed for ordinary brace expansions and YAML merges, bounded expansion of 400 large alternatives, deep brace input, accounting for empty YAML merge sources using a small explicit work limit, 600 distinct browser queries, and prototype-key isolation in custom browser statistics. Inspection confirmed bounded browserslist caches. The first YAML probe expected the work-limit error but hit an earlier sequence-size guard; the corrected small-limit probe reached the intended boundary and passed. These probes are not exhaustive reproductions of every advisory.
4. Compatibility gate: npm run test:coverage -- --runInBand --cacheDirectory .npm/jest passed all 11 tests. Coverage: statements 61.60%, branches 23.28%, functions 76.19%, lines 62.72%. Existing React act deprecation warning remains.

5. Final checks: npm run security:audit -- --cache .npm passed with zero vulnerabilities; git diff --check passed. Babel successfully transformed app.js, and manifest/lockfile direct dependency ranges matched. An independent read-only patch review found no concrete surviving npm advisory path or compatibility regression.

No new test files were needed for this lockfile-only repair. Generated npm/Jest caches and coverage remain inside ignored repository directories. Changed tracked files are package-lock.json and README.md; new documentation is AGENTS.md, this report, and PLAN_CODE_IMPROVEMENTS.md.

## Boundaries

index.html independently executes Babel 5.8.38 and React/ReactDOM @18 CDN scripts, without SRI. npm audit cannot establish their security. The npm repair changes development tooling only. CDN loading, real-browser rendering, physical display diagnosis, real fullscreen APIs, and live GitHub Pages behavior were not exercised. The improvement plan addresses those remaining concerns without claiming they were fixed.

## Follow-up implementation on 2026-10-03

The browser boundary described above is historical: index.html no longer loads CDN scripts or a runtime compiler. scripts/build.js now copies installed React/ReactDOM production assets from the audited lockfile and compiles JSX with installed Babel tooling. Built HTML permits local scripts via CSP. Testing Library was updated to 15.0.7 within React 18 compatibility; no new direct dependency or build framework was introduced. All CI installs disable lifecycle scripts. Live audit, tests, and browser evidence are recorded in IMPLEMENTATION_VERIFICATION.md. Existing Jest 29 transitive deprecations remain separate from advisory findings.

## Subsequent toolchain update

The Jest 29 retention decision above records the initial bounded repair. The subsequent coordinated update advances Jest, babel-jest, and jest-environment-jsdom to 30.5.2 with jsdom 26.1.0, while retaining Babel 7 and React 18. See DEPENDENCY_PR_REVIEW.md for the current evaluation and verification.
