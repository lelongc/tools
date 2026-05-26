"""
Script debug để xem chính xác email OTP chứa gì, và extract_verification_code trả về gì.
Dùng để kiểm tra email mới nhất từ hộp thư.
"""
import requests
import time
import re
import json

from config import EMAIL_WORKER_URL, EMAIL_DOMAIN
from email_service import create_temp_email, fetch_emails, get_email_detail, parse_raw_email
from utils import extract_verification_code

def debug_existing_mailbox():
    """Kiểm tra mailbox hiện tại nếu có JWT token"""
    print("=== DEBUG EMAIL OTP EXTRACTION ===\n")
    
    # Tạo email mới để test
    email, jwt = create_temp_email()
    if not email:
        print("Không tạo được email")
        return
    
    print(f"Email: {email}")
    print(f"JWT: {jwt}")
    print(f"\n{'='*60}")
    print("Hãy dùng email này để đăng ký ChatGPT THỦ CÔNG.")
    print("Script này sẽ theo dõi và phân tích email OTP nhận được.")
    print(f"{'='*60}\n")
    
    seen_ids = set()
    try:
        while True:
            emails = fetch_emails(jwt)
            if emails:
                for mail_item in emails:
                    mail_id = mail_item.get('id')
                    if mail_id in seen_ids:
                        continue
                    seen_ids.add(mail_id)
                    
                    print(f"\n{'#'*60}")
                    print(f"📧 EMAIL MỚI (ID: {mail_id})")
                    print(f"{'#'*60}")
                    
                    # === RAW CONTENT TỪ LIST API ===
                    raw_content = mail_item.get('raw', '')
                    print(f"\n--- [RAW từ list API] (độ dài: {len(raw_content)}) ---")
                    if raw_content:
                        # In 500 ký tự đầu
                        print(raw_content[:1000])
                        print("... (truncated)" if len(raw_content) > 1000 else "")
                        
                        parsed = parse_raw_email(raw_content)
                        print(f"\n--- [PARSED từ raw] ---")
                        print(f"  Subject: {parsed['subject']}")
                        print(f"  Sender: {parsed['sender']}")
                        print(f"  Body (500 chars): {parsed['body'][:500]}")
                        
                        # Test extraction
                        print(f"\n--- [EXTRACT TEST từ subject] ---")
                        code_from_subject = extract_verification_code(parsed['subject'])
                        print(f"  => Code từ subject: {code_from_subject}")
                        
                        print(f"\n--- [EXTRACT TEST từ body] ---")
                        code_from_body = extract_verification_code(parsed['body'])
                        print(f"  => Code từ body: {code_from_body}")
                    else:
                        print("  (trống)")
                    
                    # === DETAIL API ===
                    print(f"\n--- [DETAIL API] ---")
                    detail = get_email_detail(jwt, mail_id)
                    if detail:
                        print(f"  Keys: {list(detail.keys())}")
                        for key in ['subject', 'from', 'source', 'html', 'text', 'content']:
                            val = detail.get(key, '')
                            if val:
                                print(f"  {key} (500 chars): {str(val)[:500]}")
                        
                        detail_raw = detail.get('raw', '')
                        if detail_raw and detail_raw != raw_content:
                            print(f"\n  Detail raw khác list raw! Độ dài: {len(detail_raw)}")
                            parsed_detail = parse_raw_email(detail_raw)
                            print(f"  Detail subject: {parsed_detail['subject']}")
                            print(f"  Detail body (500): {parsed_detail['body'][:500]}")
                            code_detail = extract_verification_code(parsed_detail['body'])
                            print(f"  => Code từ detail body: {code_detail}")
                    
                    # === FINAL: Tìm tất cả 6-digit numbers ===
                    full_text = raw_content
                    if detail:
                        full_text += str(detail.get('html', '')) + str(detail.get('text', ''))
                    
                    all_6digit = re.findall(r'\d{6}', full_text)
                    print(f"\n--- TẤT CẢ 6-DIGIT NUMBERS TRONG EMAIL ---")
                    print(f"  {all_6digit}")
                    
                    # Phân biệt đâu là boundary
                    boundary_matches = re.findall(r'boundary[^"]*?(\d{6})', full_text, re.IGNORECASE)
                    print(f"  Boundary-related: {boundary_matches}")
                    
                    non_boundary = [n for n in all_6digit if n not in boundary_matches]
                    print(f"  Non-boundary: {non_boundary}")
                    
            time.sleep(5)
    except KeyboardInterrupt:
        print("\nDừng.")

if __name__ == '__main__':
    debug_existing_mailbox()
