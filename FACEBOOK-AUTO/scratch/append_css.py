with open(r'd:\folder\tools\FACEBOOK-AUTO\schedual.css', 'a', encoding='utf-8') as f:
    f.write('\n\n/* Custom styles for time inputs */\n')
    f.write('.time-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }\n')
    f.write('.time-picker-group { flex-grow: 1; }\n')
    f.write('input[type="time"].form-control { min-width: 120px; font-size: 1rem; padding: 0.375rem 0.75rem; }\n')
    f.write('#onceTime { min-width: 120px; font-size: 1rem; }\n')
print("Appended CSS successfully!")
