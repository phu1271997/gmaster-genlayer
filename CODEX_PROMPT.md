Đây là prompt chi tiết để anh copy-paste gửi Codex:

---

**Prompt cho Codex:**

```
# TASK: Push GMaster project to GitHub + Deploy frontend to Vercel

## Context

I have a full-stack Web3 dApp called "GMaster" built at local path:
`/Users/ai/bot AI/GMaster`

It consists of:
1. A GenLayer Python Intelligent Contract (`contracts/gmaster.py`) — deployed already at `0x4EF21aBF27b914Cbab5300DC51490A3a51E4cb40`
2. A Next.js 14 frontend in the `frontend/` subfolder
3. Tests, docs, README

## Part 1: Push to GitHub

1. Create a new GitHub repository named `gmaster-genlayer` (or any available name)
2. Initialize git in the project root if not already done
3. Add remote origin pointing to the new repo
4. Commit ALL files including:
   - contracts/gmaster.py
   - tests/test_gmaster.py
   - frontend/ (entire Next.js app)
   - docs/ (ARCHITECTURE.md, GAME_RULES.md, DM_PROMPT_DESIGN.md)
   - README.md
   - .gitignore
5. Push to `main` branch

IMPORTANT: Do NOT push node_modules/.next/ build artifacts. Use existing .gitignore.

## Part 2: Deploy Frontend to Vercel

1. Import the GitHub repo into Vercel (https://vercel.com/new)
2. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `frontend` (very important — the Next.js app is inside `frontend/`, NOT at repo root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Add Environment Variable:
   - Name: `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Value: `0x4EF21aBF27b914Cbab5300DC51490A3a51E4cb40`
   (Make sure it starts with 0x exactly)
4. Deploy
5. Copy the Vercel production URL and return it to me

## Notes
- The contract is ALREADY deployed on GenLayer Studio. Do NOT re-deploy it.
- The frontend reads `NEXT_PUBLIC_CONTRACT_ADDRESS` from env at build time (public env var for Next.js)
- If Vercel asks for node version, use 18+ (package.json engines can be added if needed)
- Build must pass with zero errors before deploying

## Expected output
- GitHub repo URL
- Vercel deployed app URL
- Confirmation that env var NEXT_PUBLIC_CONTRACT_ADDRESS is set correctly
```

---

Anh chỉ cần copy phần trong dấu ``` gửi Codex là xong. Nó sẽ hiểu ngay! 🚀
