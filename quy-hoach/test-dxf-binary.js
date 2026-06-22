const DxfParser = require('dxf-parser');
const parser = new DxfParser();

try {
    const dxf = parser.parseSync("\x00\x01\x02\x03\x04\x05");
    console.log("Parsed binary:", dxf);
} catch (e) {
    console.log("Error parsing binary:", e.message);
}
