markdown
# 🎮 2048 Sphere

**2048 Sphere** is a decentralized 2048 game built on the **Sphere Network**. Players pay a **1 UCT entry fee** to play, and if they reach a score of **2048**, they earn a **0.5 UCT reward** — all powered by the Sphere wallet and smart contract intents.

🔗 **Live Demo:** [https://jaguard2021.github.io/my-sphere-app/](https://jaguard2021.github.io/my-sphere-app/)

---

## ✨ Features

- 🔐 **Sphere Wallet Integration** — Connect your Sphere wallet with a single click
- 💰 **Entry Fee System** — Pay 1 UCT to start a game (sent to escrow)
- 🏆 **Reward System** — Earn 0.5 UCT when you reach 2048 points
- 🎮 **Full 2048 Gameplay** — Play with keyboard arrows or on-screen buttons
- 🔄 **Auto-Reconnect** — Session persistence for seamless experience
- 🌙 **Dark Theme** — Modern, sleek UI optimized for all devices
- 📱 **Responsive** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend framework |
| **TypeScript** | Type-safe development |
| **Vite** | Fast build tool |
| **Sphere SDK** | Wallet connection, intents (SEND/MINT), RPC queries |
| **GitHub Pages** | Hosting & deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Sphere wallet (browser extension or web app)

### Installation

```bash
# Clone the repository
git clone https://github.com/jaguard2021/my-sphere-app.git

# Navigate to project folder
cd my-sphere-app

# Install dependencies
npm install

# Start development server
npm run dev
Open http://localhost:5173/my-sphere-app/ to play locally.

🔧 Deployment
bash
# Build the app
npm run build

# Deploy to GitHub Pages
npm run deploy
The app will be available at: https://jaguard2021.github.io/my-sphere-app/

💡 How It Works
Connect Wallet — Click "Connect Wallet" and approve permissions in your Sphere wallet.

Pay Entry Fee — Click "Play 1 UCT" — 1 UCT is sent to the escrow wallet.

Play 2048 — Use arrow keys or on-screen buttons to merge tiles.

Earn Rewards — If you reach 2048 points, the app triggers a MINT intent to reward you with 0.5 UCT.

Play Again — Start a new game (free) or return to lobby to pay again.

📁 Project Structure
text
src/
├── components/
│   ├── WalletCard.tsx      # Connect/disconnect UI
│   ├── BalanceCard.tsx     # Display UCT balance
│   ├── Lobby.tsx           # Play button & entry fee UI
│   └── Game2048.tsx        # Full 2048 game logic
├── hooks/
│   ├── useSphereConnect.ts # Wallet connection & session
│   ├── useSphereBalance.ts # Fetch balances
│   ├── useSphereTransfer.ts # SEND intents
│   ├── useSphereMint.ts    # MINT intents for rewards
│   ├── useEntryFee.ts      # Entry fee logic
│   └── useEscrow.ts        # Escrow wallet address
└── App.tsx                 # Main orchestrator
🧪 Testing the Flow
To test the full flow without real funds, you can use the self-transfer mode (set ESCROW_ADDRESS = '' in useEscrow.ts). This sends the entry fee back to yourself.

📝 License
MIT

🙌 Acknowledgments
Built with ❤️ for the Sphere Network ecosystem

Inspired by the classic 2048 game

Special thanks to the Sphere SDK team

📬 Contact
Developer: jaguard2021
Project Repository: github.com/jaguard2021/my-sphere-app

text

---



