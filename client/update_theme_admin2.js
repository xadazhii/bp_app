const fs = require('fs');
const file = './src/components/board-admin.component.js';
let content = fs.readFileSync(file, 'utf8');

// replace borders
content = content.replace(/border-slate-600/g, 'border-white/5');
content = content.replace(/border-slate-500/g, 'border-white/10');
content = content.replace(/border-slate-400\/30/g, 'border-white/10');

// replace some input backgrounds
content = content.replace(/bg-\[\#15203d\]/g, 'bg-[#15203d]'); // already done

// replace generic text-slate-300 with text-slate-200 in some places if needed
// replace modal headers
content = content.replace(/bg-slate-800(?![\/\-\w])/g, 'bg-[#0f172a]');
content = content.replace(/bg-slate-900/g, 'bg-[#0f172a]'); // For test details modal
content = content.replace(/bg-slate-800\/95/g, 'bg-[#0f172a]\/95');

fs.writeFileSync(file, content);
console.log('Theme refined.');
