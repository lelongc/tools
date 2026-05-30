import re

with open('content.js', encoding='utf-8') as f:
    c = f.read()

# Replace function y(e) to be fast
def repl_y(m):
    return '''function y(e) {
  return new Promise(t => {
    // fast mode
    setTimeout(t, 1000 * e);
  });
}'''

c = re.sub(r'function y\(e\)\s*\{\s*return new Promise\(t =>\s*\{\s*try\s*\{[\s\S]*?catch\s*\(err\)\s*\{\s*setTimeout\(t,\s*1e3\s*\*\s*e\);\s*\}\s*\}\);\s*\}', repl_y, c)

# Swap and increase the wait time
pattern = r'(chrome\.storage\.local\.set\(\{\s*operationStatus:\s*[\'"]successful[\'"]\s*\}\);)\s*(//.*)?\s*(await y\(\d+\);)'
c = re.sub(pattern, r'await y(25);\n                  \1', c)

with open('content.js', 'w', encoding='utf-8') as f:
    f.write(c)

print('Patched content.js!')
