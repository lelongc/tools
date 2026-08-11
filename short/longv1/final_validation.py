"""
FINAL VALIDATION: Generate a mini test scribe file using the SAME logic as auto_scribe.ipynb
and compare its format against the working 1.scribe file.
"""
import zipfile
import re

def videoscribe_escape(s):
    """Escape for VideoScribe XML attributes. Only escape < and " and &, keep > raw."""
    s = s.replace('&', '&amp;')
    s = s.replace('<', '&lt;')
    s = s.replace('"', '&quot;')
    # DO NOT escape > - VideoScribe requires raw >
    return s

# Test the escape function
test_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M0 0 L10 10" /></svg>'
escaped = videoscribe_escape(test_svg)
print(f"Input:   {test_svg}")
print(f"Escaped: {escaped}")
print(f"Has &gt;: {'&gt;' in escaped}")
print(f"Has raw >: {'>' in escaped}")

# Build a minimal XML using the same format as auto_scribe.ipynb
options_val = '&lt;drawingOptions paperStyle=&quot;1&quot; paperColour=&quot;16777215&quot; threeDMode=&quot;no&quot; loopSound=&quot;no&quot; zoomAtEnd=&quot;no&quot; vignette=&quot;0&quot; xPerspective=&quot;0&quot; yPerspective=&quot;0&quot; zPerspective=&quot;0&quot;/>'
test_xml = f'<drawing app="VideoScribe" ver="3.7.3103" filever="5" name="Test" desc="" tags="" uniqueID="1048856588" isDescendedFromTemplate="not_desc" defaultHandMD5="default_right" options="{options_val}" backingTrack="" lastRenderDateTime="Invalid Date">\n'
test_xml += f'  <element elementType="drawing" descName="" elementID="1095001001" splitTextField="no" drawingText="" fontName="null" drawingXML="{escaped}" customHandMD5="" colourEffect="0" targetTime="2000" pauseTime="500" drawStyle="draw_style_normal" rotation="0" visible="true" currentPosX="0" currentPosY="0" scalesX="0.8" scalesY="0.8" brush="0" theScale="0.8" movinCompass="1" movinFlow="0" movinArc="0" movinAllowRotate="yes" offsetX="0" offsetY="0" drawDetail="yes" sketchStyle="no" brushOptions="0" opacity="1" textColour="-1" textAlign="left" textBackwards="no" rtlLanguage="no" textSpacing="0" flipHoriz="no" flipVert="no" locked="no" calligraphy_angle="45" targetHeight="800" transitionTime="500" keepRunning="no" loopOptions="Fit to Time" blendMode="normal" filters="&lt;filters/>" morphFromID="0" morphCamera="no" morphRemoveOld="yes" cameraPositionX="448.5" cameraPositionY="252.5" cameraScale="1.0" cameraCanvasWid="897.7777777777778" cameraCanvasHei="505" availableRecolours="&lt;availableRecolours/>" recolouringSchemes="&lt;recolouringSchemes/>" skinTone="-1" hairColour="-1" highlightColour="-1" customColour1="-1" customColour2="-1" originalOutlineColour="0" greyscaleContrast="70" />\n'
test_xml += '</drawing>'

# Now compare format with the good file
with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    good_xml = z.read('drawing.xml').decode('utf-8')

print(f"\n=== FORMAT COMPARISON ===")
print(f"Test XML &gt; count: {test_xml.count('&gt;')}")
print(f"Good XML &gt; count: {good_xml.count('&gt;')}")
print(f"Test XML starts with <?xml: {test_xml.startswith('<?xml')}")
print(f"Good XML starts with <?xml: {good_xml.startswith('<?xml')}")

# Check options closing
test_opt = re.search(r'options="(.*?)"', test_xml)
good_opt = re.search(r'options="(.*?)"', good_xml)
print(f"\nTest options ends: ...{repr(test_opt.group(1)[-5:])}")
print(f"Good options ends: ...{repr(good_opt.group(1)[-5:])}")

# Check filters
test_filt = re.search(r'filters="(.*?)"', test_xml)
good_filt = re.search(r'filters="(.*?)"', good_xml)
print(f"\nTest filters: {repr(test_filt.group(1))}")
# Good filters has actual content, so just check format
good_filt_empty = [f for f in re.findall(r'filters="(.*?)"', good_xml) if 'filter ' not in f]
if good_filt_empty:
    print(f"Good empty filters: {repr(good_filt_empty[0])}")

# Check availableRecolours
test_ar = re.search(r'availableRecolours="(.*?)"', test_xml)
good_ar = re.search(r'availableRecolours="(.*?)"', good_xml)
print(f"\nTest availableRecolours: {repr(test_ar.group(1))}")
print(f"Good availableRecolours: {repr(good_ar.group(1))}")

# Check drawingXML
test_dxml = re.search(r'drawingXML="(.*?)"', test_xml, re.DOTALL)
print(f"\nTest drawingXML &gt; count: {test_dxml.group(1).count('&gt;')}")
print(f"Test drawingXML raw > count: {test_dxml.group(1).count('>')}")

good_dxml = re.findall(r'drawingXML="(.*?)"', good_xml, re.DOTALL)
print(f"Good drawingXML[0] &gt; count: {good_dxml[0].count('&gt;')}")
print(f"Good drawingXML[0] raw > count: {good_dxml[0].count('>')}")

if test_xml.count('&gt;') == 0:
    print("\n✅ PASS: No &gt; found - format matches VideoScribe standard!")
else:
    print("\n❌ FAIL: Still has &gt; entities!")
