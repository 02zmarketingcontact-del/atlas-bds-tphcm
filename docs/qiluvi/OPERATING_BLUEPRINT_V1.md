# QILUVI Execution Charter / 09-10-2026

Owner: Global CEO. In-scope: Vietnam apartments in HCMC and nearby only. Twelve independent *responsibility streams*, not twelve AI agents currently deployed. The role titles designate proposed accountability, NOT evidence of existing staff. Baseline 150 index records, 32 markers, 3 coordinate flags, 0 verified prices/rents, 28 historical observations in 2012–2019.

## Executive operating decisions
1. P0 means **data completeness with source and lawful re-use**, not adding features. First batch has 7 current P0 project records: The Privé, Eaton Park, The Felix, Norton Park, Sycamore, The Win City, Elysian.
2. Missing legal/price/quota outputs remain MISSING/UNKNOWN. Source-reported claims are not VERIFIED. A checked coordinate flag alone is not proof of precision.
3. Hourly/daily research jobs may produce review queues, never publish high-impact financial/legal claims without appropriate approval.
4. Canonical hierarchy: project → phase → tower → unit; every claim is scoped to correct entity ID/time/geography.
5. Governance statuses: VERIFIED; SOURCE-REPORTED; CONFLICTED; OUTDATED; MISSING; NOT-APPLICABLE; REJECTED. Include access state BLOCKED for tool operations.

## 12 workstream charters

### 1. GLOBAL-01 — Global Competitive Intelligence
**Accountable:** Global Research Director • **Priority:** P1 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** >=15 audited platforms / 5 regions, 3 journeys each or BLOCKED.
**Input sources:** official products, legal terms.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** GLOBAL_BENCHMARK, FEATURE_MATRIX.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #60; PR only from reviewed implementation branch.

### 2. DATA-01 — Project Registry
**Accountable:** Chief Data Officer • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** 150 entries reconciled into canonical project/phase/tower; duplicate audit.
**Input sources:** dossiers, issuer and government notices.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** canonical hierarchy; DATA-02.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #12 #50 #52; PR only from reviewed implementation branch.

### 3. DATA-02 — Evidence and Validation
**Accountable:** Chief Data Officer • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** source registry and claim-level evidence with version and conflict queue.
**Input sources:** official issuers, government, permitted partners.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** permission registry; DATA-01.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #19 #54 #61; PR only from reviewed implementation branch.

### 4. LEGAL-01 — Foreign Ownership Legality
**Accountable:** Vietnam Legal Director • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** no UNKNOWN project marked eligible; audit trail for positive claims.
**Input sources:** published ministry/province documents, legal reviews.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** DATA-01 and DATA-02.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #14; PR only from reviewed implementation branch.

### 5. MARKET-01 — 2006–2026 History
**Accountable:** Real Estate Research Director • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** coverage grid for all calendar years, explicit nulls, geography comparability.
**Input sources:** dated Savills/CBRE/government reports.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** DATA-02; stable region IDs.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #34 #38; PR only from reviewed implementation branch.

### 6. GIS-01 — GIS & Planning
**Accountable:** Head of GIS • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** 100% verified markers have location source; no fake planning shapes.
**Input sources:** official maps, licensed OSM.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** DATA-01, permission registry.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #4 #6 #52; PR only from reviewed implementation branch.

### 7. PRICE-01 — Primary/Secondary/Rent
**Accountable:** Chief Data Officer • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** asking/executed/modelled prices separated; 0 false verification.
**Input sources:** licensed feeds, consented offers.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** DATA-01+02, legal and source rights.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #39 #53; PR only from reviewed implementation branch.

### 8. INVEST-01 — Investment Analytics
**Accountable:** Chief Investment Analyst • **Priority:** P1 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** documented net-yield formula; missing data produces insufficient evidence.
**Input sources:** verified cost/input datasets.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** PRICE-01+LEGAL-01.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #63; PR only from reviewed implementation branch.

