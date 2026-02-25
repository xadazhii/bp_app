const fs = require('fs');
const file = './src/components/board-admin.component.js';
let content = fs.readFileSync(file, 'utf8');

// Replace standard tailwind class slate-950 which is nearly black #020617
// with the premium dark theme #0f172a (which is slate-900)
content = content.replace(/bg-slate-950/g, 'bg-[#0f172a]');

fs.writeFileSync(file, content);
console.log('Fixed blackness replacing slate-950 with #0f172a');
