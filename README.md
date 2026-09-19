# Thai Tarot 78 Cards Web Application

Mobile-first Tarot web application with Daily Tarot and Personal Reading features.

## Architecture

This project is built using a Static Frontend MVP approach:
- HTML5 / CSS3 (Tailwind CSS via CDN)
- Vanilla JavaScript (ES Modules)
- JSON for data storage (no backend required for MVP)

### Folder Structure
- `/` - HTML entry points (`index.html`, `daily.html`, `reading.html`, `result.html`, `test.html`)
- `/css` - Custom styles and CSS variables
- `/js` - Logic (`app.js`), utilities, and engines
- `/data` - JSON structures containing card data, interpretations, etc.
- `/assets` - Visual resources (cards, wallpapers, icons)

## How to Run Locally

Since this project uses ES Modules, it must be run on an HTTP server (opening files via `file://` will not work).

**Option 1: Using `npx serve` (Recommended if Node.js is installed)**
```bash
npx serve
```

**Option 2: Using Python**
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000`

**Option 3: VS Code**
Use the **Live Server** extension and click "Go Live" at the bottom right.

## Development Rules
- Develop in phases. Do not advance to the next phase without prompt commands.
- Use `crypto.getRandomValues()` for shuffling, no `Math.random()`.
- Deterministic Daily Tarot generation based on SHA-256.
