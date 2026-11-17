# Global Feature Matrix 25 — QILUVI / 09-10-2026

Owner: CPO + Independent Risk Auditor. Scope: HCMC/adjacent apartments ONLY. **This is a feature feasibility matrix, not confirmed parity of each competitor.** Platform URLs point to benchmark candidates; some are page-level examples, not a fully tested feature path. See GLOBAL_BENCHMARK_2026-10-09.md for confirmation C0/C1/C2.

| # | Feature specification / study target | Responsible stream | Priority | Decision | Evidence level² | Customer value | Engineering complexity | Assumed development cost¹ | Platform reference URL |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | Inventory coverage | DATA-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.leju.com.tw/) |
| 2 | Primary-market offer | PRICE-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.591.com.tw/) |
| 3 | Secondary-market offer | PRICE-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.591.com.tw/) |
| 4 | Rental inventory | PRICE-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.591.com.tw/) |
| 5 | Actual transactions | PRICE-01 | P0 | ADAPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://rt.molit.go.kr/) |
| 6 | Asking price history | MARKET-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.redfin.com/news/data-center/methodology/) |
| 7 | Source update freshness | DATA-02 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.redfin.com/news/data-center/methodology/) |
| 8 | Address and coordinate accuracy | GIS-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | High | $0.3–2k¹ | [Evidence](https://www.reinfolib.mlit.go.jp/) |
| 9 | Building/phase history | DATA-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://lifullhomes-index.jp/building-list/mansion/tokyo-pref/) |
| 10 | Evidence provenance | DATA-02 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.reinfolib.mlit.go.jp/) |
| 11 | Valuation method | INVEST-01 | P1 | ADAPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://www.zillow.com/zestimate/) |
| 12 | Valuation error transparency | INVEST-01 | P1 | ADAPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://www.zillow.com/zestimate/) |
| 13 | Foreign-buyer legal status | LEGAL-01 | P0 | ADAPT | C1 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.reinfolib.mlit.go.jp/) |
| 14 | Developer and legal entity | LEGAL-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.leju.com.tw/) |
| 15 | Official planning GIS | GIS-01 | P1 | ADAPT | C2 | better due diligence | High | $0.5–4k¹ | [Evidence](https://www.reinfolib.mlit.go.jp/) |
| 16 | Transit proximity/routing | GIS-01 | P1 | ADOPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://suumo.jp/ms/chuko/tokyo/) |
| 17 | Amenities/healthcare/schools | GIS-01 | P2 | LATER | C2 | optional engagement | Low–Medium | $0.5–4k¹ | [Evidence](https://www.homes.com/) |
| 18 | Resident reviews moderation | PRODUCT-01 | P2 | LATER | C2 | optional engagement | Low–Medium | $0.5–4k¹ | [Evidence](https://www.homes.com/) |
| 19 | Apples-to-apples comparison | INVEST-01 | P0 | ADOPT | C2 | direct trust / decision prerequisite | Medium | $0.3–2k¹ | [Evidence](https://www.leju.com.tw/) |
| 20 | Mortgage and cash-flow calculator | INVEST-01 | P1 | ADOPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://www.zillow.com/zestimate/) |
| 21 | Vietnamese-English-Chinese localization | PRODUCT-01 | P1 | ADOPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://www.591.com.tw/) |
| 22 | Responsive mobile and accessibility | PRODUCT-01 | P1 | ADOPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://www.homes.com/) |
| 23 | AI evidence-cited assistant | PRODUCT-01 | P2 | LATER | C1 | optional engagement | High | $0.5–4k¹ | [Evidence](https://www.zillow.com/zestimate/) |
| 24 | Security/privacy and data rights | TRUST-01 | P1 | ADOPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://www.redfin.com/news/data-center/methodology/) |
| 25 | Research-to-contact journey | BIZ-01 | P1 | ADOPT | C2 | better due diligence | Low–Medium | $0.5–4k¹ | [Evidence](https://www.homes.com/) |

¹ Rough software implementation labor only at prototype scale, USD, one-time, excluding data licensing, review, hosting, ops, third-party legal opinions and ongoing GIS. These are **planning allowances, not bids**: 1 developer at $20–40/hour, feature 15–100 hours subject to dependency, not additive until architecture approved. Real budgeting needs technical scope & provider quotations. 

² **C2** = evidence of platform capability/menu/page; **C1** = reference only/incomplete verification; **C0** = blocked. These are *reference confidence* levels, not proof of implementation at QiMap. Checked 09/10/2026. The matrix deliberately has no aggregate scores or invented competitor completeness grades.

## Feature acceptance rules
- DATA-01: stable project/phase/tower IDs, collision tests, 0 phantom apartment-level assertions.
- DATA-02: every published fact points to source_id, doc date, observed_at, permission, method, review status; conflict queue never silently overwrites.
- PRICE-01: primary, resale, rent and transaction types cannot combine; observed asking != closed deal; no invented price timestamps.
- LEGAL-01: foreign eligibility, project approval, remaining quota and FDI investor are distinct fields; missing evidence -> UNKNOWN; reviewer gate.
- MARKET-01: historical periods anchored to source/report/geography; no interpolation; no old/new municipal boundary blending.
- GIS-01: source-verified coordinates; actual route travel time not straight-line; planned vs operational transit explicitly labeled.
- INVEST-01: editable assumptions, gross/net rental yield formula, sensitivity, empty/not-available on absent trusted inputs.
- PRODUCT-01: real mobile device smoke and foreign-language terminology review.
- TRUST-01: no customer PII/secrets in public GitHub; publish audit trail only after permission check.

**Dependency order:** evidence rights → canonical IDs → accepted data → searchable dossier → fair comparison / financial model → optional AI. Weighted priority formula remains decision support, never overrides legal/security gates.
