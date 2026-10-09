# QILUVI / QiMap — P0 apartment data audit and evidence intake
Audit date: **2026-10-09** (ICT)  
Branch: `feat/p0-apartment-evidence-20261009`  
Disposition: **RESEARCH CANDIDATES ONLY — requires human/source-rights review before publication**

## 1. Recomputed baseline (GitHub main at audit)

| Measure | Observed | Interpretation |
| --- | ---: | --- |
| Searchable project/phase records | 150 | NOT 150 independent legal project identities |
| Existing map project records | 32 | Includes legacy approximate/unverified positions |
| Archive-only records without a map pin | 118 | Do not invent pins |
| Legacy coordinates flagged checked | 3 | Flags not a fresh independent GIS audit |
| Independently price-verified mapped records | 0 | Legacy 32 price bands are not certified |
| Historical market observations | 28 | Primarily broad market figures/index/counts; NOT a project-level 2006–2026 price curve |
| Approved apartment-level sales prices/rental offers | 0 | `data/price_history.json` is `{}`; `data/rent_listings.json` is `[]` |
| Official developer monitoring list | 32 | Official domains/portfolios are not equivalent to legal-owner evidence |
| Existing `source_catalog.json` references | 12 | Mostly market research, GIS and transport |
| Licensed automated apartment price sources | 0 | `data/update_status.json` says `not_configured` |

Data coverage in `data/project_dossiers_v1.json` (150 records): 146 missing/unverified land area; 148 residential unit count; 144 handover year; 150 legal owner; 150 foreign buyer eligibility; 150 verified price; 150 rental offer. "evidence_or_claim_recorded" may be SOURCE-REPORTED; it is not independent verification.

## 2. P0 evidence intake: seven projects

This PR enriches publisher-**reported** facts, not approved investor-grade facts:

| Project | Source-based intake | Important qualification |
| --- | --- | --- |
| The Privé | Existing 6.7ha/12 towers/3,175 project records; new attributed floor/building metrics and June 2027 planned first handover, total completion plan 2028; historical alias `Gem Riverside`, `Datxanhhomes Riverside` | Bluemarq/Dat Xanh brand, marketing owner and legal owner are distinct questions; no signed buyer-contract date proven |
| Eaton Park | 3.7ha, six towers, 2,052 **total products** itemized as 1,968 regular apartments, 12 penthouses, 52 shops and 20 shophouses; planned handover 2027 | No mixing residential apartment units with commercial products |
| The Felix | Developer-page 9,465m2, 1,147 residential apartments and distinct 59 accommodation/10 commercial units; 40 floors and 45–85m2 apartment span | Other portal counts conflict; do not overwrite issuer number without checking primary permits |
| Norton Park | Gamuda-hosted June 2026 press reports 7.9ha, 6 towers, **over** 1,200 apartments plus 30 commercial units; source connected to the existing daily issuer monitor | June 2026 expected introduction by late 2026, not a proven launch or original developer price |
| Sycamore | CapitaLand 18.9ha; approx 3,500 mixed low/mid/high-rise residences, not apartment-only supply; reported partnership with UOA | Legacy reference to Becamex needs corporate/legal-relationship reconciliation |
| The Win City | 13.18ha, 18 towers and three marketing phases, approx 6,000 total products (mixed uses) | Project belongs to **Tây Ninh / Long An former region**, OUTSIDE current HCMC territorial price aggregates |
| Elysian | 2.8ha, four towers, 1,398 apartments plus 8 shophouses; documented sales launch **27 July 2025** and handover planned in 2027 | Marketing average 68m VND/m2 around launch is only a reported historical asking quote, not a confirmed transaction |

All added fields include full source URLs and keep `publisher_claim_requires_document_review`. Do not treat an issuer press reprint as a primary legal document.

## 3. Three additional developments discovered outside existing 150-name index

