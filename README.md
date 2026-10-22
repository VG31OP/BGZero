# BgZero ⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)

A high-performance browser-based background remover and target-size image compressor engineered by [Vraj Shiroya (VG31OP)](https://github.com/VG31OP). Part of the [Shiroya Tool Lab](https://shiroya.in).

BgZero executes image background removal and compression entirely inside the user's browser memory using client-side machine learning segmentation (`@imgly/background-removal`) and canvas processing. Files are never uploaded to remote servers.

- **Live Application**: [https://bgzero.shiroya.in](https://bgzero.shiroya.in)
- **Parent Platform**: [https://shiroya.in](https://shiroya.in)
- **Creator**: [Vraj Shiroya (@VG31OP)](https://github.com/VG31OP) • [Website](https://vraj.shiroya.in) • [LinkedIn](https://www.linkedin.com/in/vrajshiroya)
- **Email Contact**: [vraj@shiroya.in](mailto:vraj@shiroya.in)

---

## ✨ Features

- **Instant AI Background Removal**: Isolates subjects and produces transparent PNG cutouts directly in browser memory.
- **Target-Size Image Compressor**: Compresses JPG, PNG, and WebP images to exact target file sizes (KB/MB) without manual quality guessing.
- **100% Local Browser Execution**: Uses WebAssembly and Web Workers; image bytes never leave your device.
- **Zero Friction**: 100% free with no signups, accounts, or watermarks.
- **Side-by-Side Comparison**: Interactive before/after visual slider to inspect cutout precision.
- **Memory Safety**: Automatic object URL cleanup and state locking to prevent browser memory leaks and duplicate runs.

---

## 🛠️ Tech Stack

- **Framework**: React 18, Vite 5, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI Cutout Engine**: `@imgly/background-removal` (WebAssembly & ONNX runtime in browser)
- **Compression**: `browser-image-compression`
- **Notifications**: `sonner` toasts
- **Icons**: Lucide React

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx                     # Hero branding section
│   └── tools/
│       ├── BackgroundRemover.tsx       # AI background removal component
│       └── ImageCompressor.tsx        # Target-size compression component
├── pages/
│   ├── Index.tsx                      # Main tool workspace
│   ├── Terms.tsx                      # Terms of service
│   ├── PrivacyPolicy.tsx              # Privacy policy documentation
│   └── Contact.tsx                    # Contact channel
```

---

## ⚠️ Known Limitations

- **Client Hardware Dependent**: Because AI tensor segmentation runs on the client device via WebAssembly/Web Workers, processing time depends on local CPU/GPU capability.
- **Maximum Recommended File Size**: Up to 20MB per image. Extremely high-resolution images (e.g. 50+ megapixels) may encounter browser tab RAM constraints.
- **Supported Formats**: JPEG, PNG, and WebP.

---

## 🚀 Local Development

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VG31OP/BGZero.git
   cd BGZero
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build production bundle:**
   ```bash
   npm run build
   ```

5. **Run test suite:**
   ```bash
   npm test -- --run
   ```

---

## ☁️ Deployment

BgZero is configured for seamless zero-configuration deployment on Vercel or any static web host:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 📄 License

This project is licensed under the **MIT License**.
