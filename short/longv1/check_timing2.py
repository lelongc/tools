import zipfile
import re
with zipfile.ZipFile(r'proj\1.scribe', 'r') as z:
    xml = z.read('drawing.xml').decode('utf-8')
    m_t = re.search(r'targetTime="([^"]+)"', xml)
    m_p = re.search(r'pauseTime="([^"]+)"', xml)
    m_tr = re.search(r'transitionTime="([^"]+)"', xml)
    print(f'targetTime={m_t.group(1)}, pauseTime={m_p.group(1)}, transitionTime={m_tr.group(1)}')
