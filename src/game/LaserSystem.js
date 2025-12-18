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
        const maxSteps = 100;
        let steps = 0;

        while (steps < maxSteps) {
            steps++;

            let dx = 0, dy = 0;
            // 0: UP, 1: RIGHT, 2: DOWN, 3: LEFT
            // 4: UP_RIGHT, 5: DOWN_RIGHT, 6: DOWN_LEFT, 7: UP_LEFT
            if (dir === DIRECTIONS.UP) dy = -1;
            else if (dir === DIRECTIONS.RIGHT) dx = 1;
            else if (dir === DIRECTIONS.DOWN) dy = 1;
            else if (dir === DIRECTIONS.LEFT) dx = -1;
            else if (dir === DIRECTIONS.UP_RIGHT) { dx = 1; dy = -1; }
            else if (dir === DIRECTIONS.DOWN_RIGHT) { dx = 1; dy = 1; }
            else if (dir === DIRECTIONS.DOWN_LEFT) { dx = -1; dy = 1; }
            else if (dir === DIRECTIONS.UP_LEFT) { dx = -1; dy = -1; }

            // Raycast to next cell
            let nextX = x + dx;
            let nextY = y + dy;

            // Add segment
            this.segments.push({
                x1: x + 0.5,
                y1: y + 0.5,
                x2: nextX + 0.5,
                y2: nextY + 0.5,
                color: '#00f3ff'
            });

            // Check boundary
            if (!this.grid.isValid(nextX, nextY)) {
                break;
            }

            const cell = this.grid.cells[nextY][nextX];

            if (cell.type === CELL_TYPES.WALL) {
                // Stop at wall
                if (particleSystem && renderer) {
                    const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                    const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                    if (Math.random() < 0.3) particleSystem.emit(px, py, '#ffaa00', 2);
                }
                break;
            } else if (cell.type === CELL_TYPES.RECEIVER) {
                this.activeReceivers.add(`${nextX},${nextY}`);
                if (particleSystem && renderer) {
                    const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                    const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                    if (Math.random() < 0.5) particleSystem.emit(px, py, '#00ff9d', 3);
                }
            } else if (cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_LINE) {
                // M2 Logic (Original)
                if (cell.rotation === 0) { // /
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.UP) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.LEFT;
                    else break;
                } else { // \
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.UP) dir = DIRECTIONS.LEFT;
                    else break;
                }
            } else if (cell.type === CELL_TYPES.MIRROR_TRIANGLE) {
                // M1 Logic (Triangle)
                let reflected = false;
                const rot = cell.rotation % 4;

                if (rot === 0) {
                    if (dir === DIRECTIONS.RIGHT) { dir = DIRECTIONS.UP; reflected = true; }
                    else if (dir === DIRECTIONS.DOWN) { dir = DIRECTIONS.LEFT; reflected = true; }
                } else if (rot === 1) {
                    if (dir === DIRECTIONS.RIGHT) { dir = DIRECTIONS.DOWN; reflected = true; }
                    else if (dir === DIRECTIONS.UP) { dir = DIRECTIONS.LEFT; reflected = true; }
                } else if (rot === 2) {
                    if (dir === DIRECTIONS.LEFT) { dir = DIRECTIONS.DOWN; reflected = true; }
                    else if (dir === DIRECTIONS.UP) { dir = DIRECTIONS.RIGHT; reflected = true; }
                } else if (rot === 3) {
                    if (dir === DIRECTIONS.LEFT) { dir = DIRECTIONS.UP; reflected = true; }
                    else if (dir === DIRECTIONS.DOWN) { dir = DIRECTIONS.RIGHT; reflected = true; }
                }

                if (!reflected) {
                    if (particleSystem && renderer) {
                        const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                        const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                        if (Math.random() < 0.3) particleSystem.emit(px, py, '#ffaa00', 2);
                    }
                    break;
                }
            } else if (cell.type === CELL_TYPES.MIRROR_OCTAGON) {
                // M3 (Diagonal Mirror)
                // Reflects Orthogonal inputs into Diagonals (45 deg deflection)
                const rot = cell.rotation % 4;

                if (rot === 0) { // NE (Horizontal <-> Diagonal /)
                    // RIGHT <-> UP_RIGHT
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.UP_RIGHT;
                    else if (dir === DIRECTIONS.UP_RIGHT) dir = DIRECTIONS.RIGHT;
                    // LEFT <-> DOWN_LEFT
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.DOWN_LEFT;
                    else if (dir === DIRECTIONS.DOWN_LEFT) dir = DIRECTIONS.LEFT;
                    else break;
                } else if (rot === 1) { // SE (Horizontal <-> Diagonal \)
                    // RIGHT <-> DOWN_RIGHT
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.DOWN_RIGHT;
                    else if (dir === DIRECTIONS.DOWN_RIGHT) dir = DIRECTIONS.RIGHT;
                    // LEFT <-> UP_LEFT
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.UP_LEFT;
                    else if (dir === DIRECTIONS.UP_LEFT) dir = DIRECTIONS.LEFT;
                    else break;
                } else if (rot === 2) { // SW (Vertical <-> Diagonal /)
                    // UP <-> UP_RIGHT
                    if (dir === DIRECTIONS.UP) dir = DIRECTIONS.UP_RIGHT;
                    else if (dir === DIRECTIONS.UP_RIGHT) dir = DIRECTIONS.UP;
                    // DOWN <-> DOWN_LEFT
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.DOWN_LEFT;
                    else if (dir === DIRECTIONS.DOWN_LEFT) dir = DIRECTIONS.DOWN;
                    else break;
                } else if (rot === 3) { // NW (Vertical <-> Diagonal \)
                    // UP <-> UP_LEFT
                    if (dir === DIRECTIONS.UP) dir = DIRECTIONS.UP_LEFT;
                    else if (dir === DIRECTIONS.UP_LEFT) dir = DIRECTIONS.UP;
                    // DOWN <-> DOWN_RIGHT
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.DOWN_RIGHT;
                    else if (dir === DIRECTIONS.DOWN_RIGHT) dir = DIRECTIONS.DOWN;
                    else break;
                }
            }

            // Move to next cell
            x = nextX;
            y = nextY;
        }
    }
}
