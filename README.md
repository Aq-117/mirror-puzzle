# Laser Mirror Puzzle Game

A browser-based puzzle game where you manipulate mirrors to guide laser beams to their targets. Built with vanilla JavaScript and modern web technologies.

## 🎮 About The Game

Laser Mirror Puzzle is a strategic puzzle game featuring:
- **58 Handcrafted Levels** with increasing difficulty
- **5 Types of Mirrors** (M1-M5) with unique reflection mechanics
- **3 Types of Emitters** (Standard, Diagonal, Omni-directional)
- **Built-in Level Editor** to create and test your own puzzles
- **Undo/Redo System** with 50-move history
- **Progressive Unlocking** of advanced mirror types

### Mirror Types
- **M1 (Triangle)**: Reflects orthogonal beams at 90° angles
- **M2 (Line)**: Simple diagonal reflector (/ or \)
- **M3 (Octagon)**: Converts orthogonal beams to diagonal directions
- **M4 (Square)**: Converts diagonal beams to orthogonal directions
- **M5 (Omni)**: Ultimate mirror - redirects any beam to any of 8 directions

## 🛠️ Tech Stack

### Core Technologies
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JS
- **HTML5 Canvas** - For game rendering
- **CSS3** - Modern styling with animations
- **Vite** - Fast development server and build tool

### Architecture
- **Modular ES6 Modules** - Clean separation of concerns
- **Object-Oriented Design** - Game, Grid, Renderer, LaserSystem classes
- **Event-Driven Input** - Mouse/touch interaction handling
- **State Management** - Level progression, inventory, undo/redo

### Project Structure
```
first-project/
├── src/
│   ├── game/           # Core game logic
│   │   ├── Game.js           # Main game controller
│   │   ├── Grid.js           # Grid & cell management
│   │   ├── Renderer.js       # Canvas rendering
│   │   ├── LaserSystem.js    # Laser physics & reflection
│   │   ├── InputHandler.js   # User input processing
│   │   ├── ParticleSystem.js # Visual effects
│   │   └── AudioSystem.js    # Sound management
│   ├── editor/         # Level editor
│   │   └── LevelEditor.js    # Level creation tool
│   ├── generator/      # Procedural generation (disabled)
│   ├── levels.js       # 58 level definitions
│   ├── style.css       # Game styling
│   └── main.js         # Entry point
├── index.html          # Main HTML file
├── package.json        # Dependencies
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Installation & Setup

1. **Clone or Download the Project**
   ```bash
   # If using Git
   git clone <repository-url>
   cd first-project

   # Or download and extract the ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - The terminal will show a local URL (usually `http://localhost:5173`)
   - Open this URL in your web browser
   - The game will start automatically!

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` folder. You can then:
- Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)
- Or preview locally with: `npm run preview`

## 🎯 How to Play

### Basic Controls
- **Left Click** on empty cells to place mirrors
- **Left Click** on mirrors to rotate them
- **Remove Button** to delete user-placed mirrors
- **Undo Button** to reverse actions (50-move history)
- **Reset Button** to restart the level

### Game Mechanics
1. **Objective**: Guide all laser beams to their receivers (targets)
2. **Mirrors**: Each level provides a limited inventory of mirrors
3. **Fixed Mirrors**: Red mirrors cannot be rotated; Yellow mirrors can be rotated
4. **Progression**: Complete levels to unlock new mirror types

### Level Editor
- Click **LEVEL EDITOR** from the main menu
- Use tools on the left to place walls, emitters, receivers, and mirrors
- Set inventory counts at the bottom
- **Shift+Click** on mirrors to toggle fixed/rotatable state
- Click **TEST** to play your level
- Click **EXPORT** to get the level code for `levels.js`

## 📁 File Descriptions

### Core Game Files
- **`Game.js`** - Main game loop, level loading, win condition checking
- **`Grid.js`** - Grid data structure, cell types, and constants
- **`Renderer.js`** - All canvas drawing logic for mirrors, lasers, particles
- **`LaserSystem.js`** - Laser ray-casting, reflection physics, collision detection
- **`InputHandler.js`** - Mouse/touch input, placement, rotation, removal logic

### Features
- **`LevelEditor.js`** - Full-featured level creation and testing tool
- **`ParticleSystem.js`** - Visual effects for laser impacts
- **`AudioSystem.js`** - Sound effects and music management
- **`levels.js`** - All 58 level definitions with grid layouts and inventories

## 🎨 Customization

### Adding New Levels
Edit `src/levels.js` and add your level object:
```javascript
{
    id: 59,
    name: "My Custom Level",
    grid: { width: 8, height: 8 },
    items: [
        { x: 2, y: 3, type: 6, rotation: 0, locked: true, fixedRotation: false }
    ],
    emitters: [
        { x: 0, y: 0, direction: 1 }
    ],
    inventory: { mirror1: 3, mirror2: 2, mirror3: 0, mirror4: 0, mirror5: 0 }
}
```

### Modifying Colors
Edit `src/style.css` - CSS variables at the top:
```css
:root {
  --bg-color: #050510;
  --neon-cyan: #00f3ff;
  --neon-magenta: #ff00ff;
  --neon-green: #00ff9d;
}
```

## 📚 Documentation

Comprehensive guides are available in the `docs/` folder:

- **[Game Data Structures](docs/GAME_DATA_STRUCTURES.md)** - Complete reference for all cell types, directions, level formats, and mirror behaviors
- **[Styling & Audio Guide](docs/STYLING_AUDIO_GUIDE.md)** - How to customize colors, themes, audio, and understand responsiveness
- **[Monetization Guide](docs/MONETIZATION_GUIDE.md)** - 8 ways to monetize your game with implementation examples
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Step-by-step instructions to deploy your game
- **[Level Editor Access](docs/LEVEL_EDITOR_ACCESS.md)** - How to use the Level Editor (developer-only feature)

## 🐛 Troubleshooting

**Game won't start:**
- Ensure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Check browser console for errors (F12)

**Blank screen:**
- Make sure you're accessing via the Vite dev server URL
- Check if port 5173 is already in use
- Try `npm run dev -- --port 3000` to use a different port

**Level Editor not working:**
- Ensure you're clicking inside the grid area
- Check browser console for JavaScript errors
- Try refreshing the page

## 📝 License

This project is a personal/educational project. Feel free to modify and use as needed.

## 🙏 Acknowledgments

Built with modern web technologies and a passion for puzzle games!
