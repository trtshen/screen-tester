# Release verification

Verified 2026-10-03 (Asia/Kuala_Lumpur).

## Published implementation

- [PR #45](https://github.com/trtshen/screen-tester/pull/45) merged into master.
- Reviewed feature commit: e70d1f44cbf75ac97fcc0455e8a5c883dca6d134.
- Release merge commit: b9b6e7d4aebea2bb0da7849d4adbc8e270de4d59.
- [PR validation](https://github.com/trtshen/screen-tester/actions/runs/37062539021) completed successfully for the exact feature commit.
- [Pages validation and deployment](https://github.com/trtshen/screen-tester/actions/runs/37062697142) completed successfully for the release merge commit. Both build/validate and deploy jobs passed.
- [Public site](https://trtshen.github.io/screen-tester/) was inspected after deployment.

Hosted validation passed the reproducible install, dependency audit, syntax checks, 24 production/build/workflow tests with coverage enforcement, site build, and public-output upload. These are now hosted results, not just local checks.

## Live evidence

The deployed index.html, assets/app.js, assets/react.production.min.js, and assets/react-dom.production.min.js each returned HTTP 200. SHA-256 comparisons matched each response byte-for-byte with the reviewed local output/site build. The HTML references local scripts and contains no runtime Babel/CDN script.

In the live Codex browser, the initial pattern was red, Next selected green, Previous navigated back and wrapped to the fast flicker pattern, flicker remained stopped until explicit Start animation, and Stop animation returned its computed animation-name to none. Browser error/warning logs were empty. Local browser fullscreen/geometry checks are documented in IMPLEMENTATION_VERIFICATION.md; this public smoke check does not repeat every local case.

The existing Pages environment uses workflow deployment and permits master. Its custom branch policy also lists copilot/*; the application's deployment workflow gates publication to master/main. No branch protection or environment settings were changed. GitHub reports master as unprotected. Adding required checks/review rules is a separate repository-policy decision, not necessary to establish this release's successful checks and deployment.

## Approval and remaining boundaries

An initial merge attempt was rejected by automatic approval review because previously fetched PR metadata still showed validation in progress. A fresh authoritative read confirmed COMPLETED/SUCCESS validation and CLEAN/MERGEABLE state for the exact reviewed head commit. The subsequent approved merge succeeded. No rejection was bypassed.

The weekly audit and Dependabot configuration are now on the default branch. Their first scheduled executions were not observed during this release. At the original PR #45 release, CI jobs succeeded but emitted notices that pinned action versions use deprecated Node 20 metadata and are forced onto Node 24; upload-pages-artifact also invokes upload-artifact internally. The ubuntu-latest migration notice is another maintenance follow-up. The dependency proposal release below resolves the action runtime notices; runner-image policy remains a separate follow-up.

Physical mobile devices, additional browsers/assistive technologies, display calibration, and a coordinated Jest major upgrade remain follow-ups. Local master was fast-forwarded to the published implementation before recording this documentation.

## Dependency proposal release

- [PR #56](https://github.com/trtshen/screen-tester/pull/56) merged the seven compatible dependency/action proposals.
- Reviewed feature commit: 84157795bc264ac12d9c18bbaf6f43ee60f29c01.
- Release merge commit: 2540012eb2301d1cfae70e3f93c69db0084db02c.
- [PR validation](https://github.com/trtshen/screen-tester/actions/runs/37064561822) completed successfully on the exact reviewed feature commit.
- [Pages validation and deployment](https://github.com/trtshen/screen-tester/actions/runs/37064636181) completed successfully on the release merge commit, including the new upload/deploy Actions.

Clean local reinstall and hosted validation reported zero audit vulnerabilities and all 24 tests passed with coverage enforcement. Public index.html and all three local scripts returned HTTP 200 and matched output/site bytes after deployment. The application output is unchanged by these tooling updates.

All ten screenshot PRs (#44 and #46-#54) are closed. Seven proposals are implemented by the combined release; browserslist #44 is superseded by existing patched 4.29.3; Babel 8 #52/#53 are deferred because their peers conflict with the current Babel 7/Jest 29 toolchain. The new Dependabot policy closed the two Babel proposals automatically. The remaining superseded proposals were closed after successful deployment. See DEPENDENCY_PR_REVIEW.md for the full evaluation.

The old Action Node 20 runtime notices no longer appear in this deployment. The remaining notice announces ubuntu-latest migration to Ubuntu 26 beginning October 19, 2026. Runner image policy remains a separate follow-up. Current open dependency alerts were empty after closure. Dependabot subsequently opened new proposals #57 (grouped Babel/Jest updates) and #58 (React 19); these were not in the reviewed screenshot and remain separate follow-ups.

## Coordinated Jest 30 release

- [PR #63](https://github.com/trtshen/screen-tester/pull/63) merged the grouped Babel 7 preset update and three coordinated Jest 30 updates.
- Reviewed feature commit: eef807899cc2bc674f6d40bd20c4a37929262849.
- Release merge commit: aa5cea148c46c83784dd13158c877d73d526b6b7.
- [PR validation](https://github.com/trtshen/screen-tester/actions/runs/37065671485) passed on the reviewed feature revision.
- [Pages validation and deployment](https://github.com/trtshen/screen-tester/actions/runs/37065776160) passed on the merge revision.

Clean local and hosted installs kept lifecycle scripts disabled, with zero audit findings. All 24 production/build/workflow tests passed unchanged with the same enforced coverage under Jest 30.5.2/jsdom 26.1.0. Syntax/build checks passed. Public HTML and all three scripts returned HTTP 200 and matched the tested output/site bytes after deployment.

The second screenshot's five proposals #57-#61 are closed. #57 and #59-#61 are implemented by #63; #58 is deferred because React 19 alone conflicts with ReactDOM 18 and React 19 removes UMD artifacts required by the current build. Dependabot closed #57/#58 automatically after the update; the three superseded Jest proposals were closed after deployment. No open PRs or dependency alerts remained at the final check.

Current maintenance boundaries are the React UMD build migration, Babel 8 build/test migration, Ubuntu runner image policy, and broader physical-device/browser validation. Routine React/Babel major proposals are deferred while audits remain enabled; compatible React pairs and coordinated Jest packages are grouped.
