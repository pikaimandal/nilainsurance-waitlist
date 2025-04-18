# Nila Insurance Waitlist

A Worldcoin mini app for Nila Insurance waitlist.

## Setup Instructions

### Prerequisites
- Node.js (recommended v18+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/nila-insurance-waitlist.git
cd nila-insurance-waitlist
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

> **Note:** This project requires the `--legacy-peer-deps` flag due to React 19 compatibility issues with some dependencies.

3. Configure Worldcoin:
   - Open `app/layout.tsx`
   - Replace `app_staging_YOUR_APP_ID` with your actual Worldcoin App ID

### Running the App

Start the development server:
```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- World App (Worldcoin) wallet authentication
- Waitlist registration with phone number
- Selection of update preferences

## Implementation Details

This app uses the following MiniKit packages:
- `@worldcoin/minikit-js` - Core package for MiniKit integration
- `@worldcoin/minikit-react` - React hooks for MiniKit (if needed)

The integration includes:
1. A custom MiniKit provider in `components/minikit-provider.tsx`
2. Wallet authentication in the home page
3. API routes for nonce generation and SIWE verification

## Testing in World App

To test this mini app within World App:
1. Set up proper app ID from the World Developer Portal
2. Deploy to a public URL or use a tunneling service like ngrok
3. Add the URL to the World Developer Portal for testing

## Technologies Used

- Next.js 15
- React 19
- Tailwind CSS
- Worldcoin MiniKit
- Shadcn UI components 