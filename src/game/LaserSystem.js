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
                // Only process if it is NOT within the grid (internal ones are handled below)
                if (!this.grid.isValid(emitter.x, emitter.y)) {
                    this.castRay(emitter.x, emitter.y, emitter.direction, particleSystem, renderer);
                }
            });
        }

        // Find all internal emitters (if any still exist)
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.cells[y][x];
                if (cell.type === CELL_TYPES.EMITTER) {
                    this.castRay(x, y, cell.direction, particleSystem, renderer, '#00f3ff');
                } else if (cell.type === CELL_TYPES.EMITTER_DIAGONAL) {
                    this.castRay(x, y, cell.direction, particleSystem, renderer, '#00f3ff'); // Revert to Cyan
                } else if (cell.type === CELL_TYPES.EMITTER_OMNI) {
                    this.castRay(x, y, cell.direction, particleSystem, renderer, '#00f3ff'); // Revert to Cyan
                }
            }
        }
    }

    castRay(startX, startY, startDir, particleSystem, renderer, color = '#00f3ff') {
        let x = startX;
        let y = startY;
        let dir = startDir;

        // Start from center of the cell
        const maxSteps = 100;
        let steps = 0;

        // Loop protection: Track visited states (x, y, dir) for THIS ray
        const visited = new Set();
        visited.add(`${x},${y},${dir}`);

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

            // Check boundary
            if (!this.grid.isValid(nextX, nextY)) {
                // Add final segment to wall/boundary?
                this.segments.push({
                    x1: x + 0.5,
                    y1: y + 0.5,
                    x2: nextX + 0.5,
                    y2: nextY + 0.5,
                    color: '#00f3ff'
                });
                break;
            }

            // Loop/Cycle Check: Have we entered this cell with this direction before?
            // Note: We check entrance state.
            const state = `${nextX},${nextY},${dir}`;
            if (visited.has(state)) {
                // Cycle detected, break to prevent infinite overlap intensity
                // Draw the connecting segment before breaking
                this.segments.push({
                    x1: x + 0.5,
                    y1: y + 0.5,
                    x2: nextX + 0.5,
                    y2: nextY + 0.5,
                    color: color
                });
                break;
            }
            visited.add(state);

            // Add segment
            this.segments.push({
                x1: x + 0.5,
                y1: y + 0.5,
                x2: nextX + 0.5,
                y2: nextY + 0.5,
                color: color
            });

            const cell = this.grid.cells[nextY][nextX];

            // Interaction Logic
            if (cell.type === CELL_TYPES.WALL) {
                // Stop at wall
                if (particleSystem && renderer) {
                    const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                    const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                    if (Math.random() < 0.3) particleSystem.emit(px, py, '#ffaa00', 2);
                }
                break;
            } else if (cell.type === CELL_TYPES.EMITTER) {
                // Block lasers from passing through other emitters
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
                    // Hit non-reflective side of M1
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

                if (rot === 0) { // NE Output
                    dir = DIRECTIONS.UP_RIGHT;
                } else if (rot === 1) { // SE Output
                    dir = DIRECTIONS.DOWN_RIGHT;
                } else if (rot === 2) { // SW Output
                    dir = DIRECTIONS.DOWN_LEFT;
                } else if (rot === 3) { // NW Output
                    dir = DIRECTIONS.UP_LEFT;
                }

                // Allow Diagonal -> Orthogonal?
                // The prompt says "reflects orthogonal... into specific diagonal".
                // It does NOT say M3 converts Diagonal back to Orthogonal.
                // If the user wants to "close the loop", they might need M3 to be bidirectional.
                // But "reflection in all 4 directions" usually implies the ACTIVE role is Orth->Diag.
                // We will stick to strictly directing to Diagonals for now to satisfy the "all 4 directions" constraint.
                // If a diagonal enters, it just gets redirected to the new diagonal (or passes through if same).
            } else if (cell.type === CELL_TYPES.MIRROR_SQUARE) {
                // M4 (Square Mirror)
                // Reflects DIAGONAL inputs into ORTHOGONAL outputs
                const rot = cell.rotation % 4;

                // Only interact if input is diagonal
                if ([DIRECTIONS.UP_RIGHT, DIRECTIONS.UP_LEFT, DIRECTIONS.DOWN_RIGHT, DIRECTIONS.DOWN_LEFT].includes(dir)) {
                    if (rot === 0) dir = DIRECTIONS.UP;
                    else if (rot === 1) dir = DIRECTIONS.RIGHT;
                    else if (rot === 2) dir = DIRECTIONS.DOWN;
                    else if (rot === 3) dir = DIRECTIONS.LEFT;
                } else {
                    // Block Orthogonal inputs
                    if (particleSystem && renderer) {
                        const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                        const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                        if (Math.random() < 0.3) particleSystem.emit(px, py, '#ffaa00', 2);
                    }
                    break;
                }
            } else if (cell.type === CELL_TYPES.MIRROR_OMNI) {
                // M5 (Omni Mirror)
                // Reflects ANY input to one of 8 directions based on rotation
                // Rotation is 0-7
                dir = cell.rotation % 8;
            }

            // Move to next cell
            x = nextX;
            y = nextY;
        }
    }
}
