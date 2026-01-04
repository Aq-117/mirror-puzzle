# 🖼️ How to Add Custom Images to Tutorial

The tutorial now supports using **screenshots** or **custom images** instead of the default drawn diagrams.

## 1. Take Your Screenshots 📸
1. Play the game and set up the scene you want to show (e.g., place an M3 mirror).
2. Take a screenshot or crop the specific area.
3. Save the image as a `.png` or `.jpg`.

## 2. Save Images to Project 📂
Create a folder in the `public` directory (create `public` if it doesn't exist) so the game can access them:
`public/assets/tutorial/`

Example file structure:
```
YourProject/
├── public/
│   └── assets/
│       └── tutorial/
│           ├── m1_mirror.png
│           ├── m2_mirror.png
│           ├── welcome.jpg
│           └── controls.png
```

## 3. Update the Code 📝
Open `src/game/TutorialSimple.js` and update the `this.steps` array. Add an `image` property to any step you want to change.

**Example:**
```javascript
this.steps = [
    // Step with a custom image
    { 
        title: "Basic Mirrors 🪞", 
        message: "M1: 90° Reflection...", 
        image: "./assets/tutorial/m1_mirror.png" // <--- ADD THIS LINE
        // 'visual' property is ignored if 'image' is present
    },
    
    // Step still using the code drawing (no 'image' property)
    { 
        title: "Walls 🧱", 
        message: "Obstacles...", 
        visual: 'walls' 
    }
];
```

## 4. Verify ✅
1. Save the file.
2. Refresh the game.
3. Open the tutorial - your image should now appear instead of the canvas drawing!

## 💡 Tips
- **Size**: Recommended image size is around **600x300 pixels**.
- **Aspect Ratio**: The display area is roughly **2:1**.
- **Style**: Using actual game screenshots makes the tutorial feel very authentic!
