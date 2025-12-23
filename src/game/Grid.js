export const CELL_TYPES = {
    EMPTY: 0,
    WALL: 1,
    EMITTER: 2,
    RECEIVER: 3,
    MIRROR: 4, // Deprecated
    MIRROR_TRIANGLE: 6,
    MIRROR_LINE: 7,
    MIRROR_OCTAGON: 8, // M3 - Diagonal Mirror
    MIRROR_SQUARE: 9, // M4 - Diagonal to Orthogonal
    MIRROR_OMNI: 10, // M5 - Omni-directional (8-way)
    EMITTER_DIAGONAL: 11, // Dark Blue, diagonal only
    EMITTER_OMNI: 12, // Medium Blue, 8-way
    BLOCK: 5
};

export const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
    UP_RIGHT: 4,
    DOWN_RIGHT: 5,
    DOWN_LEFT: 6,
    UP_LEFT: 7
};

export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = Array(height).fill().map(() =>
            Array(width).fill().map(() => ({ type: CELL_TYPES.EMPTY }))
        );
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
        if (levelData.items) {
            levelData.items.forEach(item => {
                if (this.isValid(item.x, item.y)) {
                    let defaultDir = DIRECTIONS.RIGHT;
                    // Fix: Default Diagonal Emitters to a diagonal direction
                    if (item.type === CELL_TYPES.EMITTER_DIAGONAL) defaultDir = DIRECTIONS.DOWN_LEFT;

                    this.cells[item.y][item.x] = {
                        rotation: 0,
                        direction: defaultDir,
                        ...item
                    };
                }
            });
        }

        // Place emitters (internal ones need to be interactable)
        if (levelData.emitters) {
            levelData.emitters.forEach(emitter => {
                if (this.isValid(emitter.x, emitter.y)) {
                    this.cells[emitter.y][emitter.x] = {
                        type: CELL_TYPES.EMITTER,
                        ...emitter
                    };
                }
            });
        }
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
