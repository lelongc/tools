import requests
import random
import string
import time

# Đọc cấu hình từ config.yaml
from config import EMAIL_WORKER_URL, EMAIL_DOMAIN, EMAIL_ADMIN_PASSWORD
from email_service import create_temp_email, fetch_emails, parse_raw_email

def main():
    print("=== TEST TẠO EMAIL TẠM VÀ THEO DÕI OTP ===")
    email, jwt = create_temp_email()
    if not email:
        print("Không tạo được email tạm")
        return
        
    print(f"\n[BƯỚC 1] Email tạm mới tạo của bạn: {email}")
    print(f"JWT Token: {jwt}")
    print("\n[BƯỚC 2] Bạn hãy copy địa chỉ email trên và tự đăng ký ChatGPT thủ công trên trình duyệt của bạn.")
    print("Tôi sẽ liên tục kiểm tra hộp thư mỗi 5 giây để xem mã OTP gửi về là bao nhiêu...")
    print("Nhấn Ctrl+C để dừng kiểm tra.")
    
    try:
        seen_ids = set()
        while True:
            emails = fetch_emails(jwt)
            if emails:
                for mail in emails:
                    mail_id = mail.get('id')
                    if mail_id not in seen_ids:
                        seen_ids.add(mail_id)
                        print(f"\n📧 Có email mới (ID: {mail_id})!")
                        raw_content = mail.get('raw', '')
                        if raw_content:
                            parsed = parse_raw_email(raw_content)
                            print(f"   Người gửi: {parsed['sender']}")
                            print(f"   Tiêu đề: {parsed['subject']}")
                            print(f"   Nội dung: {parsed['body'].strip()}")
                        else:
                            print(f"   Người gửi: {mail.get('from')}")
                            print(f"   Tiêu đề: {mail.get('subject')}")
                            print("   Nội dung thô trống.")
            time.sleep(5)
    except KeyboardInterrupt:
        print("\nĐã dừng kiểm tra.")

if __name__ == '__main__':
    main()
