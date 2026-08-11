"""
Look at the RAW structure around the first element in 1.scribe.
The element tag ends at 470 chars (/>) but ElementTree sees 62 attributes.
There must be MORE content after the /> closing.
"""
import zipfile

with zipfile.ZipFile(r'd:\folder\tools\short\longv1\proj\1.scribe', 'r') as z:
    good_raw = z.read('drawing.xml').decode('utf-8')

# Find the first <element and show 2000 chars after it
start = good_raw.find('<element ')
# Find the first /> after start
end1 = good_raw.find('/>', start)
print(f"First element start: {start}")
print(f"First /> at: {end1}")
print(f"Content between: {end1 - start} chars")

# But wait - maybe the element is NOT self-closing? Maybe it has children?
# Let's look at what comes AFTER the first />
after = good_raw[end1:end1+500]
print(f"\nAfter first />:")
print(repr(after[:200]))

# Actually, maybe I need to look for closing </element> tags?
has_closing = '</element>' in good_raw
print(f"\nHas </element> closing tags: {has_closing}")

# OK so it IS self-closing. The 470-char element only has drawingXML.
# But ElementTree parsed 62 attrs. Let me re-check...
# Oh wait - the element at index 0 from the find() might not be elem 0 from ElementTree.
# The ElementTree parser may reorder attributes or see them differently.

# Let me print the actual raw content from char `start` going forward for 600 chars
print(f"\nRaw content from first <element:")
print(good_raw[start:start+600])

# And find what's AFTER the first element's /> 
print(f"\n\nContent AFTER first element's />:")
content_after = good_raw[end1+2:end1+502]
print(content_after[:300])
