import google.generativeai as genai
import sys
import os

def generate_youtube_metadata(topic, script_text, api_key):
    genai.configure(api_key=api_key)
    
    prompt = f"""
You are an expert YouTube Shorts SEO specialist for Anime niches.
I have a YouTube Short about the following topic: "{topic}"

Here is the script of the video:
"{script_text}"

Please generate the optimal YouTube metadata for this video to go viral. 
Return the result in the following format exactly:

TITLE: (Catchy title under 60 characters with 1-2 emojis and 1-2 main hashtags)
DESCRIPTION: (A short 2-3 sentence engaging description, followed by 5-10 relevant hashtags)
TAGS: (Comma-separated list of 15 highly searchable tags for this anime)
"""
    print("✨ Đang nhờ AI viết Tiêu đề & Mô tả chuẩn SEO YouTube...")
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        print("\n" + "="*50)
        print(response.text.strip())
        print("="*50 + "\n")
    except Exception as e:
        print(f"❌ Lỗi khi gọi API: {e}")

if __name__ == "__main__":
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        print("Vui lòng set biến môi trường GEMINI_API_KEY hoặc truyền cứng vào file.")
    else:
        topic = "Is Diablo the Strongest?"
        script = "Everyone thinks Diablo is the strongest..."
        generate_youtube_metadata(topic, script, api_key)
