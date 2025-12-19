import { CELL_TYPES, DIRECTIONS } from '../game/Grid.js';

export class FastSimulator {
    constructor() {
        this.maxSteps = 200; // Prevent infinite loops
    }

    /**
     * Simulates the laser path and returns hit receivers.
     * @param {Object} gridData - { width, height, cells[][] }
     * @param {Array} emitters - Array of {x, y, direction}
     * @returns {Set<string>} - Set of hit receiver IDs "x,y"
     */
    simulate(gridData, emitters) {
        const activeReceivers = new Set();

        // Process all emitters
        emitters.forEach(emitter => {
            this.castRay(emitter.x, emitter.y, emitter.direction, gridData, activeReceivers);
        });

        // Process internal emitters (if any are in grid cells)
        for (let y = 0; y < gridData.height; y++) {
            for (let x = 0; x < gridData.width; x++) {
                const cell = gridData.cells[y][x];
                if (cell && cell.type === CELL_TYPES.EMITTER) {
                    this.castRay(x, y, cell.direction, gridData, activeReceivers);
                }
            }
        }

        return activeReceivers;
    }

    castRay(startX, startY, startDir, gridData, activeReceivers) {
        let x = startX;
        let y = startY;
        let dir = startDir;
        let steps = 0;

        while (steps < this.maxSteps) {
            steps++;

            let dx = 0, dy = 0;
            if (dir === DIRECTIONS.UP) dy = -1;
            else if (dir === DIRECTIONS.RIGHT) dx = 1;
            else if (dir === DIRECTIONS.DOWN) dy = 1;
            else if (dir === DIRECTIONS.LEFT) dx = -1;
            else if (dir === DIRECTIONS.UP_RIGHT) { dx = 1; dy = -1; }
            else if (dir === DIRECTIONS.DOWN_RIGHT) { dx = 1; dy = 1; }
            else if (dir === DIRECTIONS.DOWN_LEFT) { dx = -1; dy = 1; }
            else if (dir === DIRECTIONS.UP_LEFT) { dx = -1; dy = -1; }

            const nextX = x + dx;
            const nextY = y + dy;

            // Check boundary
            if (nextX < 0 || nextX >= gridData.width || nextY < 0 || nextY >= gridData.height) {
                break;
            }

            const cell = gridData.cells[nextY][nextX];

            // If empty or null, continue
            if (!cell || cell.type === CELL_TYPES.EMPTY) {
                x = nextX;
                y = nextY;
                continue;
            }

            if (cell.type === CELL_TYPES.WALL) {
                break; // Stop
            } else if (cell.type === CELL_TYPES.RECEIVER) {
                activeReceivers.add(`${nextX},${nextY}`);
                // Laser passes through receiver? In original game, yes.
                // Original LaserSystem.js:
                // } else if (cell.type === CELL_TYPES.RECEIVER) {
                //    this.activeReceivers.add(`${nextX},${nextY}`);
                //    ... (does NOT break, so it continues through)
                // }
                x = nextX;
                y = nextY;
            } else if (cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_LINE) {
                // M2 Logic (Line / Double-sided)
                const rot = cell.rotation % 2; // only 0 (/) or 1 (\) matter really, grid uses 0-3 but it repeats
                // Actually original uses 0 and "else". 0 is /.

                // Original Logic:
                // if (cell.rotation === 0) { ... } else { ... }
                // Warning: Grid.js rotations might be 0,1,2,3.
                // 0 = /, 1 = \, 2 = /, 3 = \
                const isForwardSlash = (cell.rotation % 2 === 0);

                if (isForwardSlash) { // /
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.UP) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.LEFT;
                    else break; // Hit side?
                } else { // \
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.UP) dir = DIRECTIONS.LEFT;
                    else break;
                }
                x = nextX;
                y = nextY;
            } else if (cell.type === CELL_TYPES.MIRROR_TRIANGLE) {
                // M1 Logic
                let reflected = false;
                const rot = cell.rotation % 4;

                if (rot === 0) { // Bottom-Left Corner (reflects Right->Up, Down->Left)
                    if (dir === DIRECTIONS.RIGHT) { dir = DIRECTIONS.UP; reflected = true; }
                    else if (dir === DIRECTIONS.DOWN) { dir = DIRECTIONS.LEFT; reflected = true; }
                } else if (rot === 1) { // Top-Left Corner
                    if (dir === DIRECTIONS.RIGHT) { dir = DIRECTIONS.DOWN; reflected = true; }
                    else if (dir === DIRECTIONS.UP) { dir = DIRECTIONS.LEFT; reflected = true; }
                } else if (rot === 2) { // Top-Right Corner
                    if (dir === DIRECTIONS.LEFT) { dir = DIRECTIONS.DOWN; reflected = true; }
                    else if (dir === DIRECTIONS.UP) { dir = DIRECTIONS.RIGHT; reflected = true; }
                } else if (rot === 3) { // Bottom-Right Corner
                    if (dir === DIRECTIONS.LEFT) { dir = DIRECTIONS.UP; reflected = true; }
                    else if (dir === DIRECTIONS.DOWN) { dir = DIRECTIONS.RIGHT; reflected = true; }
                }

                if (!reflected) {
                    break; // Absorb/Block
                }
                x = nextX;
                y = nextY;
            } else if (cell.type === CELL_TYPES.MIRROR_OCTAGON) {
                // M3 Logic (Diagonal)
                const rot = cell.rotation % 4;
                if (rot === 0) dir = DIRECTIONS.UP_RIGHT;
                else if (rot === 1) dir = DIRECTIONS.DOWN_RIGHT;
                else if (rot === 2) dir = DIRECTIONS.DOWN_LEFT;
                else if (rot === 3) dir = DIRECTIONS.UP_LEFT;

                x = nextX;
                y = nextY;
            } else {
                // Unknown? Treat as empty/pass-through or block?
                // Block usually. But maybe we forgot a type.
                // Assuming block for safety.
                break;
            }
        }
    }
}
