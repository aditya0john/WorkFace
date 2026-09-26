# WorkFace — Staff Management & Facial Attendance App

WorkFace is a modern **React Native staff management and automated attendance application** built with **Expo Go**. It combines client-side state management with a local **Python Flask AI microservice** to provide facial recognition and identity verification without requiring a custom native Android/iOS build pipeline.

The application is designed around a hybrid architecture: the mobile application handles authentication, staff management, attendance records, and face-matching logic, while the Python backend performs the computationally intensive facial embedding generation.

---

## ✨ Features

### 🔐 Authentication

* Admin authentication for high-level staff management.
* Staff authentication using:

  * Employee ID
  * Phone number
* Role-based navigation between Admin and Staff portals.

### 👨‍💼 Admin Portal

* Add new staff members.
* Capture staff profile photographs.
* Generate facial embeddings using the Flask AI service.
* Store employee information and facial embeddings.
* View registered staff members.
* Inspect individual employee information.

### 📸 Facial Recognition

* Capture a facial image from the mobile device.
* Send the image to the local Flask AI service.
* Generate a facial embedding using DeepFace and FaceNet.
* Compare the live embedding against the employee's stored embedding.
* Perform cosine-similarity matching locally on the mobile device.
* Return a similarity/confidence score for verification.

### 🕐 Attendance Management

* Staff can verify their identity using facial recognition.
* Successful verification creates an attendance record.
* Attendance records include:

  * Employee ID
  * Timestamp
  * Verification confidence score
* Staff can view their attendance history chronologically.

---

# 🛠️ Tech Stack

## Frontend

| Technology            | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| **React Native**      | Mobile application framework                      |
| **Expo Go**           | Development and runtime environment               |
| **Expo Router**       | File-based navigation                             |
| **Zustand**           | Client-side state management                      |
| **expo-image-picker** | Image capture and selection                       |
| **expo-file-system**  | Reading image files and converting them to Base64 |

## Backend / AI

| Technology                | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| **Python**                | AI backend language                            |
| **Flask**                 | REST API server                                |
| **Flask-CORS**            | Cross-origin request support                   |
| **DeepFace**              | Facial representation and recognition          |
| **FaceNet**               | Facial embedding model                         |
| **TensorFlow / tf-keras** | Machine learning runtime                       |
| **OpenCV**                | Image decoding and computer vision processing  |
| **NumPy**                 | Numerical operations and image-buffer handling |

---

# 🏗️ Architecture

WorkFace uses a **hybrid client-server architecture**.

```text
┌─────────────────────────────┐
│       React Native App      │
│          Expo Go            │
│                             │
│  ┌───────────────────────┐  │
│  │ Authentication        │  │
│  │ Staff Management      │  │
│  │ Attendance             │  │
│  │ Zustand Stores         │  │
│  └───────────┬───────────┘  │
│              │              │
│              │ HTTP / JSON  │
│              ▼              │
│       FaceService.ts        │
│              │              │
└──────────────┼──────────────┘
               │
               │ Local Wi-Fi
               ▼
┌─────────────────────────────┐
│       Python Flask API      │
│                             │
│  Base64 Image               │
│        ↓                    │
│  NumPy Buffer               │
│        ↓                    │
│  OpenCV                     │
│        ↓                    │
│  DeepFace / FaceNet         │
│        ↓                    │
│  Face Embedding             │
│        ↓                    │
│  JSON Response              │
└─────────────────────────────┘
```

The Flask server runs locally on the developer's computer, while the React Native application runs on a physical mobile device through Expo Go.

Both devices must be connected to the **same local Wi-Fi network**.

---

# 📱 Application Flow

## 1. Authentication

WorkFace provides separate authentication flows for administrators and staff members.

### Admin

The administrator uses predefined administrative credentials to access staff-management functionality.

```text
Admin Login
     │
     ▼
Admin Authentication
     │
     ▼
Admin Portal
```

### Staff

Staff members authenticate using their assigned employee information.

```text
Employee ID + Phone Number
            │
            ▼
     Staff Authentication
            │
            ▼
       Staff Portal
```

---

# 👨‍💼 Admin Workflow

## Add Staff

The administrator can register a new employee.