### 9. PRODUCT-01 — UX & Multilingual
**Accountable:** Chief Product Officer • **Priority:** P1 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** VI/EN/ZH terminology QA, mobile 390 px smoke, accessible navigation.
**Input sources:** user tests and approved dossier schema.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** DATA-01, LEGAL-01.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #17 #18; PR only from reviewed implementation branch.

### 10. QA-01 — Foreign Investor Red Team
**Accountable:** UX Research Director • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** each issue has reproducible steps, source, severity, retest.
**Input sources:** browser QA, test scripts.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** PRODUCT-01+DATA-02.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #21 #62 #64; PR only from reviewed implementation branch.

### 11. TRUST-01 — Security & Rights
**Accountable:** Independent Risk Auditor • **Priority:** P0 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** no secret or PII leaks, no unauthorised scraping, rollback/permissions.
**Input sources:** permissions registry, logs, vendor terms.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** all streams.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #19 #65; PR only from reviewed implementation branch.

### 12. BIZ-01 — Revenue & Partnerships
**Accountable:** Chief Growth Officer • **Priority:** P2 • **Scope:** apartment purchase/secondary/rental HCMC + adjacent. **Out:** other real-estate asset types.
**Goal:** test 10 interviews, economics and disclosed brokerage conflicts.
**Input sources:** consented user interviews, legal agreements.
**Smallest work unit:** one project/phase/field/source claim or one reproducible user journey, never “finish a whole database”.
**Tasks:** inventory gaps → acquire permitted source → parse candidate → normalize ID/time/unit → verify/conflict check → manual gate for sensitive claim → test → merge reviewed PR → monitor freshness.
**Dependencies:** trust+product.
**Tests / DoD:** evidence URL + dated scope, schema integrity, failure case, QA report, reviewer signoff for material legal/price claims; code merge alone not DONE.
**Metrics:** completed+approved unit count, sourced field %, independent verification %, critical defects and repair retest %, fresh-source delay.
**Risks:** broken links, entity alias collision, source license, overclaim and stale legal status.
**Planning allowance:** 2–6 person-days of engineering/research per mini-sprint, not procurement approval. Review daily source gaps; weekly review backlog.
**Tracking:** #65; PR only from reviewed implementation branch.


## 90-day roadmap (10 Oct 2026 – 7 Jan 2027)
| Window | Focus | Proposed exit gate |
|---|---|---|
| D01–D14 | Audit & dedup, source rights, P0 seven dossiers, schema for evidence, baseline CI | 150/150 identities audited for potential alias/phase; 7 complete source audits; clear rights register; no invented claims |
| D15–D30 | Official issuer coverage + location + legal evidence queue + dated price basis | 7 P0 dossiers with public/unknown fields, source provenance, approved facts; 30 sampled location investigations |
| D31–D60 | Expand first 30 priority dossiers, primary/resale/lease separate facts, backfill market history | 30 assessed dossiers not necessarily all fully VERIFIED; formal missing-data report; historical scope/granularity audited |
| D61–D90 | Investor compare, 3-language terminology QA, 5-country UX lab and economics pilot | 10 audited journeys with reproducible evidence, formula tests; pilot with documented conflicts; Trust review |

**Stop/go:** if licensed price sources or legal evidence cannot be secured, do NOT invent them to meet numeric targets. Rebaseline coverage using actual counts weekly. Gate to investor-grade view only after proof.

## 12-month roadmap (illustrative)
- Months 1–3: 7 P0 dossiers → 30 evidence-audited dossiers, canonical registry and source rights.
- Months 4–6: 60 reviewed high-demand project entities (targets, not promises), area comparative series and legal guidance with approved sources; reserve missing where impossible.
- Months 7–9: full research universe identity pass; 100 location reviews; comparison and investor calculator measured on real users.
- Months 10–12: vetted data partnerships, reproducible longitudinal analytics and transparent B2B analytics monetization if validated. Avoid broad vertical expansion.

