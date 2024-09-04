#!/bin/sh

VIDEO_URL="https://www.youtube.com/watch?v=lGPC18DTPdo"
YT_DLP_PATH="$HOME/bin/yt-dlp"

echo "Starting download..."

"$YT_DLP_PATH" -x --audio-format mp3 --audio-quality 0 -o "%(title)s.%(ext)s" "$VIDEO_URL"

if [ $? -eq 0 ]; then
    echo "Download completed successfully!"
else
    echo "An error occurred during the download."
fi