```text
Enter Employee Details
          │
          ▼
Capture Face Photograph
          │
          ▼
Convert Image → Base64
          │
          ▼
Send Image to Flask API
          │
          ▼
DeepFace / FaceNet
          │
          ▼
Generate Face Embedding
          │
          ▼
Store Employee + Embedding
```

The facial embedding generated by the backend is associated with the employee's profile and later used during attendance verification.

---

## Staff Management

The Admin Portal provides access to registered employees.

Administrators can:

* View registered staff.
* Inspect employee information.
* Review stored profile information.
* Register additional employees.

---

# 👤 Staff Workflow

## Mark Attendance

Attendance verification follows this process:

```text
Staff Opens Attendance
          │
          ▼
Capture Live Face Image
          │
          ▼
Convert Image → Base64
          │
          ▼
Send Image to Flask API
          │
          ▼
Generate Live Embedding
          │
          ▼
Compare With Stored Embedding
          │
          ▼
Cosine Similarity
          │
       ┌──┴──┐
       │     │
    Match  No Match
       │     │
       ▼     ▼
 Attendance  Verification
 Recorded    Failed
```

The actual embedding comparison is performed **locally on the mobile device** after the backend returns the generated embedding.

---

# 🧠 How Facial Recognition Works

## 1. Image Capture

The React Native application captures an image of the employee.

The image is stored locally on the mobile device.

---

## 2. Base64 Conversion

`FaceService.ts` reads the captured image using Expo's file-system APIs and converts it into a Base64 representation.

```text
Camera Image
     ↓
Local File
     ↓
Base64 String
```

The Base64 payload is then sent to the Flask backend.

---

## 3. Flask API

The Flask server receives the Base64 image.

The Base64 data is decoded back into binary image data.

Conceptually:

```text
Base64
  ↓
Binary Buffer
  ↓
NumPy Array
  ↓
OpenCV Image
```

OpenCV's `cv2.imdecode()` converts the binary buffer into an image matrix that can be processed by the facial recognition pipeline.

---

## 4. DeepFace / FaceNet

The Flask service uses `DeepFace.represent()` to generate a numerical representation of the detected face.

The pipeline performs tasks such as:

* Face detection
* Face alignment
* Face extraction
* Feature representation

The resulting embedding is returned to the mobile application as a JSON-compatible numerical array.

> **Note:** The exact embedding dimensionality depends on the selected model and DeepFace configuration. For this project, the FaceNet configuration is used for facial representation.

---

## 5. Cosine Similarity

After receiving the live embedding, the mobile application compares it with the employee's stored embedding.

Cosine similarity can be represented as:

```text
cosine_similarity(A, B) =
        A · B
    ───────────────
      ||A|| ||B||
```

Where:

* `A` = stored employee embedding
* `B` = newly generated live embedding
* `A · B` = dot product
* `||A||` and `||B||` = vector magnitudes

A value closer to `1.0` indicates greater similarity between the two vectors.

The application uses the configured similarity threshold to determine whether the face is sufficiently similar for attendance verification.

> **Important:** A similarity score should not automatically be interpreted as a percentage of real-world identification accuracy. The threshold and performance should be evaluated using representative test data before production deployment.

---

# 🌐 FaceService

`FaceService.ts` acts as the communication layer between the React Native application and the Flask AI service.

Its responsibilities include:

1. Reading captured images.
2. Converting images to Base64.
3. Sending HTTP requests to the Flask server.
4. Receiving facial embeddings.
5. Performing local cosine-similarity calculations.
6. Returning the verification result to the application.

The Flask endpoint is configured using the computer's local network address.

Example:

```typescript
const FLASK_API_URL =
  'http://YOUR_LAPTOP_IP:5000/get-embedding';
```

For example, if your computer's local IP address is `192.168.1.20`:

```typescript
const FLASK_API_URL =
  'http://192.168.1.20:5000/get-embedding';
```

---

# 🔌 Why a Flask AI Backend?

Running large machine-learning libraries directly inside standard Expo Go can be difficult because libraries such as TensorFlow and PyTorch often require native modules and custom native builds.

WorkFace therefore separates the responsibilities:

### Mobile Device

Handles:

* UI
* Authentication
* Navigation
* Staff management
* Image capture
* Attendance records
* Embedding comparison

### Python Backend

Handles:

