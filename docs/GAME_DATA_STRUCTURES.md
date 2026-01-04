# Game Data Structures & Design Documentation

## 📊 Core Constants & Enums

### CELL_TYPES (Grid.js)
All possible cell types in the game grid:

```javascript
CELL_TYPES = {
    EMPTY: 0,           // Empty playable cell
    WALL: 1,            // Solid wall (blocks lasers)
    EMITTER: 2,         // Standard laser emitter (orthogonal only)
    RECEIVER: 3,        // Laser target (goal)
    MIRROR: 4,          // ⚠️ DEPRECATED - Old mirror type
    BLOCK: 5,           // Solid block (same as wall)
    
    // Mirror Types (M1-M5)
    MIRROR_TRIANGLE: 6, // M1 - 90° reflector
    MIRROR_LINE: 7,     // M2 - Diagonal reflector (/ or \)
    MIRROR_OCTAGON: 8,  // M3 - Orthogonal → Diagonal converter
    MIRROR_SQUARE: 9,   // M4 - Diagonal → Orthogonal converter
    MIRROR_OMNI: 10,    // M5 - Universal 8-way redirector
    
    // Emitter Variants
    EMITTER_DIAGONAL: 11, // Diagonal-only emitter
    EMITTER_OMNI: 12      // 8-directional emitter
}
```

### DIRECTIONS (Grid.js)
8-directional movement system:

```javascript
DIRECTIONS = {
    // Orthogonal (4-way)
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    
    // Diagonal (4-way)
    UP_RIGHT: 4,
    DOWN_RIGHT: 5,
    DOWN_LEFT: 6,
    UP_LEFT: 7
}
```

**Usage:**
- Emitter direction (which way laser shoots)
- Mirror rotation states
- Laser beam travel direction

---

## 🎯 Cell Object Structure

Every grid cell is an object with these properties:

### Base Cell
```javascript
{
    type: CELL_TYPES.EMPTY  // Required: Cell type
}
```

### Mirror Cell (M1-M5)
```javascript
{
    type: CELL_TYPES.MIRROR_TRIANGLE,  // Required
    x: 2,                               // Required: Grid X position
    y: 3,                               // Required: Grid Y position
    rotation: 0,                        // Required: 0-3 for most, 0-7 for M5
    locked: true,                       // Optional: If true, exists in level
    fixedRotation: false                // Optional: If false, user can rotate
}
```

**Mirror Properties Explained:**
- `rotation`: Current orientation (0 = default, increments clockwise)
- `locked`: 
  - `true` = Pre-placed in level (Red or Yellow outline)
  - `false` or undefined = User-placed (can be removed)
- `fixedRotation`:
  - `true` = Cannot rotate (Red outline)
  - `false` = Can rotate (Yellow outline)
  - Only relevant if `locked: true`

### Emitter Cell
```javascript
{
    type: CELL_TYPES.EMITTER,     // Or EMITTER_DIAGONAL, EMITTER_OMNI
    x: 1,                          // Required
    y: -1,                         // Can be outside grid (external emitter)
    direction: DIRECTIONS.DOWN     // Required: Laser shoot direction
}
```

**Emitter Placement:**
- **Internal**: `x, y` within grid bounds → Placed on grid
- **External**: `x, y` outside grid → Shoots from border

### Receiver Cell
```javascript
{
    type: CELL_TYPES.RECEIVER,
    x: 3,
    y: 3
}
```

### Wall Cell
```javascript
{
    type: CELL_TYPES.WALL,
    x: 1,
    y: 2
}
```

---

## 📋 Level Data Structure

### Complete Level Object
```javascript
{
    id: 1,                          // Unique level number
    name: "Level 1",                // Display name
    
    grid: {                         // Grid dimensions
        width: 5,
        height: 5
    },
    
    items: [                        // All non-emitter objects
        { x: 2, y: 2, type: CELL_TYPES.RECEIVER },
        { 
            x: 1, 
            y: 1, 
            type: CELL_TYPES.MIRROR_TRIANGLE, 
            rotation: 0,
            locked: true,
            fixedRotation: false 
        }
    ],
    
    emitters: [                     // All laser sources
        { x: 0, y: -1, direction: DIRECTIONS.DOWN }
    ],
    
    inventory: {                    // Available mirrors for player
        mirror1: 2,  // M1 (Triangle)
        mirror2: 1,  // M2 (Line)
        mirror3: 0,  // M3 (Octagon)
        mirror4: 0,  // M4 (Square)
        mirror5: 0   // M5 (Omni)
    }
}
```

