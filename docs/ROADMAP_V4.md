# ATLAS V4 parallel build board

| ID | Track | Task | Acceptance | Sprint |
|---|---|---|---|---|
| MAP-01 | Map | Real vector basemap and raster fallback | Working interactive map, fallback and attribution | 0 |
| MAP-02 | Map | Map project markers | correct coordinate, verified vs estimate labels | 0 |
| MAP-03 | GIS | Official metro existing and proposed alignments | source, status, accurate geometry, distinct symbology | 2 |
| MAP-04 | GIS | Official planning/zoning layers | actual legal GIS data, authority, document date and attribution | 2 |
| MAP-05 | GIS | Distances and route estimates | verified route engine with units | 3 |
| DATA-01 | Data | Project, phase, unit and historic observation schemas | stable IDs, validation | 0 |
| DATA-02 | Research | 2006-2026 new launch timeline | each observation sourced and periodized | 1 |
| DATA-03 | Research | Historical comparable primary/secondary market series | scope, methodology, unit, sample count and gaps explicit | 1 |
| DATA-04 | Research | Rental data and rental yield series | real rent asks separated from forecast rent | 2 |
| DATA-05 | Research | Foreign capital and foreign buyer legal status | four independent claims with evidence | 1 |
| EVAL-01 | Analysis | Evidence-backed three-persona scoring | owner, investor, tenant; confidence and red flags | 1 |
| APP-01 | Frontend | 15-year market dashboard | historical timeline, selectable comparable series | 2 |
| APP-02 | Frontend | Project details/timeline and source inspector | project with real sources and missing-state disclosures | 2 |
| APP-03 | Language | VI, EN, CN simplified/traditional, KO, RU | reviewed terminology and legal glossaries | 3 |
| PIPE-01 | Ingestion | Source registry and permission matrix | no rights-unknown auto-republishing | 0 |
| PIPE-02 | Ingestion | Scheduled allowed-feed checks | import, dedup, quarantine, approve, changelog | 3 |
| QA-01 | Quality | Data validators | fail on impossible coord, date, unit, missing source | 1 |
| QA-02 | Quality | Responsive and browser tests | map, overlays and fallback checked on mobile/desktop | 3 |

Tracks advance in parallel: map, historical research, project master, evaluation, legal/permissions and tests. Preserve old V3 public root until V4 map and data pass acceptance checks.

## Twenty-year history expansion (2006-2026)
- [ ] HIST-01: Archive 2006-2009 launch projects and yearly market reports, mark missing quarters.
- [ ] HIST-02: Recover 2010-2014 apartment stock, launch and price series with source and methodology.
- [ ] HIST-03: Normalize 2015-2026 quarterly primary / secondary / rent observations, 2026 marked YTD.
- [ ] HIST-04: Create distinct price series for nominal VND/m², CPI-adjusted VND/m², and source-specific indexes.
- [ ] HIST-05: Build project launch-year cohorts; distinguish initial primary offering from comparable later secondary units.
- [ ] HIST-06: Annotate events and evidence-based market regimes without asserting an automatic 20-year cycle.
- [ ] HIST-07: QA historical geography definitions, especially before and after 2025 administrative changes.
