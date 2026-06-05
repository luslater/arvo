const fs = require('fs');
let code = fs.readFileSync('/Users/lucasdematos/Desktop/ARVO/src/app/dashboard/bussola/page.tsx', 'utf-8');

// I will extract the blocks and reassemble them.
// Let's just use regex or split to grab the JSX parts.
// Actually, it's safer to just do a big replace on the `<div className="grid lg:grid-cols-[420px_1fr] gap-6">`
// Wait, I can just use sed or JS to replace the main layout structure.
