# Scholarship catalogue data sources

AfriGrantPipeline separates **catalogue inclusion** from **provider verification**.

## Current catalogue sources

### ScholarFinder Bot
- Repository: https://github.com/ScottT2-spec/scholar-finder-bot
- Dataset: `scholarships.json`
- Use: factual scholarship/provider/country/level/source metadata.
- Imported records remain distinct from provider-verified records.

### Scholarship Hunter
- Repository: https://github.com/Hami0095/scholarship-hunter
- Dataset: `scholarships_v2_enriched.json`
- Use: factual metadata and source/provider URLs.
- Third-party descriptive prose is not treated as authoritative.
- Imported records require provider/source review.

### Global Scholarships Directory — 3 October 2026
- User-supplied 337-programme directory.
- Repository snapshot: `src/data/globalScholarshipsDirectory20261003.json`.
- The source itself states that coverage is general and that deadlines, eligibility, award values and whether a programme is running can change by cycle.
- Records imported from this directory are `needs_review` and use a deadline-to-verify state until provider evidence is attached.

### StudyInChina
- Repository: https://github.com/computersciencefreshmen/StudyInChina
- Dataset: `content/data/scholarships.json`.
- 2026 dataset with official/application URLs and source verification timestamps.
- The imported snapshot had passed its source review-after dates by October 2026, so AfriGrantPipeline imports eligible unique records as `needs_review`, not as freshly verified.

## Data-quality rules

1. Do not create synthetic scholarship rows simply to hit a catalogue-size target.
2. Deduplicate by stable fingerprint, source/application URL, and normalized scholarship title where possible.
3. Preserve source provenance.
4. Treat imported catalogue records as discovery leads until current provider evidence supports stronger verification.
5. Never describe an unknown or stale deadline as currently open.
6. The paid CV matcher may screen catalogue records, but users are still told to confirm current eligibility, deadlines, coverage and application routes with the provider.

## Commercial matcher

The public flow is:

1. Upload CV and choose target study level.
2. The agent extracts scholarship-relevant profile signals.
3. The server screens the catalogue and returns only the match count/readiness summary.
4. Scholarship titles, provider details, fit scores and application/source links remain protected.
5. A verified Paystack payment of NGN 5,000 or USD 5 unlocks the matched records for the match session.


### Open Opportunity Index
- Repository: https://github.com/JuanPabloRoldan/open-opportunity-index
- Use: current factual programme metadata and official provider URLs for globally accessible scholarships/fellowships.
- AfriGrantPipeline imports only records whose eligibility scope can be safely represented by the current matcher; nationality/demographic-restricted records are excluded unless their restriction can be tested.
- Imported records remain `needs_review` even when the upstream index records a recent verification date.

### Scholar Departures
- Repository: https://github.com/Jisco1/scholar-departures
- Dataset: `data/data.json`.
- Use: recent programme metadata with official links and 2026 source-check dates.
- University tuition listings are not treated as scholarships; only scholarship/fellowship programme records are eligible for import.


### Collection Scholarship — filtered 2026 international subset
- Repository: https://github.com/FajarHadi1/collection-scholarship
- Dataset: `src/data/scholarships.ts`.
- AfriGrantPipeline imports only future-dated records with an overseas/global signal, a provider/application URL, explicit international/foreign eligibility wording, and no Indonesia-only wording.
- Imported rows are marked `needs_review`; upstream deadline/status values are retained only as source metadata until the provider page is checked.