* Image decoding
* Face detection
* Face processing
* DeepFace
* FaceNet
* Facial embedding generation

This approach allows the project to use Expo Go without requiring a custom native machine-learning runtime.

---

# 🧩 Alternatives Considered

## `expo-camera`

`expo-camera` provides access to the camera and live camera functionality.

For the requirements of this project, image-based capture through the selected Expo APIs provided a simpler implementation path than building the recognition pipeline around continuous camera frames.

---

## `expo-image-manipulator`

`expo-image-manipulator` could be used for additional image transformations and cropping.

However, the project did not require a separate image-manipulation layer for its current capture workflow, reducing additional processing and implementation complexity.

---

## `react-native-fast-tflite`

An alternative approach would have been to run a TensorFlow Lite model directly on the mobile device.

However, this approach introduces native-module requirements and generally requires a development/custom build rather than relying entirely on the standard Expo Go runtime.

---

## `react-native-nitro-modules`

Native Turbo Module-based solutions were also considered.

These approaches can provide on-device machine-learning capabilities, but they introduce additional native Android/iOS build requirements.

During development, native Android/Java build issues and the additional build time associated with EAS made the Flask-based architecture more practical for the project's development constraints.

---

# 📂 Project Structure

```text
WorkFace/
│
├── app/
│   ├── ...
│   └── ...
│
├── src/
│   ├── Services/
│   │   └── FaceService.ts
│   │
│   ├── stores/
│   │   ├── useAuthStore.ts
│   │   └── useStaffStore.ts
│   │
│   └── ...
│
├── backend/
│   └── app.py
│
├── package.json
├── yarn.lock
├── app.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running WorkFace, make sure you have:

* [Node.js](https://nodejs.org/) installed.
* Yarn installed.
* Python installed.
* A physical Android or iOS device.
* Expo Go installed on the mobile device.
* Both the computer and mobile device connected to the same Wi-Fi network.

---

# 🐍 Step 1 — Start the Python Backend

Open a terminal and navigate to the backend directory.

```bash
cd backend
```

Create and activate a virtual environment if desired:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the required Python dependencies:

```bash
pip install flask flask-cors deepface tf-keras opencv-python "numpy<2"
```

Start the Flask API:

```bash
python app.py
```

Leave this terminal running.

The backend should be accessible on port `5000`.

---

# 📡 Step 2 — Configure the Local Network Address

Your mobile device must be able to reach the computer running Flask.

Find your computer's local IPv4 address.

### Windows

Run:

```bash
ipconfig
```

Look for the IPv4 address associated with your active Wi-Fi adapter.

Example:

```text
IPv4 Address . . . . . . . . . . : 192.168.1.20
```

### macOS / Linux

You can use:

```bash
ifconfig
```

or:

```bash
ip addr
```

Locate the IPv4 address for the active network interface.

---

## Update `FaceService.ts`

Open:

```text
src/Services/FaceService.ts
```

Update:

```typescript
const FLASK_API_URL =
  'http://YOUR_LAPTOP_IP:5000/get-embedding';
```

For example:

```typescript
const FLASK_API_URL =
  'http://192.168.1.20:5000/get-embedding';
```

### Important

Do **not** use:

```text
localhost
```

or:

```text
127.0.0.1
```

for the mobile application's API URL.

From the phone's perspective, `localhost` refers to the phone itself, not your computer.

---

# 📦 Step 3 — Install Frontend Dependencies

From the React Native project root:

```bash
yarn install
```

This project uses Yarn for dependency management.

If you previously ran `npm install` and encounter dependency issues, remove the generated dependencies and reinstall with Yarn:

```bash
rm -rf node_modules
yarn install
```

On Windows, you can remove `node_modules` manually or use:

```powershell
Remove-Item -Recurse -Force node_modules
```

Then:

```bash
yarn install
```

---

# 📱 Step 4 — Start Expo

Start the Expo development server:

```bash
npx expo start -c
```

The `-c` flag clears the Metro bundler cache.

Alternatively:

```bash
npx expo start --go
```

If Expo starts in Development Build mode and you want to use the standard Expo Go application, press:

```text
s
```

in the Expo terminal to switch to Expo Go mode when supported by your Expo CLI version.

---

# 📲 Step 5 — Connect the Mobile Device

After Expo starts, a QR code will be displayed in the terminal or Expo developer interface.

### Android

Open Expo Go and scan the QR code.

### iOS

Scan the QR code using the Camera application or open the project through Expo Go.

Make sure:

```text
Computer ─────── Wi-Fi ─────── Mobile Device
     │                              │
     └──── Flask API :5000 ─────────┘
