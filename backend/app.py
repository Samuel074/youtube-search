from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import re
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
from cachetools import TTLCache

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

# In-memory cache for transcriptions (1000 items, 1 hour TTL)
transcription_cache = TTLCache(maxsize=1000, ttl=3600)

def extract_video_id(url):
    """Extract the video ID from a YouTube URL."""
    pattern = r'(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})'
    match = re.search(pattern, url)
    return match.group(1) if match else None

@app.route('/api/transcribe', methods=['POST'])
@limiter.limit("10 per minute")
def transcribe():
    data = request.json
    youtube_url = data.get('url')
    
    if not youtube_url:
        return jsonify({"error": "No URL provided"}), 400
    
    video_id = extract_video_id(youtube_url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400
    
    # Check cache first
    if video_id in transcription_cache:
        logger.info(f"Cache hit for video_id: {video_id}")
        return jsonify({"message": "Transcription complete", "video_id": video_id}), 200
    
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcription_cache[video_id] = transcript
        logger.info(f"Transcription completed for video_id: {video_id}")
        return jsonify({"message": "Transcription complete", "video_id": video_id}), 200
    except Exception as e:
        logger.error(f"Transcription failed for video_id: {video_id}. Error: {str(e)}")
        return jsonify({"error": "Failed to transcribe video. Please try again later."}), 500

@app.route('/api/search', methods=['POST'])
@limiter.limit("30 per minute")
def search():
    data = request.json
    video_id = data.get('video_id')
    keyword = data.get('keyword')
    
    if not video_id or not keyword:
        return jsonify({"error": "Missing video_id or keyword"}), 400
    
    if video_id not in transcription_cache:
        return jsonify({"error": "Transcription not found. Please transcribe the video first."}), 404
    
    results = []
    for entry in transcription_cache[video_id]:
        if keyword.lower() in entry['text'].lower():
            results.append({
                "timeframe": f"{int(entry['start'] // 60):02d}:{int(entry['start'] % 60):02d}",
                "sentence": entry['text'],
                "ytUrl": f"https://www.youtube.com/watch?v={video_id}&t={int(entry['start'])}s"
            })
    
    logger.info(f"Search completed for video_id: {video_id}, keyword: {keyword}, results: {len(results)}")
    return jsonify(results), 200

if __name__ == '__main__':
    app.run(debug=False)  # Set debug to False for production