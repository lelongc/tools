"""Test extract_verification_code with various inputs"""
from utils import extract_verification_code

# Test 1: Subject thông thường (không có code)
print('=== Test 1: Subject without code ===')
r = extract_verification_code('Your temporary ChatGPT verification code')
print(f'Result: {r}')
print()

# Test 2: Body với code thực 
print('=== Test 2: Body with code after "code is" ===')
r = extract_verification_code('Your verification code is 123456. Use this to verify.')
print(f'Result: {r}')
print()

# Test 3: HTML email với boundary chứa số
print('=== Test 3: HTML with boundary number ===')
html = 'Content-Type: multipart/alternative; boundary="b1_abc202123def"\nThis is your code: 789012'
r = extract_verification_code(html)
print(f'Result: {r}')
print()

# Test 4: Chỉ có số 6 chữ số trong clean text
print('=== Test 4: Standalone 6-digit ===')
r = extract_verification_code('Please enter 654321 to continue')
print(f'Result: {r}')
print()

# Test 5: HTML với nhiều số
print('=== Test 5: HTML with hex and code ===')
html5 = '<div style="color: #f0a1b2"><span>Your code is 998877</span></div>'
r = extract_verification_code(html5)
print(f'Result: {r}')
print()

# Test 6: Email thực tế OpenAI (mô phỏng)
print('=== Test 6: Simulated OpenAI email body ===')
body = """
<html>
<head><style>.code{font-size:32px;}</style></head>
<body>
<table width="100%">
<tr><td>
<p>Your verification code is 202123</p>
<p>This code will expire in 30 minutes.</p>
</td></tr>
</table>
</body>
</html>
"""
r = extract_verification_code(body)
print(f'Result: {r}')
