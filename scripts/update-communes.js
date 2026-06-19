const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const communes = [
  ['Bandalungwa', 25, 68, 'medium', 142],
  ['Barumbu', 52, 28, 'medium', 98],
  ['Bumbu', 38, 62, 'high', 165],
  ['Gombe', 48, 32, 'low', 420],
  ['Haute-Ntoto', 55, 22, 'low', 76],
  ['Kalamu', 42, 58, 'medium', 188],
  ['Kasa-Vubu', 35, 72, 'medium', 240],
  ['Kimbanseke', 82, 62, 'high', 210],
  ['Kinshasa', 58, 38, 'medium', 134],
  ['Kintambo', 32, 42, 'low', 156],
  ['Kisenso', 48, 78, 'high', 198],
  ['Lemba', 55, 68, 'medium', 172],
  ['Limete', 68, 42, 'high', 310],
  ['Lingwala', 58, 30, 'high', 195],
  ['Makala', 38, 48, 'medium', 148],
  ['Maluku', 88, 48, 'low', 89],
  ['Masina', 78, 55, 'high', 265],
  ['Matete', 72, 65, 'medium', 280],
  ["N'djili", 85, 38, 'high', 224],
  ['Ngaba', 62, 72, 'medium', 131],
  ['Ngaliema', 22, 35, 'low', 178],
  ['Ngiri-Ngiri', 45, 75, 'high', 152],
  ['Mont-Ngafula', 18, 55, 'low', 167],
  ['Selembao', 28, 82, 'medium', 143],
];

const mapZones = communes.map(([name, x, y, risk, infra]) => ({ name, x, y, risk, infra }));
const jsonPath = path.join(root, 'data', 'mock-data.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
data.mapZones = mapZones;
data.dashboard.stats.riskZones = mapZones.filter((z) => z.risk === 'high').length;
fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'js', 'mock-data.js'), `window.MOCK_DATA = ${JSON.stringify(data, null, 2)};\n`);
console.log('Updated', mapZones.length, 'communes');
