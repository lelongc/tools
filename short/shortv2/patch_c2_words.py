with open('c2.py', 'r', encoding='utf-8') as f:
    code = f.read()

old_global = '''        global LAST_GENERATED_SCRIPT, LAST_GENERATED_TOPIC, LAST_GENERATED_ANIME'''
new_global = '''        global LAST_GENERATED_SCRIPT, LAST_GENERATED_WORDS, LAST_GENERATED_TOPIC, LAST_GENERATED_ANIME'''

code = code.replace(old_global, new_global)

old_words = '''    # Build strict 2.0s duration timeline based on Gemini folder planning'''
new_words = '''    global LAST_GENERATED_WORDS
    LAST_GENERATED_WORDS = " ".join([chunk["text"] for chunk in word_chunks]) if word_chunks else script_text

    # Build strict 2.0s duration timeline based on Gemini folder planning'''

code = code.replace(old_words, new_words)

with open('c2.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated c2.py with LAST_GENERATED_WORDS!")
