#!/usr/bin/env node
import fs from 'node:fs';
const read=(p)=>JSON.parse(fs.readFileSync(new URL('../'+p, import.meta.url),'utf8'));
const projects=read('data/projects.json'),rentals=read('data/rent_listings.json'),candidates=read('data/project_candidates.json'),registry=read('data/feeds/source_registry.json'),status=read('data/update_status.json');
const errors=[],fail=x=>errors.push(x),ids=new Set();
if(!Array.isArray(projects)||!projects.length)fail('Project catalog missing');
if(!Array.isArray(rentals)||!Array.isArray(candidates.candidates)||!Array.isArray(registry.feeds))fail('Data schema error');
for(const p of projects){if(!p.id||!p.name||ids.has(p.id))fail('Duplicate/missing ID: '+p.id);ids.add(p.id);if(!(p.min>0&&p.max>=p.min))fail('Bad sale range: '+p.id);if(!(Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=90&&Math.abs(p.lng)<=180))fail('Bad coords: '+p.id);if(p.priceVerified&&(!p.priceDateVerified||!String(p.source).startsWith('https://')))fail('Missing verified price evidence: '+p.id)}
const seen=new Set();
for(const r of rentals){if(!r.id||seen.has(r.id)||!ids.has(r.project_id))fail('Bad rental ID/project: '+r.id);seen.add(r.id);if(!(r.rent_vnd_month>0&&r.area_sqm>0))fail('Bad rental price/area: '+r.id);if(r.verified&&(!r.confirmed_at||!r.observed_at||!r.availability_checked_at||!r.permission_reference||!String(r.source_url).startsWith('https://')))fail('Missing rental evidence: '+r.id)}
for(const f of registry.feeds)if(!f.permission_reference||!f.id||!String(f.url).startsWith('https://'))fail('Missing authorized feed evidence');
if(status.status==='active'&&!registry.feeds.length)fail('False active feed state');
console.log('Projects:',projects.length,'Rentals:',rentals.length,'Candidates:',candidates.candidates.length,'Authorized feeds:',registry.feeds.length);
if(!registry.feeds.length)console.warn('No licensed price feed. Price synchronization remains inactive.');
errors.forEach(e=>console.error(e));if(errors.length)process.exit(1);console.log('PASS: data integrity check');
