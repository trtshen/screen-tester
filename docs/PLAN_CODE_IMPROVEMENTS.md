# Codebase improvement plan

Reviewed and implemented 2026-10-03 (Asia/Kuala_Lumpur). The user approved the suggested sequence. Status: [x] implemented/verified locally; [ ] remaining follow-up. See IMPLEMENTATION_VERIFICATION.md for evidence, decisions, and verification boundaries. The original review found duplicate component tests, a blank initial screen, zero coverage enforcement, unsupported deployment trigger paths, mutable CDN runtime dependencies, and fullscreen/animation lifecycle gaps.

## Completed sequence

1. [x] Current npm advisories repaired in package-lock.json. See DEPENDENCY_SECURITY.md.
2. [x] Unsupported coverage claims corrected in README.md; architecture documented in AGENTS.md.
3. [x] app.test.js now tests production code exclusively; duplicated components removed. Covers navigation/wraparound/batched events, overlays, real component lifecycle, fullscreen variants/failures, and animation stop paths. A deliberate production navigation mutation failed its test.
4. [x] app.js applies red immediately on mount; regression test passed after first reproducing the blank background.
5. [x] .github/workflows/deploy-page.yml now triggers on master/main pushes or manual runs on those branches. Reusable validate.yml gates upload/deploy on install, audit, syntax checks, coverage, and build. Only output/site is public.
6. [x] package.json enforces 80% across all coverage metrics. scripts/coverage-report.js reads those thresholds for job summaries. A deliberately unmet threshold made the coverage command fail.
7. [x] scripts/build.js precompiles JSX with existing @babel/core/preset-react and copies exact installed React production assets/licenses. index.html loads only local scripts with a CSP. Browser loading and visual patterns checked; no bundler or new build dependency added.
8. [x] app.js shares standard/prefixed fullscreen handling between buttons/keys, reports unsupported/rejected requests, handles fullscreen events, and stops animations on exit even without a keydown event. Browser button and native Escape transitions checked.
9. [x] Navigation updater functions only compute state. Committed changes drive #background; unmount cleans timers, input/media/fullscreen listeners, backgrounds, and overlays. Animation uses one plane, preventing body grid collisions.
10. [x] index.html uses explicit scrolling tile sizes/pixel offsets and composed bouncing translations. app.js uses actual conic checkerboard tiles. Browser confirmed checkerboard geometry, progressing horizontal/diagonal offsets, centered moving box, and intact fullscreen grid.
11. [x] Flicker requires explicit start; Stop animation remains available, Escape/fullscreen exit/hidden page stop effects, and reduced-motion preferences suppress automatic movement. Changing to reduced motion also stops active effects. Returning to the page does not restart.
12. [x] security-audit.yml defines weekly/manual audits; dependabot.yml checks npm/actions weekly. CI uses disabled install scripts, read-only validation permissions, deploy-only Pages/OIDC access, and official action revisions pinned to verified commits. Job summaries replace PR comments to avoid write credentials in PR validation.
13. [x] Pattern definitions now live outside state with stable IDs, types, and labels. Selected pattern and count are visible. Tests find motion patterns by ID instead of fixed navigation counts.
14. [x] Visible Previous/Next, fullscreen, Grid, Crosshair, Help, and animation controls support pointer/touch/keyboard use. Overlay buttons expose pressed state; Help exposes expanded state. Shortcuts skip editable targets and modifier combinations. Focused controls remain visible.
15. [x] Existing Testing Library upgraded from 13.4.0 to React 18-compatible 15.0.7, removing the act warning. Unused test imports removed; native syntax checks added. Jest major upgrade assessed and deferred: current audited Jest 29 passes; Jest 30 changes jsdom behavior and is not needed for this repair.

## Remaining follow-ups

16. [x] PR #45 merged after hosted validation; Pages build and deployment succeeded. Public HTML/scripts match the reviewed build and live navigation/flicker controls passed. Existing Pages policy permits master; settings were preserved. See RELEASE_VERIFICATION.md.
17. [ ] Test physical mobile devices, additional browsers, touch ergonomics, and display-specific performance. The local Codex browser check covers one browser/desktop environment, not physical screen calibration or real refresh-rate measurement.
18. [ ] Consider a separately scoped coordinated Jest/babel-jest/jsdom upgrade if its benefits justify compatibility testing. Deprecated Jest 29 transitive packages remain; they are not current npm advisory findings.

19. [ ] Review pinned action runtime upgrades and the ubuntu-latest migration policy. Hosted jobs pass, but action Node 20 metadata is deprecated and forced to Node 24; see RELEASE_VERIFICATION.md.

## Next step

The implementation is live and release checks passed. Continue with broader device/browser validation (17); schedule action/runner maintenance (19) separately from the optional Jest major upgrade (18). Branch protection changes require an explicit repository-policy choice.
