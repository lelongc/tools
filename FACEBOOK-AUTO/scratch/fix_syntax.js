const fs = require('fs');
let text = fs.readFileSync('schedual.js', 'utf8');

text = text.replace(/,try \{ r/g, ';try { r');
text = text.replace(/,if\(document\.getElementById\("cancelScheduleBtn"\)\)/g, ';if(document.getElementById("cancelScheduleBtn"))');

fs.writeFileSync('schedual.js', text, 'utf8');
console.log('Fixed syntax errors');