---

## 🔄 Why Different Level Definition Styles?

You'll see variations in level definitions. Here's why:

### Style 1: Minimal (Early Levels)
```javascript
{
    id: 1,
    name: "Level 1",
    grid: { width: 4, height: 4 },
    items: [
        { x: 0, y: 2, type: CELL_TYPES.RECEIVER }
    ],
    emitters: [
        { x: 1, y: -1, direction: DIRECTIONS.DOWN }
    ],
    inventory: { mirror1: 1, mirror2: 0 }
}
```
**Why:** Simple levels don't need complex properties. Defaults are assumed.

### Style 2: With Locked Mirrors (Mid Levels)
```javascript
{
    id: 20,
    name: "Level 20",
    grid: { width: 6, height: 6 },
    items: [
        { x: 2, y: 2, type: CELL_TYPES.RECEIVER },
        { 
            x: 3, 
            y: 3, 
            type: CELL_TYPES.MIRROR_TRIANGLE, 
            rotation: 1,
            locked: true,      // Pre-placed
            fixedRotation: false  // Can rotate
        }
    ],
    emitters: [...],
    inventory: { mirror1: 1, mirror2: 1, mirror3: 0, mirror4: 0, mirror5: 0 }
}
```
**Why:** Introduces pre-placed mirrors as part of the puzzle.

### Style 3: Complex (Advanced Levels)
```javascript
{
    id: 50,
    name: "Level 50",
    grid: { width: 8, height: 8 },
    items: [
        { x: 1, y: 1, type: CELL_TYPES.WALL },
        { x: 2, y: 2, type: CELL_TYPES.RECEIVER },
        { 
            x: 3, y: 3, 
            type: CELL_TYPES.MIRROR_SQUARE,  // M4
            rotation: 2,
            locked: true,
            fixedRotation: true  // Cannot rotate (Red)
        },
        {
            x: 4, y: 4,
            type: CELL_TYPES.EMITTER_DIAGONAL,  // Internal diagonal emitter
            direction: DIRECTIONS.DOWN_LEFT
        }
    ],
    emitters: [
        { x: -1, y: 3, direction: DIRECTIONS.RIGHT }  // External
    ],
    inventory: { mirror1: 0, mirror2: 0, mirror3: 2, mirror4: 1, mirror5: 0 }
}
```
**Why:** Uses all features - walls, multiple mirror types, internal emitters, fixed mirrors.

---

## 🎨 Visual Color Coding

### Mirror States (Renderer.js)
```javascript
// M1-M5 Default Colors (when unlocked, not placed)
M1: Magenta (#ff00ff)
M2: Magenta (#ff00ff)
M3: Cyan (#00f3ff)
M4: Purple (#BF00FF)
M5: Gold (#FFD700)

// When Locked (Pre-placed in level)
Fixed (cannot rotate):    Red (#ff3333)
Rotatable (can rotate):   Yellow (#ffff00)
```

### Emitter Colors
```javascript
Standard:  Cyan (#00f3ff)
Diagonal:  Cyan body + Dark Blue square hint (#00008b)
Omni:      Cyan body + Royal Blue circle hint (#4169e1)
```

---

## 🔧 Game State Management

### Game.js Properties
```javascript
{
    currentLevel: 5,              // Current level index (-1 for test/generated)
    maxLevelReached: 10,          // Highest unlocked level
    
    inventory: {                  // Current available mirrors
        mirror1: 2,
        mirror2: 1,
        mirror3: 0,
        mirror4: 0,
        mirror5: 0
    },
    
    initialInventory: {...},      // For "Remaining/Total" UI display
    
    selectedMirrorType: 6,        // Currently selected mirror (CELL_TYPES value)
    isRemoveMode: false,          // Remove button active?
    
    history: [],                  // Undo stack (max 50 moves)
    
    generatedLevel: {...}         // Stores test/generated level data
}
```

### History Entry (Undo System)
```javascript
{
    x: 2,                         // Cell X coordinate
    y: 3,                         // Cell Y coordinate
    prevCell: {                   // Previous cell state
        type: CELL_TYPES.MIRROR_TRIANGLE,
        rotation: 1
    },
    prevInventory: {              // Previous inventory state
        mirror1: 3,
        mirror2: 1,
        ...
    }
}
```

---

## 🎯 Mirror Behavior Reference

