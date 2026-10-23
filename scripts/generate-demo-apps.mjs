// Lightweight, local SVG artwork for fictional showcase apps. Run with node scripts/generate-demo-apps.mjs.
import { mkdir, writeFile } from 'node:fs/promises';
const apps = [
  { name: 'Northstar', category: 'A little more focus.', color: '#1b2a80', pale: '#e9edf9', icon: '✦', rows: ['Design a first prototype', 'Read one chapter', 'Take a walk outside'], heading: 'Good morning, Alex', metric: '02 : 48', label: 'Your next focus session', note: 'One thing at a time.' },
  { name: 'Desk Note', category: 'Give your ideas a home.', color: '#eb691f', pale: '#ffeadf', icon: '✎', rows: ['The next big idea', 'Sketchbook / October', 'Things worth keeping'], heading: 'On your desk', metric: '12 ideas', label: 'A week of little discoveries', note: 'Make something of it.' },
  { name: 'Studio Hours', category: 'Better ideas, together.', color: '#0594cc', pale: '#def5ff', icon: '◎', rows: ['SwiftUI study group · 6 PM', 'Design studio · Thursday', 'Build & share · Friday'], heading: 'Around campus', metric: '6:00 PM', label: 'Tonight / SwiftUI study group', note: 'There is room for you.' },
  { name: 'Signal', category: 'Find your frequency.', color: '#c9083d', pale: '#ffe3eb', icon: '≋', rows: ['Golden hour / 12 tracks', 'After class / 8 tracks', 'A slower Sunday / 16 tracks'], heading: 'In your rotation', metric: 'SIDE A', label: 'A mix for the walk home', note: 'Stay a little longer.' },
  { name: 'Field Notes', category: 'A little closer to outside.', color: '#41b039', pale: '#e4f7e0', icon: '⌁', rows: ['Morning loop · 1.8 miles', 'A view worth the climb', 'Under the eucalyptus'], heading: 'The places you keep', metric: '1.8 mi', label: 'Your favorite neighborhood loop', note: 'Look a little closer.' },
];
const text = (x, y, value, size = 20, fill = '#252330', weight = 500) => `<text x="${x}" y="${y}" font-family="-apple-system,Arial,sans-serif" font-size="${size}" fill="${fill}" font-weight="${weight}">${value.replaceAll('&', '&amp;')}</text>`;
const plastic = (color) => `<defs><linearGradient id="plastic-color" x1="0" y1="0" x2=".65" y2="1"><stop stop-color="${color}" stop-opacity=".66"/><stop offset=".48" stop-color="${color}" stop-opacity=".92"/><stop offset="1" stop-color="${color}"/></linearGradient><linearGradient id="plastic-light" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".44" stop-color="#fff" stop-opacity=".22"/><stop offset=".49" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient></defs>`;
const wrap = (body, color, accent) => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720"><rect width="960" height="720" fill="${color}"/>${plastic(accent)}${body}</svg>`;
for (const [i, a] of apps.entries()) {
  const dir = new URL(`../public/apps/app-${i + 1}/`, import.meta.url);
  await mkdir(dir, { recursive: true });
  const cover = `<circle cx="780" cy="60" r="300" fill="${a.color}" opacity=".07"/><circle cx="50" cy="700" r="220" fill="${a.color}" opacity=".08"/><rect x="366" y="160" width="228" height="228" rx="54" fill="url(#plastic-color)" stroke="${a.color}" stroke-opacity=".5" stroke-width="3"/><rect x="370" y="164" width="220" height="220" rx="50" fill="url(#plastic-light)" stroke="#fff" stroke-opacity=".75" stroke-width="2"/>${text(480, 310, a.icon, 120, '#fff', 500).replace('x="480"', 'x="480" text-anchor="middle"')}${text(480, 476, a.name, 58, a.color, 750).replace('x="480"', 'x="480" text-anchor="middle"')}${text(480, 526, a.category, 24, a.color).replace('x="480"', 'x="480" text-anchor="middle"')}${text(48, 674, 'iOSC / FICTIONAL APP CONCEPT', 14, a.color, 650)}`;
  await writeFile(new URL('cover.svg', dir), wrap(cover, a.pale, a.color));
  for (let screen = 1; screen <= 2; screen++) {
    let ui = `<rect x="260" y="25" width="440" height="670" rx="45" fill="#fff" stroke="${a.color}" stroke-width="3"/><rect x="419" y="41" width="122" height="22" rx="11" fill="#252330"/>${text(294, 101, a.name, 16, a.color, 700)}${text(294, 148, screen === 1 ? a.heading : 'A moment for you', 27, '#252330', 700)}`;
    if (screen === 1) {
      ui += `<rect x="288" y="178" width="384" height="160" rx="22" fill="${a.pale}"/>${text(312, 218, 'TODAY / OCTOBER 19', 12, a.color, 650)}${text(312, 267, a.metric, 38, a.color, 700)}${text(312, 306, a.label, 16, a.color)}`;
      a.rows.forEach((row, j) => { ui += `<rect x="288" y="${362 + j * 76}" width="384" height="62" rx="16" fill="#f7f7fa"/><circle cx="316" cy="${393 + j * 76}" r="8" fill="${a.pale}" stroke="${a.color}"/>${text(338, 399 + j * 76, row, 16)}`; });
    } else {
      ui += `<rect x="288" y="178" width="384" height="295" rx="22" fill="url(#plastic-color)"/><rect x="289" y="179" width="382" height="293" rx="21" fill="url(#plastic-light)" stroke="#fff" stroke-opacity=".65"/><circle cx="480" cy="300" r="86" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>${text(480, 328, a.icon, 92, '#fff').replace('x="480"', 'x="480" text-anchor="middle"')}${text(480, 425, a.note, 21, '#fff', 650).replace('x="480"', 'x="480" text-anchor="middle"')}${text(294, 521, a.label, 19, a.color, 650)}${text(294, 554, 'A small step. A good place to start.', 17, '#656473')}<rect x="288" y="582" width="384" height="54" rx="27" fill="${a.pale}"/>${text(480, 616, 'Save this moment', 17, a.color, 650).replace('x="480"', 'x="480" text-anchor="middle"')}`;
    }
    ui += `<rect x="430" y="674" width="100" height="5" rx="3" fill="#252330"/>${text(30, 684, 'SAMPLE INTERFACE', 12, a.color, 650)}`;
    await writeFile(new URL(`screen-${screen}.svg`, dir), wrap(ui, a.pale, a.color));
  }
}
