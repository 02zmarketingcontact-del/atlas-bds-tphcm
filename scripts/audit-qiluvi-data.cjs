#!/usr/bin/env node
'use strict';
/**
 * QiMap / QILUVI legacy data quality audit.
 * Usage: node scripts/audit-qiluvi-data.cjs [--json] [--check]
 *
 * This checks input integrity, not the truth of underlying market claims.
 * --check exits nonzero only on contradictions/errors, NOT on normal missing data.
 */
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const load = relative => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const projects = load('data/projects.json');
const archive = load('data/project_search_index.json');
const prices = load('data/price_history.json');
const update = load('data/update_status.json');
const records = archive.records || [];
const errors = [];
const warnings = [];
const error = (code, details) => errors.push({code, details});
const warn = (code, details) => warnings.push({code, details});
const truth = x => x === true;
const defined = x => x !== null && x !== undefined && x !== '';
const isDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(s);
const ids = (rows, key, what) => {
  const seen = new Set();
  for (const row of rows) {
    const id = row && row[key];
    if (!defined(id)) error('MISSING_ID', what);
    else if (seen.has(id)) error('DUPLICATE_ID', what + ':' + id);
    else seen.add(id);
  }
  return seen;
};
if (!Array.isArray(projects)) error('INVALID_PROJECTS', 'expected project array');
if (!Array.isArray(records)) error('INVALID_ARCHIVE', 'expected index.records array');
const projectIds = ids(Array.isArray(projects) ? projects : [], 'id', 'projects');
ids(Array.isArray(records) ? records : [], 'id', 'project_search_index');
for (const r of records) {
  if (r.map_project_id !== null && r.map_project_id !== undefined && !projectIds.has(r.map_project_id))
    error('BROKEN_MAP_REF', r.id + ' -> ' + r.map_project_id);
}
for (const p of projects) {
  if (!defined(p.source)) warn('MISSING_SOURCE', p.id);
  if (typeof p.lat === 'number' && (p.lat < -90 || p.lat > 90)) error('LAT_INVALID', p.id);
  if (typeof p.lng === 'number' && (p.lng < -180 || p.lng > 180)) error('LON_INVALID', p.id);
  if (truth(p.coordVerified) && (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)))
    error('GEO_VERIFIED_NO_COORD', p.id);
  if (truth(p.priceVerified) && (!defined(p.source) || !defined(p.priceDateVerified) || !isDate(p.priceDateVerified)))
    error('PRICE_VERIFIED_NO_SOURCE_DATE', p.id);
  if (truth(p.priceVerified) && !(Number.isFinite(p.min) && Number.isFinite(p.max)))
    error('PRICE_VERIFIED_NO_VALUE', p.id);
  if (Number.isFinite(p.min) && Number.isFinite(p.max) && p.min > p.max)
    error('PRICE_RANGE_REVERSED', p.id);
}
const marked = records.filter(r => truth(r.has_existing_map_marker)).length;
const archiveOnly = records.filter(r => !truth(r.has_existing_map_marker)).length;
const geoChecked = projects.filter(p => truth(p.coordVerified)).length;
const pricesChecked = projects.filter(p => truth(p.priceVerified)).length;
const hasPriceRangeUnverified = projects.filter(p =>
  !truth(p.priceVerified) && Number.isFinite(p.min) && Number.isFinite(p.max)).length;
const observed = projects.filter(p => defined(p.priceObservedAt)).length;
const indexCounts = archive.counts || {};
if (defined(indexCounts.combined_project_and_phase_records) &&
    indexCounts.combined_project_and_phase_records !== records.length)
  error('INDEX_COUNT_MISMATCH', 'combined_project_and_phase_records');
if (defined(indexCounts.mapped_projects) && indexCounts.mapped_projects !== projects.length)
  error('INDEX_COUNT_MISMATCH', 'mapped_projects');
if (marked !== projects.length) warn('MARKER_COUNT_DIFFERS', 'archive marked: ' + marked + ', map projects: ' + projects.length);
if (update.status !== 'configured' && update.status !== 'active')
  warn('AUTOMATED_PRICE_FEED_NOT_CONFIGURED', update.status || 'unknown');
if (hasPriceRangeUnverified) warn('UNVERIFIED_PRICE_RANGES', hasPriceRangeUnverified + ' project records show min/max but priceVerified=false');
if (!Object.keys(prices).length) warn('APPROVED_PRICE_HISTORY_EMPTY', 'price_history.json is empty');
if (geoChecked < projects.length) warn('UNVERIFIED_COORDINATES', (projects.length - geoChecked) + ' of ' + projects.length);
const report = {
  report_version: '1.0.0', audited_at: new Date().toISOString(),
  conclusion: errors.length ? 'INTEGRITY_ERRORS' : 'INTEGRITY_PASS_WITH_QUALITY_GAPS',
  notice: 'Passing integrity checks does NOT verify project claims or market prices.',
  input_paths: ['data/projects.json', 'data/project_search_index.json', 'data/price_history.json', 'data/update_status.json'],
  counts: {
    mapped_project_records: projects.length,
    indexed_project_or_phase_names: records.length,
    indexed_with_map_marker: marked,
    indexed_archive_only: archiveOnly,
    verified_coordinate_flags: geoChecked,
    independently_verified_price_flags: pricesChecked,
    unverified_price_ranges: hasPriceRangeUnverified,
    records_with_price_observation_dates: observed,
    price_history_root_keys: Object.keys(prices).length,
    automated_price_feed_status: update.status
  },
  integrity_errors: errors, quality_warnings: warnings
};
if (process.argv.includes('--json')) process.stdout.write(JSON.stringify(report, null, 2) + '\n');
else {
  console.log('QILUVI / QiMap data audit:', report.conclusion);
  console.log(JSON.stringify(report.counts, null, 2));
  for (const w of warnings) console.warn('WARN', w.code, w.details);
  for (const e of errors) console.error('ERROR', e.code, e.details);
}
if (process.argv.includes('--check') && errors.length) process.exitCode = 1;
