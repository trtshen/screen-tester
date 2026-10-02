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

The weekly audit and Dependabot configuration are now on the default branch. Their first scheduled executions were not observed during this release. Current CI jobs succeed but emit notices that pinned action versions use deprecated Node 20 metadata and are forced onto Node 24; upload-pages-artifact also invokes upload-artifact internally. The ubuntu-latest migration notice is another maintenance follow-up. Review current official action releases and the runner-image policy in a separate change rather than mixing an unvalidated major-action upgrade into this completed release.

Physical mobile devices, additional browsers/assistive technologies, display calibration, and a coordinated Jest major upgrade remain follow-ups. Local master was fast-forwarded to the published implementation before recording this documentation.
