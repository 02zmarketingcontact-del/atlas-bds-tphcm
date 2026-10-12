# QILUVI / QiMap — Data Contract V1
**Effective proposal:** 2026-10-09 | **Version:** 1.0-draft | **Nature:** target schema; not a claim that migration has occurred.

## Principle
One fact = one observation + source + as-of date + measurement definition + verification status + permitted usage. Do not overwrite raw inputs or promote public listing asks into executed transactions.

## 1. Canonical entities

### A. `project` and `phase`
- `project_id` (stable slug/UUID), `canonical_name_vi`, `aliases[]`, `developer_entity_id` (nullable).
- `phase_id` (separate ID), `parent_project_id`, `building_identifiers[]`, `legal_name` and `legal_project_source_id`.
- `legacy_zone_id`, `current_zone_id`, `boundary_valid_from`, `site_address_vi`.
- `lifecycle_state`: announced / planning / under_construction / handover_claimed / handed_over_verified / unknown. Do not convert issuer-reported handover directly to independently verified handover.
- `geo`: WGS84 lat/lon and `geometry_source_id`, `geometry_precision`, `location_verified_at`, `location_verification`.
- `created_at`, `updated_at`, `reviewed_at`, `reviewer_ref`.
- Counting: a parent project may have multiple phases, so show explicit **project count** vs **project-or-phase records**.

### B. `source`
- `source_id`, `issuer_name`, `source_kind`: regulator / issuer / research_firm / real_estate_platform / broker / manual_observation / other.
- `url` or `document_ref`, `published_at`, `accessed_at`, `retrieved_checksum` when permitted, `citation_label`.
- `license_status`: granted / public_facts_with_attribution / restricted / unknown; `reuse_rules`, `expires_at`, `captured_by`.
- `source_quality_notes` and `conflicts[]`. A URL can verify a claim only within its actual contents.

### C. `price_observation`
- `observation_id`, `project_id`, optional `phase_id`, optional `unit_type` (studio/1BR/2BR/etc.).
- `market`: primary / secondary / rental.
- `price_basis`: developer_list / resale_asking / resale_closed_verified / rent_asking / rent_signed_verified. **No unverified transacted label.**
- `value_low`, `value_high`, `currency`, `unit`: VND_per_m2 / VND_per_unit / VND_per_month / VND_per_m2_month; area accounting must be described when comparable.
- `sample_size` nullable; `methodology`, `exclusions`, `offer_de_duplication_method`.
- `observation_date`, `published_at`, `imported_at` are three DIFFERENT timestamps.
- `source_ids[]`, `status`: unverified / source_attributed / independently_verified / rejected; `reviewed_at`, `verified_by`.
- `validity_window` nullable; all charts label market/metric/sample size/time window and type of price.

### D. `market_series` and `series_observation`
- `series_id`, `metric`: launch_supply / newly_sold_units / absorption_rate / primary_asking / secondary_asking / actual_transaction_verified / rent_asking / vacancy / other.
- `geographic_scope_id`, `boundary_version`, `period_granularity`, `definition`, `source_id`, `methodology_version`.
- `period_start`, `period_end`, `value`, `unit`, `observation_status`, `source_id`.
- **History 2011–2026 coverage matrix required:** each year/quartile must have explicit observed/missing/insufficient/comparability_break status.
- Never interpolate missing observations silently, sum incompatible geographies or merge price types. Add a visual discontinuity when source methods differ.

### E. `international_buyer_eligibility`
Four independent axes plus evidence:
1. `foreign_capital_investment_status`: confirmed / claimed / unknown.
2. `foreign_partner_relationship`: partner description and source; not a legal entitlement.
3. `project_eligible_for_foreign_ownership`: documented_yes / documented_no / unknown.
4. `unit_foreign_quota_availability`: confirmed_available / confirmed_unavailable / unknown.
Record `applicable_law_as_of`, `authority_document_id`, `developer_confirmation_source_id`, `last_verified_at`, `valid_for_phase_id`, `limitations`. “SPA” as user shorthand denotes eligible allocation for foreign buyers here, **not a guarantee of a completed sales contract**.

### F. `project_assessment`
- `assessment_id`, `project_id`, `persona`: end_user / investor / international_buyer.
- Dimensions: legal, price_comparability, location_access, completed_quality, running_cost, rental_evidence, liquidity_evidence, flood/externality, source_coverage.
- Each dimension `finding`, `evidence_ids[]`, `counterevidence_ids[]`, `confidence`, `unknowns[]`, `reviewed_at`.
- **No composite score if critical dimension missing.** Disclose whether QILUVI/QiMap/broker has listing or referral commercial relationship.

## 2. Source and trust label display contract
| Internal status | UI label VI | EN | 简体中文 |
|---|---|---|---|
| independently_verified | Đã kiểm chứng độc lập | Independently verified | 独立核验 |
| source_attributed | Theo nguồn công bố | Source-reported | 来源披露 |
| unverified | Chưa xác minh | Unverified | 尚未核验 |
| missing | Chưa có dữ liệu | Data unavailable | 暂无数据 |
| rejected | Không sử dụng | Rejected | 不予采用 |

The UI must not create a verified badge simply because an input has an official-looking link. A verified badge is scoped to **one claim**, not the entire project.

## 3. Safe legacy migration plan
- `data/projects.json`: preserve as read-only legacy input, map existing 32 `id` values into `project_id`; `min/max` retain `unknown_price_unit` until verified, even when priceBasis is `listings`; `priceVerified=false` remains false; `updated` ≠ observed price date.
- `data/project_search_index.json`: index 150 project/phase *name records*, preserving `map_project_id` or `research_id`; never invent coordinates or prices for archive-only records.
- `data/apartment_project_expansion_2006_2026.json`: treat issuer claims as claims; retain relations and source provenance.
- `data/price_history.json` empty means no approved price history in that source. It does **not** mean no historical market-source observations on other pages.
- `data/update_status.json`=`not_configured` means do not assert a verified automated price feed.
- Before production migration: write transform to new `data/v1/` paths, compare counts and references, validation tests, then change UI reads behind a reversible flag.

## 4. Data QA gates
1. `project_id` unique, nonempty; `phase_id` scoped consistently; all references exist.
2. No verified prices without source, observation date, unit and independent reviewer evidence.
3. No verified foreign buyer availability without source and as-of date; do not infer it from FDI involvement.
4. No mapped verified coordinate without verification provenance; fail if lat/lon out of WGS84 range.
5. No 2011–2026 line chart that conceals gaps or method breaks.
6. Validate legal permissions before copying/reprinting full third-party text, GIS layers or images.
7. Public `data/` must contain NO client contact details, contracts, partner commission sheets or private API credentials.

**Design constraint:** existing QiMap remains a review prototype; until price observations pass QA, show `Chưa xác minh` and avoid false precision.