## Data architecture & governance
Static public JSON UI is present. Propose staged: `raw_sources` (immutable/restricted) → `fact_candidates` (derived with timestamp and license) → `claim_conflicts` → `approved_facts` (reviewer+version) → `public_read_api` (non-PII). Core tables: project, phase, tower, unit, geography_epoch, document/source, source_right, claim/version, price_observation, legal_evidence, review_decision, audit_log, workflow_run.

Keys must remain stable across migrations; no reassignment on alias rename. Publishing is atomic/versioned with rollback. Use Postgres/PostGIS after size/operational need justifies migration. Private mutation API is never served by static Pages; only dedicated server/auth with scoped credentials. Add alerts for network/API/token costs. Strict security: deny secret/PII in public Git.

## AI orchestration blueprint and budget
Workers: Discovery → Fetch/permission → Extract → Entity match → Verify → Conflict → Review → Publish → Watch. Rule-based/cheap model first for schema parsing and confidence; stronger model ONLY for ambiguous source comparisons under human review; research/legal reviewer always final gate. **No external model is assumed connected.** Conservative pilot assumption: 150 profiles × 10–25 source hits/month × average 2–8k model tokens/hit = 3–30 million tokens/month BEFORE retries; costs depend on actual model price, cache, search/license fees and browser/network usage, so hard cap + measured usage dashboard required. Example placeholder budget software prototype USD 100–500/month infra/API *excluding labor, legal consultation and licensed market data*; not a quotation, do not buy.

## Investor UX test cases
Personas: China yield buyer; Taiwan family relocation; Japan stable rent; Korea commute; USA FX-risk buyer; foreign newcomer unfamiliar with Vietnam laws. Each must search → filter → read dossier → trace ownership eligibility → compare → simulate cashflow → ask human/lead, on 390px Android and desktop. Assert: asking≠transaction; quota unknown shown; missing rent blocks yield claim; location route vs straight line distinguished; marketing sponsor explicitly marked; English and Chinese terminology independently reviewed. Record task success, time, broken step and screenshot only if real interactive browser available.

## Risk register, ordered
R01 CRITICAL: legal eligibility misrepresented; reviewer gate and official documentary source.
R02 CRITICAL: listing quoted as closed sale; price_type invariant, publication gate.
R03 HIGH: 150 project-phase entries displayed as 150 independently licensed developments; canonical dedup and clear metric.
R04 HIGH: coordinates approximate but used as verified location; source and precision checks.
R05 HIGH: rights/robots violation; permission registry and fetch deny-by-default.
R06 HIGH: outdated data timestamp treated as current; separate observed, checked, published timestamps.
R07 HIGH: dependency/CDN map outage; fallback tested in CI, add real device session test.
R08 MEDIUM: mixed pre/post-2025 geography in chart; versioned geographic epochs.
R09 HIGH: lead routing favors high-commission project; disclosure and ranking independence.
R10 CRITICAL: public repo leaked credentials/PII; secret scan & release gate.

## Decisions requiring CEO permission
- Approved budget and named reviewer for foreign buyer legal/quota claims.
- Data licensing/feed suppliers, terms and spending cap.
- Legal entity/brand ownership/website trust disclosures.
- Public beta investment-score policy and sponsored listing policy.
- Add hosted backend/user data only after privacy impact review.

## Source of truth, planned cadence, proof
Existing GitHub workflows automate some developer-page monitoring and CI; no assumption that all worker streams run unattended. Existing ChatGPT research-watch and investor-lab tasks require notification settings for delivered messages. Weekly metrics: source-coverage, field-verification %, dated rental/price series, approved legal evidence, checked locations, P0 issues and complete UX cases. GitHub issue links in each charter. 

**Current DoD:** architecture/charters are a proposal submitted for review, not deployed agent runtime, legal verification, or completed project dossiers.
