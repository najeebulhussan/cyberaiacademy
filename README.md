# CyberAI Academy - Universal App Prototype

Welcome to the official codebase for **CyberAI Academy** (`cyberaiacademy.com`). This is a universal React Native + Expo application configured to run on the **Web, Android, and iOS** from a single shared codebase.

It offers training pathways in Artificial Intelligence, Network Automation, and Cybersecurity, directly linked with Cisco Networking Academy (`netacad.com`) and supplemented by custom self-paced LMS elements and an AI Study Mentor.

---

## 🚀 Key Features

1.  **Immersive Course Player (`src/app/lms.tsx`)**:
    *   Self-paced syllabus list.
    *   **Python Automation Sandbox**: An interactive terminal where students write scripts (e.g. SHA-256 cryptography) to satisfy course metrics.
2.  **Cisco NetAcad Integration (`src/services/netacadService.ts`)**:
    *   **SSO Account Linkage**: Links local profile details to Cisco NetAcad Student IDs.
    *   **LTI 1.3 Launch Visualizer**: Instantly generates secure JWT tokens for launching protected Cisco lab contexts.
    *   **LTI AGS Grade Sync**: Simulates real-time grade passbacks to the Cisco NetAcad gradebook.
3.  **Gemini AI Mentor Chatbot (`src/app/mentor.tsx`)**:
    *   Conversational helper using Google's Gemini 1.5 Flash API with system instructions designed for tutoring.
    *   Supports quick-suggested topics (Subnetting, Jailbreaks, IaC comparison).
4.  **Verifiable Badges & Credentials (`src/app/dashboard.tsx`)**:
    *   Lists earned certificates.
    *   Offers an Open Badges 3.0 W3C Verifiable Credentials checker demonstrating cryptographic signature verification.

---

## 🛠️ File Structure

*   `src/app/` - File-based router screens (Expo Router).
    *   `index.tsx` - Landing Page & Course Catalog.
    *   `dashboard.tsx` - Achievements, Checklists, NetAcad Sync & Badges.
    *   `lms.tsx` - LMS Course Player & Interactive Code Sandbox.
    *   `mentor.tsx` - Gemini AI Mentor chat client.
    *   `_layout.tsx` - Root layout with theme provider.
*   `src/components/` - Navigation components (`app-tabs.tsx` for mobile, `app-tabs.web.tsx` for web navbar).
*   `src/constants/theme.ts` - Color schemes (Cyber Slate, Cyan, Cisco Green, Purple).
*   `src/services/` - Integration and state layers.
    *   `academyState.ts` - Central reactive progress store.
    *   `netacadService.ts` - LTI 1.3 claims and AGS grade sync APIs.
    *   `aiService.ts` - Google Gemini API interface.

---

## 💻 Get Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
To enable the live AI Mentor chatbot, create a `.env` file at the root of the project:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If no key is set, the chatbot will automatically fall back to Offline Simulation Mode.*

### 3. Launch the Application
*   **Web Portal**:
    ```bash
    npm run web
    ```
*   **Android App**:
    ```bash
    npm run android
    ```
*   **iOS App**: (Requires macOS)
    ```bash
    npm run ios
    ```

---

## 📦 Native Mobile Compilations

To generate clean native project wrappers and configure platform bindings:
```bash
npx expo prebuild
```
This scaffolds:
*   `/android` directory containing the Gradle build tree for compiling `.apk` files.
*   `/ios` directory (on macOS) containing Xcode workspace assets.
