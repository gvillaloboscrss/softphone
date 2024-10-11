import os
import requests
import wave
from flask import Flask, request, jsonify
from gtts import gTTS

app = Flask(__name__)

if not os.path.exists("responses"):
    os.makedirs("responses")

@app.route('/process-audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_path = "file.wav"
    file.save(file_path)

    if not os.path.exists(file_path):
        return jsonify({"error": f"{file_path} does not exist"}), 404

    with wave.open(file_path, 'rb') as wav_file:
        print(f"Processing file: {file_path}")
        params = wav_file.getparams()
        print(f"Audio parameters: {params}")

    api_url = "https://api.example.com/speech-to-text"
    
    with open(file_path, 'rb') as audio_data:
        response = requests.post(api_url, files={"file": audio_data})
    
    if response.status_code == 200:
        transcript = response.json().get('transcript', '')
        print(f"Transcript received: {transcript}")
        
        output_response_wav_path = os.path.join("responses", "response.wav")
        text_to_speech(transcript, output_response_wav_path)

        return jsonify({"transcript": transcript}), 200
    else:
        return jsonify({"error": "Failed to process audio."}), response.status_code

def text_to_speech(text, output_path):
    print(f"Converting text to speech: {text}")
    tts = gTTS(text)
    tts.save(output_path)
    print(f"Response saved to: {output_path}")

if __name__ == "__main__":
    print("Use app as: curl -X POST -F file=@path/to/your/file.wav http://localhost:5000/process-audio")
    app.run(host='0.0.0.0', port=5000)