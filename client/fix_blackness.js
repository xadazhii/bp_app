const fs = require('fs');
const file = './src/components/board-admin.component.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-slate-950/g, 'bg-[#0f172a]'); // Use #0f172a uniformly and if there's an outer wrapper use slate-900

fs.writeFileSync(file, content);
console.log('Fixed blackness.');
