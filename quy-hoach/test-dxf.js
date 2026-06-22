const DxfParser = require('dxf-parser');

const parser = new DxfParser();

try {
    const dxf = parser.parseSync("junk data\nmore junk");
    console.log("Parsed junk:", dxf);
} catch (e) {
    console.log("Error parsing junk:", e.message);
}

try {
    const validDxf = `  0
SECTION
  2
ENTITIES
  0
LINE
  8
0
 10
0.0
 20
0.0
 30
0.0
 11
10.0
 21
10.0
 31
0.0
  0
ENDSEC
  0
EOF`;
    const dxf2 = parser.parseSync(validDxf);
    console.log("Parsed valid DXF entities:", dxf2.entities);
} catch (e) {
    console.log("Error parsing valid DXF:", e.message);
}