```

Both devices must be on the same reachable local network.

---

# ⚙️ Running the Complete Project

WorkFace requires both services to run simultaneously.

### Terminal 1 — Flask

```bash
cd backend
python app.py
```

### Terminal 2 — React Native / Expo

```bash
yarn install
npx expo start -c
```

Then open the application through Expo Go.

---

# 🧪 Testing the Attendance Flow

A typical test sequence is:

### 1. Start Flask

```bash
python app.py
```

### 2. Start Expo

```bash
npx expo start -c
```

### 3. Open WorkFace in Expo Go

Connect your physical device to the Expo application.

### 4. Login as Admin

Use the configured administrator credentials.

### 5. Register a Staff Member

Enter:

* Employee information
* Employee ID
* Phone number
* Profile photograph

The photograph is sent to the Flask service and converted into a facial embedding.

### 6. Login as Staff

Use the registered employee credentials.

### 7. Mark Attendance

Capture a new facial image.

The application:

```text
Live Image
    ↓
Flask API
    ↓
FaceNet Embedding
    ↓
Mobile App
    ↓
Cosine Similarity
    ↓
Verification
    ↓
Attendance Record
```

### 8. View Attendance History

The staff member can view previous attendance records together with their timestamps and verification scores.

---

# ⚠️ Troubleshooting

## Flask server cannot be reached

Check that:

* Flask is running.
* The phone and computer are connected to the same Wi-Fi network.
* The correct computer IPv4 address is configured.
* Port `5000` is accessible through the computer's firewall.
* The API URL does not use `localhost`.

---

## `localhost` does not work on the phone

This is expected.

```typescript
// ❌ Incorrect for a physical phone
const FLASK_API_URL =
  'http://localhost:5000/get-embedding';
```

Use the computer's LAN address instead:

```typescript
// ✅ Example
const FLASK_API_URL =
  'http://192.168.1.20:5000/get-embedding';
```

---

## Expo application is showing stale code

Clear the Metro cache:

```bash
npx expo start -c
```

If necessary, stop the Expo server completely and restart it.

---

## `node_modules` dependency problems

If `npm install` was used accidentally, reinstall using Yarn:

```bash
rm -rf node_modules
yarn install
```

Windows users can delete `node_modules` manually and then run:

```bash
yarn install
```

---

## Face detection fails

Possible causes include:

* Poor lighting.
* Face partially outside the image.
* Multiple faces in the frame.
* Excessive distance from the camera.
* Low-quality image.
* Significant facial obstruction.
* Backend model initialization problems.

Ensure the face is clearly visible and sufficiently illuminated.

---

## Python dependency issues

Using a virtual environment is recommended:

```bash
python -m venv venv
```

Activate it and reinstall the dependencies:

```bash
pip install flask flask-cors deepface tf-keras opencv-python "numpy<2"
```

If TensorFlow, DeepFace, or OpenCV reports platform-specific installation problems, verify that the installed Python version is compatible with the versions of those packages being used.

---

# 🔒 Security Considerations

This project is intended primarily as a **local/development application**.

Before using a similar architecture in production, additional security measures should be implemented.

These may include:

* Secure authentication instead of hardcoded administrator credentials.
* Password hashing.
* HTTPS/TLS instead of plain HTTP.
* Secure API authentication.
* Server-side authorization.
* Encrypted storage of facial embeddings.
* Secure storage for employee information.
* Proper database persistence.
* API rate limiting.
* Input validation.
* Audit logging.
* Protection against replay attacks.
* Appropriate retention and deletion policies for biometric data.
* Explicit user consent and applicable privacy/compliance requirements.

Facial embeddings are biometric-related data and should be treated as sensitive information.

---

# 🔐 Privacy Considerations

WorkFace processes facial information for identity verification.

For a production deployment, consider:

* Obtaining appropriate consent.
* Clearly communicating why facial data is collected.
* Limiting collection to what is necessary.
* Restricting access to employee biometric data.
* Encrypting data at rest and in transit.
* Defining retention periods.
* Providing appropriate deletion mechanisms.
* Following applicable privacy and employment regulations.

The local development architecture should not automatically be considered suitable for production biometric processing without additional security and privacy controls.

---

# 🚧 Current Limitations

The current development architecture has several limitations:

* The Flask backend must be running for facial embedding generation.
* The mobile device must be able to reach the development computer over the local network.
* The application currently relies on a local Flask service rather than a deployed production backend.
* Authentication is simplified for development purposes.
* Employee and attendance persistence depends on the application's current state-management implementation.
* Standard Expo Go does not provide the same native ML capabilities as a custom development build.
* Facial verification performance depends on image quality, lighting, camera conditions, model configuration, and the selected similarity threshold.

---

# 🔮 Future Improvements

Potential improvements include:

* Replace hardcoded admin credentials with secure authentication.
* Add a production database such as PostgreSQL or Firebase.
* Deploy the Flask service to a secure backend.
* Add HTTPS.
* Introduce JWT/session-based authentication.
* Add encrypted biometric storage.
* Add employee profile editing and deletion.
* Add attendance reports.
* Add administrator attendance dashboards.
* Add export functionality for attendance data.
* Add configurable face-matching thresholds.
* Add anti-spoofing/liveness detection.
* Improve image-quality validation before recognition.
* Introduce a native on-device ML implementation where appropriate.
* Add automated testing for authentication, attendance, and face verification.
* Add proper environment-variable configuration for API URLs and secrets.

---

# 💡 Why This Architecture?

The main objective of WorkFace was to build a practical facial-attendance system while remaining compatible with the standard Expo Go development workflow.

A fully on-device ML implementation could require:

```text
React Native
      ↓
