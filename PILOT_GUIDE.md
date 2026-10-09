# Atlas customer-first pilot
The main map now offers MUA BÁN and CHO THUÊ. These markets have separate records. No sale prices are used as rent estimates.
- data/projects.json: 32 initial sale project prices, not independently verified.
- data/rent_listings.json: empty until licensed, verified rental inventory is provided.
- data/project_candidates.json: 20 research leads; they are not published as active listings.
- data/feeds/source_registry.json: no authorized external feeds configured.
- data/update_status.json: price synchronization not configured.
Daily GitHub Actions validates existing records; it does not scrape or update external prices. Add legal feed permissions, historical observations, deduplication and human review before an automated price publishing pipeline.
To add rentals, include a unique ID, valid project_id, area, monthly rent, bedrooms, source URL and permission reference, observed_at, confirmed_at, availability_checked_at, verified=true and availability=confirmed_available. Never publish tenant details or private inventory in the public repository.
Run: node scripts/validate-data.mjs
