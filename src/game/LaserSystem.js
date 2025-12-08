import { CELL_TYPES, DIRECTIONS } from './Grid.js';

export class LaserSystem {
    constructor(grid) {
        this.grid = grid;
        this.segments = []; // Array of {x1, y1, x2, y2, color}
        this.activeReceivers = new Set();
    }

    update(particleSystem, renderer, emitters) {
        this.segments = [];
        this.activeReceivers.clear();

        // Process external emitters
        if (emitters) {
            emitters.forEach(emitter => {
                this.castRay(emitter.x, emitter.y, emitter.direction, particleSystem, renderer);
            });
        }

        // Find all internal emitters (if any still exist)
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.cells[y][x];
                if (cell.type === CELL_TYPES.EMITTER) {
                    this.castRay(x, y, cell.direction, particleSystem, renderer);
                }
            }
        }
    }

    castRay(startX, startY, startDir, particleSystem, renderer) {
        let x = startX;
        let y = startY;
        let dir = startDir;

        // Start from center of the cell
        let currentX = x + 0.5;
        let currentY = y + 0.5;

        const maxSteps = 100; // Prevent infinite loops
        let steps = 0;

        while (steps < maxSteps) {
            steps++;

            let dx = 0, dy = 0;
            if (dir === DIRECTIONS.UP) dy = -1;
            if (dir === DIRECTIONS.RIGHT) dx = 1;
            if (dir === DIRECTIONS.DOWN) dy = 1;
            if (dir === DIRECTIONS.LEFT) dx = -1;

            // Raycast to next cell center
            let nextX = x + dx;
            let nextY = y + dy;

            // Add segment
            this.segments.push({
                x1: x + 0.5,
                y1: y + 0.5,
                x2: nextX + 0.5,
                y2: nextY + 0.5
            });

            // Check boundary
            if (!this.grid.isValid(nextX, nextY)) {
                // If we are outside, we stop unless we are just entering the grid
                // But wait, if we start at -1, nextX is 0, which IS valid.
                // So we only break if nextX/Y is invalid AND we are not coming from outside?
                // Actually, if nextX/Y is invalid, the ray leaves the grid.
                break;
            }

            const cell = this.grid.cells[nextY][nextX];

            if (cell.type === CELL_TYPES.WALL) {
                // Stop at wall
                if (particleSystem && renderer) {
                    // Calculate pixel position for particles
                    const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                    const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                    // Emit sparks
                    if (Math.random() < 0.3) { // Limit emission rate
                        particleSystem.emit(px, py, '#ffaa00', 2);
                    }
                }
                break;
            } else if (cell.type === CELL_TYPES.RECEIVER) {
                // Hit receiver
                this.activeReceivers.add(`${nextX},${nextY}`);
                if (particleSystem && renderer) {
                    const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                    const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                    if (Math.random() < 0.5) {
                        particleSystem.emit(px, py, '#00ff9d', 3);
                    }
                }
                // Laser passes through receiver, so we DO NOT break here.
            } else if (cell.type === CELL_TYPES.MIRROR) {
                // Reflect
                if (cell.rotation === 0) { // /
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.UP) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.LEFT;
                } else { // \
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.UP) dir = DIRECTIONS.LEFT;
                }
            }

            // Move to next cell
            x = nextX;
            y = nextY;
        }
    }
}
