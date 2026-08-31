# Monkeytype Tracker

## Setup

This app requires a Monkeytype Ape Key to load test activity.

1. In Monkeytype, open **Settings > Ape Keys** and create or copy an Ape Key.
2. Copy `.env.example` to `.env` in the project root.
3. Open `.env` and add the key manually:

	```env
	MONKEYTYPE_API_KEY=your_ape_key_here
	```

The key is local configuration and is ignored by Git. Never commit or share a real Ape Key.

## Run From Source

```bash
npm install
npm start
```

## Build The App

Create the `.env` file before packaging so the packaged app can read it from its resources folder:

```bash
npm run package
```

The generated installer includes the `.env` file used during packaging. Create a new local build for each Ape Key, and do not distribute an installer containing your personal key.
