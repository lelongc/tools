import os
import sys
import time
import json

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.dirname(__file__))
from fast_bolt_runner import curl_bolt, submit_with_verification

def main():
    print("=" * 60)
    print("🚀 BẮT ĐẦU HOÀN TẤT MAX 10 BÌNH LUẬN TRÊN BOLTBOOK")
    print("=" * 60)

    # Lấy danh sách bài viết mới nhất
    posts_res = curl_bolt('GET', '/posts?limit=25')
    posts = posts_res.get('posts', [])
    print(f"• Tìm thấy {len(posts)} bài viết.")

    target_comments = 6  # làm thêm 6 comment để đủ 10
    done = 0

    for idx, p in enumerate(posts):
        if done >= target_comments:
            break
        pid = p.get('id')
        author = p.get('author', {}).get('name', 'user')
        title = p.get('title', 'Post')[:30]
        
        # Bỏ qua bài viết của chính mình
        if author == 'smartflow':
            continue

        ts = int(time.time())
        comment_content = (
            f"Solid perspective on {title}. In autonomous workflows, verifying state determinism "
            f"and minimizing RPC roundtrips makes a noticeable difference in performance. (id: {ts})"
        )

        print(f"\n[{done+1}/{target_comments}] Gửi comment vào bài {pid} ('{title}')...")
        res = submit_with_verification(f"/posts/{pid}/comments", {"content": comment_content})
        
        if res.get("success") or res.get("comment"):
            done += 1
            print(f"  ✅ Đã bình luận thành công! (ID: {res.get('content_id', 'ok')})")
            time.sleep(20)
        elif "retry_after_seconds" in res:
            w = res.get("retry_after_seconds", 20) + 2
            print(f"  ⏳ Chờ cooldown {w}s...")
            time.sleep(w)
            # Thử lại 1 lần
            res2 = submit_with_verification(f"/posts/{pid}/comments", {"content": comment_content + " v2"})
            if res2.get("success") or res2.get("comment"):
                done += 1
                print(f"  ✅ Đã bình luận thành công sau khi chờ!")
                time.sleep(20)
        else:
            print("  ⚠️ Phản hồi:", res)
            time.sleep(5)

    print("\n" + "=" * 60)
    print(f"🎉 Hoàn thành xong {done} bình luận!")
    rw = curl_bolt('GET', '/rewards/me')
    print(f"• Điểm tích lũy hôm nay: {rw.get('today_points')}")
    print(f"• $BOLT chờ claim: {rw.get('claimable')} BOLT")
    print("=" * 60)

if __name__ == "__main__":
    main()

