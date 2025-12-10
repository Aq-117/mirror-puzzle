export const CELL_TYPES = {
    EMPTY: 0,
    WALL: 1,
    EMITTER: 2,
    RECEIVER: 3,
    MIRROR: 4, // Deprecated, use specific types
    MIRROR_TRIANGLE: 6,
    MIRROR_LINE: 7,
    BLOCK: 5 // Blocks laser but not a wall (maybe movable later)
};

export const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = Array(height).fill().map(() => Array(width).fill(null));
        this.cellSize = 50; // Default, will be resized based on canvas
    }

    initialize(levelData) {
        this.width = levelData.grid.width;
        this.height = levelData.grid.height;
        this.cells = Array(this.height).fill().map(() => Array(this.width).fill(null));

        // Initialize empty cells
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x] = { type: CELL_TYPES.EMPTY };
            }
        }

        // Place items
        levelData.items.forEach(item => {
            if (this.isValid(item.x, item.y)) {
                this.cells[item.y][item.x] = { ...item };
            }
        });
    }

    isValid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    getCell(x, y) {
        if (!this.isValid(x, y)) return null;
        return this.cells[y][x];
    }

    setCell(x, y, data) {
        if (this.isValid(x, y)) {
            this.cells[y][x] = data;
        }
    }

    clearCell(x, y) {
        if (this.isValid(x, y)) {
            this.cells[y][x] = { type: CELL_TYPES.EMPTY };
        }
    }
}
