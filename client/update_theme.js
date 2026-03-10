const fs = require('fs');
const file = './src/components/profile.component.js';
let content = fs.readFileSync(file, 'utf8');

// Replace standard backgrounds
content = content.replace(/bg-slate-800\/50/g, 'bg-[#0f172a]\/50');
content = content.replace(/bg-slate-800\/40/g, 'bg-[#0f172a]\/40');
content = content.replace(/bg-slate-800\/80/g, 'bg-[#0f172a]\/80');
content = content.replace(/bg-slate-800\/95/g, 'bg-[#0f172a]\/95');
content = content.replace(/bg-slate-800\/30/g, 'bg-[#0f172a]\/30');
content = content.replace(/bg-slate-800\/20/g, 'bg-[#0f172a]\/20');
content = content.replace(/bg-slate-800(?![\/\-\w])/g, 'bg-[#0f172a]');

// Replace borders
content = content.replace(/border-slate-700\/50/g, 'border-white\/5');
content = content.replace(/border-slate-700\/30/g, 'border-white\/5');
content = content.replace(/border-slate-700\/80/g, 'border-white\/5');
content = content.replace(/border-slate-700(?![\/\-\w])/g, 'border-white\/5');

// Additional visual polish
// Adjust hover backgrounds to match the new dark theme
content = content.replace(/hover:bg-slate-700(?![\/\-\w])/g, 'hover:bg-[#15203d]');
content = content.replace(/hover:bg-slate-700\/70/g, 'hover:bg-[#15203d]\/70');
content = content.replace(/hover:bg-slate-800(?![\/\-\w])/g, 'hover:bg-[#15203d]');

// Fix rounding on major cards
content = content.replace(/rounded-xl/g, 'rounded-2xl');

fs.writeFileSync(file, content);
console.log('Theme updated successfully.');
