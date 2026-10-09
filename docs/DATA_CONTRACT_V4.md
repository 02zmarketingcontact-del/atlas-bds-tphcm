# ATLAS V4 - Data contract
Scope: HCMC and neighbouring apartments: primary resale, secondary resale, rental. No industrial products in V4.

## Tables
- projects: id, official_name, aliases, legal_developer, brand_developer, historical_geography, current_geography, lat, lng, coordinate_accuracy, source, reviewed_at
- project_phases: phase_id, project_id, launches, units_launched, handover, milestones, evidence
- offers: unit_id, market_type (primary/secondary/rent/rent_demand), asking_price, currency, gross/net_area, area_basis, lease_terms, listing_date, last_checked, status, permissions, source
- price_observations: series_id, project_id, region_id, price_type (asking/executed/estimated), scope, period, value, unit, median_or_mean, sample_size, source, confidence, approved_by
- market_statistics: region_id, quarter, primary_launches, secondary_offers, absorbed, rental_stock, methodology, citation
- ownership: legal_entity, foreign_partner, foreign_capital_evidence, equity_share_as_of, foreign_buyer_eligibility, remaining_quota_evidence (distinct fields)
- planning_layers: source_authority, resolution, legal_document_number, effective_date, legal_status, polygon_geojson, permitted_uses
- transport_layers: line_name, status (operational/planned/proposed), precise_geometry_source, year, document, last_checked
- evaluations: project_id, persona (owner/investor/tenant), criterion, weighting, evidence, score, confidence, assessment_date
- source_rights: owner, URL, permission_scope, attribution, accepted_use, last_checked
- job_logs: source_id, started_at, fetched, changed, approved, rejected, errors.

## Historical foundation (2011-2026)
For each historical period record the number of launched apartments, project announcements, primary and secondary pricing separately, rentals, absorption, macro affordability and important planning developments. Never infer unobserved years. Never merge different report definitions into one series without a defined adjustment. Retain historical geography boundaries and reconcile the post-2025 boundaries explicitly.

## Publication gates
Every published claim gets source, scope, period, method, permission, verified_at and quality grade. Asking prices never masquerade as executed transactions. Separate foreign-funded developers from verified foreign-buyer eligibility. Defer scores rather than invent numbers for missing evidence. Do not upload client PII, private listings or API credentials to public GitHub Pages.

## GIS
GeoJSON WGS84 only, EPSG:4326. Maplibre and OpenFreeMap vector baseline; user-supplied GeoJSON is temporary and unverified. Sample Metro 1 is schematic from legacy ATLAS coordinates, not official geometry. Official planning layers remain empty until a usable legally attributable GIS source is inspected.