Native ML Library
      ↓
Turbo Modules / Native Modules
      ↓
Custom Android/iOS Build
      ↓
Development Build / EAS
```

The selected architecture instead uses:

```text
React Native + Expo Go
          ↓
      HTTP Request
          ↓
   Python Flask API
          ↓
     DeepFace / FaceNet
          ↓
   Facial Embedding
          ↓
      React Native
          ↓
  Cosine Similarity
```

This separation keeps the mobile application relatively lightweight while allowing Python-based machine-learning libraries to handle facial representation.

---

# 📋 Quick Start

For experienced developers, the complete setup can be summarized as:

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install flask flask-cors deepface tf-keras opencv-python "numpy<2"

python app.py
```

### Frontend

Open a second terminal:

```bash
yarn install
```

Configure:

```typescript
const FLASK_API_URL =
  'http://YOUR_LAPTOP_IP:5000/get-embedding';
```

Then run:

```bash
npx expo start -c
```

Open the project using Expo Go on a physical device connected to the same network.

---

# 📁 Important Files

| File                          | Responsibility                                         |
| ----------------------------- | ------------------------------------------------------ |
| `app/`                        | Expo Router application screens and routes             |
| `src/Services/FaceService.ts` | Communication with Flask and face-embedding operations |
| `src/stores/useAuthStore.ts`  | Authentication state                                   |
| `src/stores/useStaffStore.ts` | Staff/application state                                |
| `backend/app.py`              | Flask AI API                                           |
| `package.json`                | Frontend dependencies and scripts                      |
| `yarn.lock`                   | Yarn dependency lockfile                               |

> File paths may differ depending on the final repository structure.

---

# 🤝 Development Notes

WorkFace was developed with a focus on keeping the mobile development workflow compatible with Expo Go while delegating computationally intensive facial-recognition operations to a Python service.

The architecture also provides a clear separation between:

* Mobile UI
* Application state
* Network communication
* Facial embedding generation
* Face verification
* Attendance management

This makes the project easier to evolve toward a more production-oriented architecture in the future.

---

# 📄 License

Add your project's license here.

For example:

```text
MIT License
```

If the project is not currently licensed, replace this section with the license you intend to use before publishing the repository.

---

# 👨‍💻 Author

**WorkFace**

Staff Management & Facial Attendance Application

Built with:

* React Native
* Expo
* Zustand
* Python
* Flask
* DeepFace
* FaceNet
* OpenCV
* TensorFlow/Keras