### M1 (Triangle) - MIRROR_TRIANGLE
- **Rotations:** 4 states (0-3)
- **Behavior:** Reflects orthogonal beams 90° (only 2 input sides work)
- **Rotation Direction:** Counter-clockwise (inverted from others)

### M2 (Line) - MIRROR_LINE
- **Rotations:** 2 states (0-1)
  - 0 = `/` (diagonal up-right)
  - 1 = `\` (diagonal down-right)
- **Behavior:** Simple diagonal reflection

### M3 (Octagon) - MIRROR_OCTAGON
- **Rotations:** 4 states (0-3)
- **Behavior:** Converts ANY orthogonal input → specific diagonal output
  - 0 = UP_RIGHT
  - 1 = DOWN_RIGHT
  - 2 = DOWN_LEFT
  - 3 = UP_LEFT

### M4 (Square) - MIRROR_SQUARE
- **Rotations:** 4 states (0-3)
- **Behavior:** Converts diagonal inputs → orthogonal outputs
  - 0 = UP
  - 1 = RIGHT
  - 2 = DOWN
  - 3 = LEFT
- **Blocks:** Orthogonal inputs (doesn't reflect them)

### M5 (Omni) - MIRROR_OMNI
- **Rotations:** 8 states (0-7)
- **Behavior:** Redirects ANY input → ANY of 8 directions
- **Ultimate:** Most powerful mirror

---

## 📍 Coordinate System

```
Grid Coordinates (0-indexed):
    0   1   2   3   (x)
0  [ ] [ ] [ ] [ ]
1  [ ] [R] [ ] [ ]
2  [ ] [ ] [M] [ ]
3  [ ] [ ] [ ] [ ]
(y)

External Emitter Positions:
- Top:    y = -1,  x = 0 to width-1
- Bottom: y = height, x = 0 to width-1
- Left:   x = -1, y = 0 to height-1
- Right:  x = width, y = 0 to height-1
```

---

## 🔄 Data Flow

```
Level Load:
levels.js → Game.loadLevel() → Grid.initialize() → Renderer.draw()

User Interaction:
Mouse Click → InputHandler → Game.pushHistory() → Grid.setCell() → 
→ Game.updateInventoryUI() → LaserSystem.update() → Renderer.draw()

Undo:
Undo Button → Game.undo() → history.pop() → Grid.setCell() → 
→ Restore inventory → Renderer.draw()
```

---

## 💡 Design Decisions Explained

### Why `locked` and `fixedRotation` are separate?
- **Flexibility:** A mirror can be pre-placed (`locked: true`) but still rotatable (`fixedRotation: false`)
- **Visual Clarity:** Red = Fixed, Yellow = Rotatable, both are "locked" (pre-placed)

### Why different emitter types?
- **Gameplay Variety:** Different beam angles create unique puzzle mechanics
- **Progressive Difficulty:** Standard → Diagonal → Omni increases complexity

### Why external emitters?
- **Space Efficiency:** Don't waste grid cells on emitters
- **Clean Design:** Lasers come from "outside" the puzzle area
- **Flexibility:** Can shoot from any border position

### Why `rotation` vs `direction`?
- **Mirrors:** Use `rotation` (0-3 or 0-7) because they have fixed orientations
- **Emitters:** Use `direction` (DIRECTIONS enum) because they shoot in a specific direction

---

## 🎓 Quick Reference

**Adding a simple level:**
```javascript
{
    id: 99,
    name: "My Level",
    grid: { width: 5, height: 5 },
    items: [
        { x: 2, y: 2, type: 3 }  // Receiver at center
    ],
    emitters: [
        { x: 0, y: -1, direction: 2 }  // Top-left, shooting down
    ],
    inventory: { mirror1: 1, mirror2: 0, mirror3: 0, mirror4: 0, mirror5: 0 }
}
```

**Adding a complex level:**
```javascript
{
    id: 100,
    name: "Advanced Puzzle",
    grid: { width: 7, height: 7 },
    items: [
        { x: 1, y: 1, type: 1 },  // Wall
        { x: 3, y: 3, type: 3 },  // Receiver
        { x: 2, y: 2, type: 6, rotation: 0, locked: true, fixedRotation: true }  // Fixed M1
    ],
    emitters: [
        { x: -1, y: 3, direction: 1 },  // Left border, shooting right
        { x: 3, y: -1, direction: 2 }   // Top border, shooting down
    ],
    inventory: { mirror1: 2, mirror2: 1, mirror3: 1, mirror4: 0, mirror5: 0 }
}
```

This documentation should clarify all the data structures and design patterns! 🎮
