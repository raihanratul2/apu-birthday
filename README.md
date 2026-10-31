# Birthday Surprise for Apu

A responsive, interactive Next.js + TypeScript birthday surprise website.

## Get started

Node.js 20+ is recommended.

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Change the content

Edit `components/content.ts` to change the recipient's name, letter, memory captions, envelope note and the three final message cards.

To add office photos, put image files under `public/photos/`, then set the corresponding `image` field, e.g. `"/photos/office-team.jpg"`.

## Production

```bash
npm run build
npm run start
```

Deploy to Vercel by importing this project from GitHub. No database or environment variables required. `robots` is set to `noindex` to discourage indexing (not an access control).
