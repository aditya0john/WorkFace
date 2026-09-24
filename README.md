# WorkFace - Staff Management & Facial Attendance App

WorkFace is a modern React Native staff management and automated attendance application built using Expo Go. It combines client-side state management with a local Python Flask AI microservice to deliver seamless, on-device facial recognition and verification without requiring complex native Android/iOS C++ compilation pipelines.

---

## 🚀 Tech Stack

*   **Framework:** React Native (Expo Go)
*   **Routing:** Expo Router (`useRouter`, File-based routing)
*   **State Management:** Zustand
*   **Camera & Files:** `expo-image-picker`, `expo-file-system`
*   **AI Backend Engine:** Python, Flask, `flask-cors`, DeepFace (`Facenet`), tf-keras, OpenCV (`cv2`)

---

## 📱 App Architecture & User Flows

1.  **Authentication (`useAuthStore`)**
    *   **Admin Flow:** Uses hardcoded administrative credentials for high-level management access.
    *   **Staff Flow:** Dynamic authentication where staff members log in using their assigned Employee ID and phone number.
2.  **Admin Portal**
    *   **Add Staff:** Input employee details, capture a face photo via the camera, generate a facial embedding vector through the Flask AI engine, and save the record to the global store (`useStaffStore`).
    *   **Staff Management:** View comprehensive lists of registered employees and inspect individual profile credentials.
3.  **Staff Portal**
    *   **Mark Attendance:** Capture a live face photo, transmit it to the backend to generate a fresh embedding vector, compare it locally against the logged-in user's stored embedding via **Cosine Similarity**, and log attendance upon successful verification.
    *   **Attendance History:** View a chronological list of past check-ins complete with timestamps, unique employee IDs, and confidence score percentages.

---

## 🧠 Behind the Scenes: How Face Recognition Works

Because heavy machine learning libraries (`TensorFlow`, `PyTorch`) cannot run inside the standard Expo Go container without native custom binaries, WorkFace utilizes a hybrid **Client-Server Architecture**:

### 1. The AI Engine (`app.py` - Python Flask)
Runs locally on your computer to handle heavy computer vision workloads:
*   **Flask & CORS:** Sets up an HTTP web server allowing local network fetch requests from the mobile app.
*   **Base64 Decoding:** Decodes text-based Base64 image payloads received from the phone back into a raw binary buffer (`np.frombuffer`).
*   **OpenCV (`cv2.imdecode`)**: Transforms the binary buffer into a matrix format readable by the computer vision model.
*   **`DeepFace.represent()`**: Utilizes the **Facenet** model and OpenCV backend to detect, align, and crop the face, transforming features into a **128-dimensional numerical vector (embedding)**.
*   **JSON Response:** Returns the coordinate array back to the mobile client.

### 2. The Bridge Service (`FaceService.ts` - React Native)
Acts as the communication link between your mobile screens and the Python server:
*   **File Read:** Uses `expo-file-system/legacy` to read captured photos and format them into Base64 strings.
*   **Network Request:** Executes an HTTP `POST` request to your machine's local Wi-Fi IPv4 address (e.g., `http://192.168.1.x:5000/get-embedding`).
*   **Cosine Similarity Matcher:** Runs **100% offline** on the mobile device in milliseconds, comparing the live scan vector against the saved profile vector to yield an accuracy score (closer to `1.0` indicates an exact match).

## 🛠️ Challenges Faced & their solutions/alternatives
*  **expo-camera:** uses a live stream from the camera app only good for video stream but to capture frames `expo-image-picker` was the better option.
*  **expo-image-manipulator:** could have been taxing to put another line of code just to get frame in place where both ios&android support square shaped crop system therefore reducing code.
*  **react-native-fast-tflite**&**react-native-nitro-modules:** both of them use C++ turbo modules locally on phone which requires an Eas build or building app on phone using USB thethering both of which require a lot of time and code processing completely defeating the advantage of on-the-go native bridging React Native offers via expo-go app so Flask API + Deepface was adopted to acheive the same results, aslo because while building dev build android phone was running into JAVA error and eas build was putting the app on a 40 min queue which would restrict time contraint if i chose that path to get the same results.

---

## 🛠️ Getting Started Locally

### Prerequisites
*   Node.js & npm installed
*   Python installed on your machine
*   A physical mobile device with **Expo Go** installed (connected to the same Wi-Fi network as your computer)

### Step 1: Run the Python AI Backend
1. Navigate to your backend folder and install dependencies:
   ```bash
   pip install flask flask-cors deepface tf-keras opencv-python "numpy<2"

   Start the Flask server:
   Bash python app.py
   
### Step 2: Configure Your Mobile App Network URL
Find your computer's local Wi-Fi IPv4 address using ipconfig (Windows) or ifconfig (Mac/Linux).

Open src/Services/FaceService.ts and update the URL to match your computer's IP address and port 5000:

TypeScript
const FLASK_API_URL = 'http://YOUR_LAPTOP_IP:5000/get-embedding';
Step 3: Run the React Native App
Install project packages:
   npm install

   Start the Expo development server:
   npx expo start

   Scan the generated QR code using the Expo Go app on your physical phone.

###🚀 How to Run the Project

This project consists of a React Native (Expo) frontend and a Python Flask backend. You will need to run them simultaneously in two separate terminal windows.

Step 1: Start the Python Backend

The backend utilizes Flask, TensorFlow/Keras, and OpenCV for facial recognition. These dependencies must be installed on your machine before running the server.

Open a new terminal and navigate to your backend folder.

Install the required Python packages:

pip install flask flask-cors tf-keras opencv-python


Start the Flask API:

python app.py


Leave this terminal window open and running.

Step 2: Install Frontend Dependencies

This project uses Yarn for package management due to specific dependency resolutions. Do not use npm install, as it will fail to resolve the workspace correctly.

Open a second terminal window and navigate to your frontend project root.

Install dependencies using Yarn:

yarn install


Step 3: Start the React Native App

Once dependencies are installed, start the Expo development server. We recommend clearing the cache to ensure you are testing the freshest build.

Start the server:

npx expo start -c


(Alternatively, you can run npx expo start --go to force Expo Go mode).

Connecting to Expo Go:

If the terminal defaults to a "Development Build" but you want to use the standard Expo Go app on your phone, simply press s in the terminal to switch to Expo Go.

Scan the QR code using the Expo Go app (Android) or the default Camera app (iOS).

⚠️ Things to Keep in Mind

Strictly use Yarn: If you accidentally run npm install, it may break your node_modules. If this happens, delete your node_modules folder and run yarn install again.

Network Connection: Ensure both your computer (running the Python API) and your mobile device (running Expo Go) are connected to the same Wi-Fi network so the app can communicate with the backend.

Stale Data / Caching Issues: If you add new assets or rename files and the app crashes, always stop the server and restart it with the -c flag (npx expo start -c) to clear the Metro bundler cache.
