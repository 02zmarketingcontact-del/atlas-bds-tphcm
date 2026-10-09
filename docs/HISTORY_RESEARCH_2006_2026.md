# ATLAS | 20-year apartment-market research program (2006-2026)

## Objective and non-negotiable rules
Build a complete source-backed project-launch and market-history catalogue: primary/secondary apartment sales, rental asking prices and verified transactions where available, supply and sales, CPI-adjusted performance, and project cohorts. Twenty years is an analytical window, NOT proof of a 20-year recurring property cycle.

Each observation: stable ID, source URL, source rights, publisher, measurement dates, historical geography ID, definition/methodology, market type, unit and area basis, confidence, review decision, timestamp. No factual observations are inferred from missing years. 2026 remains YTD. SPPI index points cannot be silently transformed to prices per m2. HCMC old and new boundaries must stay separate.

## Parallel research workstreams

| ID | Period | Priority source discovery | Output and quality gate |
|---|---|---|---|
| ARCH-A | 2006-2009 | Savills and CBRE historical reports; documented developer launches; early city planning | Year-by-year project-launch events and research data, missing periods flagged |
| ARCH-B | 2010-2014 | Savills SPPI and quarterly research archives, official reporting, developer brochures | Quarterly source-specific price indices, launch and delivery timeline |
| ARCH-C | 2015-2021 | Developer corporate sites, Bộ Xây dựng, CBRE, Savills | Primary launches/sales by district and matched methodology; secondary/rent data as separate series |
| ARCH-D | 2022-2026 | Official quarterly market reports, permitted developer/listing data, national statistics and CPI | Quarterly series primary/secondary/rent, documented scope and sample size, HCMC 2025 administrative-boundary adjustment |

These tracks run independently and submit source-gated data PRs. No contributor is authorized to claim an entire year complete from one quarterly sample.

## Priority metrics
P0: project launch date, inventory launched and sold, Savills/CBRE proprietary price indices with publisher-specific series ID, handover timing, source URL.
P1: median primary asking VND/m2 and secondary asking VND/m2 by comparable project segment, rental asking price by bedroom/area/furnishing, vacancy/rental yield only with explicit sample.
P2: inflation-adjusted return, CPI, household income, mortgage rates, FX and total transaction-cost-adjusted returns with source and assumptions.

## Sources to search
- Savills Research Vietnam SPPI and HCMC apartment quarterly reports: https://www.savills.com.vn/ and https://pdf.savills.asia/
- CBRE Vietnam residential research: https://www.cbrevietnam.com/
- Ministry of Construction quarterly housing and real estate market reports: https://moc.gov.vn/
- National statistics office CPI: official statistical publications.
- Developer-issued corporate websites and dated launch announcements.
- Contemporaneous VietnamPlus, VOV and similar reporting for leads and minimal cited factual figures; prefer direct issuer source, and never copy whole tables or media without permission.

## Developer/project timeline
One stable project_id links legal developer, developer brand, capital/foreign partner separately, phase/tower, initial launch, later launch, handover and evidence, individual unit attributes, historical ASKING price, verified transaction price if available, asking rental price and scenario assumptions. Preserve the actual measurement dates and geography boundaries.

## Practical workflow and QA
1. Register discovery URL in source catalogue or GitHub issue; check data rights.
2. Extract minimal factual claims into candidate dataset, retaining raw time period and source.
3. Check source authority, publication date, comparable definitions, currency and square-meter basis.
4. Deduplicate project/event IDs; classify primary vs secondary vs rent vs index.
5. Submit sourced, unambiguous values in PR, with candidate vs approved status.
6. Run project, history, syntax and browser CI before merge.
7. Update history-coverage gap report weekly and retain missing years as gaps.
8. Notify in GitHub Progress Desk on completion; do not close an incomplete archival task due to partial observations.

## As of October 9, 2026
After Q4/2012 Savills SPPI = 89.6 index point backfill from a contemporaneous VietnamPlus article (Feb 26, 2013), the current historical dataset contains 28 observations covering 8 of 21 calendar years: 2012–2019. Thirteen calendar years still have no approved observation. This is not a complete 20-year price series.

Issue tracker:
- Historical source reconstruction: https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/34
- Primary developer-source research: https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/33
- Official zoning GIS/permission task: https://github.com/02zmarketingcontact-del/atlas-bds-tphcm/issues/32
