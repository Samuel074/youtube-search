#!/bin/sh

# Check if FFmpeg is installed
if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "Error: FFmpeg is not installed. Please install FFmpeg to continue."
    exit 1
fi

# Check if input file is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <input_webm_file>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.*}.mp3"

echo "Converting $INPUT_FILE to $OUTPUT_FILE..."

ffmpeg -i "$INPUT_FILE" -vn -ab 128k -ar 44100 -y "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "Conversion completed successfully!"
else
    echo "An error occurred during the conversion."
fi
