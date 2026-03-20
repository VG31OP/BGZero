# BgZero

BgZero is a modern React + Vite + Tailwind web app to clean image backgrounds and compress images directly in the browser.

## Features

- Background remover (transparent PNG output)
- Target-size image compressor (KB / MB)
- Local browser processing workflow
- Premium glassmorphism UI
- Footer links for Terms, Privacy Policy, and Contact

## Tech Stack

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- Framer Motion
- `@imgly/background-removal`
- `browser-image-compression`
- `sonner` toasts

## Project Structure

- `src/pages/Index.tsx` - Main app page (upload, tool switch, footer)
- `src/components/tools/BackgroundRemover.tsx` - Background removal tool
- `src/components/tools/ImageCompressor.tsx` - Compressor tool (target file size)
- `src/pages/Terms.tsx` - Terms page
- `src/pages/PrivacyPolicy.tsx` - Privacy policy page
- `src/pages/Contact.tsx` - Contact page
- `src/components/Header.tsx` - Hero branding section

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Start Dev Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test -- --run
```

## App Routes

- `/` - Main app
- `/terms` - Terms of Use
- `/privacy-policy` - Privacy Policy
- `/contact` - Contact

## Notes

- Maximum upload size: 20MB
- Supported file types: JPG, PNG, WEBP
- Image blob URLs are cleaned up to avoid memory leaks
- Processing indicators and disabled states are included to prevent duplicate actions

## Deployment

The app is Vercel-ready.

1. Build command: `npm run build`
2. Output directory: `dist`

## License

This project is provided as-is for your own use and customization.