- **LUMIÈRE Midtown** — Masterise Homes corporate microsite: two towers / 808 apartments, planned 2027 handover, inside The Global City, former district 2 (HCMC). [Source](https://masterisehomes.com/the-global-city/lumiere-midtown/).
- **Masteri Grand View** — Masterise Homes corporate The Global City microsite, two high-rises, unit count and separate legal project ID not verified. [Source](https://masterisehomes.com/the-global-city/vi/masteri-grand-view).
- **ANesta / eNesta** — Gamuda-hosted press description: 761 apartment units, Tân Vạn area, former Bình Dương. Third-party commercial pages disagree (761 versus 769), and exact parcel is not confirmed. [Source](https://gamudaland.com.vn/vn/news/news-and-story-37).

These are discovery candidates ONLY. They do not alter 150 published index records, cause false deduplication, or produce new pins.

## 4. Price source and candidate research

- `data/market_source_registry_v1.json`: six platforms, all **LICENSE_REQUIRED** for automated collection; no authenticated API, feed, bulk rights or media license confirmed; Facebook not connected.
- `data/p0_market_price_candidates_20261009.json`: five short attributed **portal summary price bands** for Privé, Eaton, Felix, Sycamore and Win. Individual listing identities, primary/secondary segments and de-duplicated unit counts are NOT available from those summary bands. A sixth candidate is the Gamuda-hosted historical press quote of ~68m VND/m2 around Elysian's July 2025 opening.
- Each candidate records what is known: portal last-listing date, source, price unit, listed count, review status, reuse rights and limitations; no claimed independently verified transaction, no claimed active licensed feed, no conversion of portal counts into independent-unit counts.
- Batdongsan project pages can contain an internally inconsistent main price range vs FAQ range and generic historical rental chart placeholders. **Never import that historical graphic as a true project price series**, especially for future/not-yet-handover towers.

### Required gate to promote a price into investor-grade display

1. Source rights and storage/republication rules legally cleared.
2. Map project/phase/tower and apartment-only asset type established.
3. Area basis/currency/fees and observation time established.
4. 5+ **distinct** nonduplicate units and preferably 2+ truly independent providers, otherwise `LOW_SAMPLE`.
5. Separate publisher primary offers, brokerage primary offers, resale asks, actual documented trades, rental asks and confirmed leases.
6. Human/expert approval where needed. For zero samples, continue to show `MISSING`, not a fabricated 7/30/90-day trend.
7. Preserve snapshots and gaps; **never interpolate 2006–2026 years without evidence**.

## 5. GIS / location exceptions

Seven existing legacy P0 map points are held in `data/p0_gis_review_20261009.json`. **0 new GIS verifications; 0 additional published pins.** Keep old/new locality descriptions separate, verify legal parcel and per-tower coordinates before promotion. In particular, older Trường Thạnh and newer Long Phước descriptions for Elysian may denote jurisdiction change, not physical relocation. Norton has inconsistency in corporate English versus Vietnamese geography labeling that requires field checking. The Win City is excluded from HCMC in-region aggregates.

## 6. Existing automation, no duplicated workflows

Existing scheduler: daily official issuer monitor `atlas-developer-daily.yml` (checks authorized corporate publishers and stages unverified hints); weekly official developer research and history-gap runs; existing daily data QA and live-smoke. **No functioning licensed price ingestion** exists and source `update_status.json` remains honestly `not_configured`.

Added one **validation step in the existing** `atlas-data-qa.yml` workflow, using `scripts/validate-p0-research.cjs` to check:
- All seven dossier IDs, unchanged public map price flags and unchanged 150-index project count;
- Portal candidates remain unapproved, unmatched, unlicensed and explicitly attributed;
- No new unverified map pins or coordinates promoted to VERIFIED;
- Market registry does not falsely claim licensed automatic ingestion;
- New discovery candidates have not been silently published.

No workflow duplicated, no live production merge, no token/credential collection, no bulk scraping.

## 7. Operational next steps

**Day 1–7:** Manual source/rights review for The Privé, Eaton, Felix and Norton; obtain original authority/issuer page and parcel/title records; request licensed price feeds or partner-provided inventories. Complete checks on the three new project identities. Support 2–3 separate unit-price observations per genuinely permitted primary/secondary/rental source before any aggregate. Review conflicts: Felix unit totals, Sycamore UOA/Becamex relationship, ANesta 761/769 and Norton broker-vs-issuer pricing.

**Day 8–30:** Expand historical commune/district-by-district index across former HCMC before widening former Bình Dương/BRVT; use multiple aliases and project-parent grouping. Build per-unit legal ingest/matching/dedup records only once access rights exist. Prioritize apartment projects completed after 2006, with distinct launch/HĐMB/handover milestones.

**Day 31–90:** After sufficient data rights and evidence, automate permitted monitoring into staged immutable price snapshots and project timeline, with review and rollback. Add project- and cohort-level price curves with visible evidence gaps, source ages, sample counts, and independent price classifications. Track quality and cost per accepted fact, NOT crawler runs.

## 8. Related existing GitHub issues (avoid duplication)

- #19 source rights and legal acquisition.
- #52 118 missing GIS/map position validations.
- #53 150-project resale and rent proof.
- #54 broaden issuer watch to the full universe.
- #38 and #34 historical market/price 2006–2026.
- #61 evidence intake and conflicting facts pipeline.
- #64 daily trust scorecard.

## 9. Follow-up approvals/blockers

1. Existing market platforms have **no proven contract/API/republication license**. This PR never claims otherwise.
2. No owner/Facebook credentials or admin-approved group access; `JOIN_BLOCKED`. Do not auto-join.
3. No authenticated transaction-price source, lease contracts, legal foreign quota or verified tower geocoordinates. These remain missing.
4. Primary developer websites and broker pages can conflict on exact unit count and financial terms; retain attributed candidates, do not automatically resolve.
5. The branch/PR needs successful CI and human review before publication or merging.

**Research success here = new source-linked candidate fields, new projects in a review queue and validated preservation of unknowns, NOT 100% coverage and not live price sync.**
