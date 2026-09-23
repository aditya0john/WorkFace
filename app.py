from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)  # Allows your React Native app to talk to this server

@app.route('/get-embedding', methods=['POST'])
def get_embedding():
    try:
        data = request.json
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        # Decode base64 image from React Native
        image_data = base64.b64decode(data['image'])
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Extract face embedding using DeepFace (Facenet model outputs 128-dim vector)
        # detect_backend='opencv' keeps it lightweight and fast
        embedding_objs = DeepFace.represent(
            img_path=img, 
            model_name="Facenet", 
            enforce_detection=True, 
            detector_backend="opencv"
        )

        if not embedding_objs:
            return jsonify({'error': 'No face detected'}), 400

        vector = embedding_objs[0]["embedding"]

        return jsonify({'success': True, 'embedding': vector})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Runs locally on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)