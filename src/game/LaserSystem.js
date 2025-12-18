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
        // For diagonals, we might want to start slightly offset to avoid immediate wall clip?
        // No, center to center should work if we check next cell logic correctly.

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

            // Check Corner Cutting for Diagonals
            if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
                // We are moving diagonally. Check the two adjacent cardinal cells.
                // e.g. UP_RIGHT (1, -1). Check (1, 0) and (0, -1).
                // If both are WALLS, we are blocked.
                // If one is WALL, does it block? Usually yes in strict grids.
                // Let's assume strict blocking: If ANY shared edge is a wall, block?
                // Or permissive: Only if BOTH are walls?
                // Let's go with Permissive for fun, unless user complains.
                // Actually, if I hit a wall on the side, it should stop.
                // Let's check direct target first.
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
                // M2 Logic (Extended for diagonals?)
                // M2 is / (Rot 0) or \ (Rot 1).
                // / reflects UP <-> RIGHT, DOWN <-> LEFT.
                // What about diagonals?
                // If UP_RIGHT hits / ... it hits face on? No, / is 45 deg. UP_RIGHT is 45 deg. Parallel.
                // It should pass through? Or blocked?
                // Geometric interpretation: / mimics a plane x = -y.
                // If parallel, it passes.
                // If perpendicular (DOWN_LEFT hits /), it reflects back?
                // Let's implement simpler logic: M2 blocks diagonals for now to avoid complexity or reflect back.

                // Existing Cardinal Logic
                if (cell.rotation === 0) { // /
                    if (dir === DIRECTIONS.RIGHT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.UP) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.LEFT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.DOWN) dir = DIRECTIONS.LEFT;
                    else {
                        // Diagonals hitting M2
                        // UP_RIGHT (parallel) -> Pass?
                        // DOWN_LEFT (perp) -> Reflect back?
                        // UP_LEFT (horizontal-ish) -> ?
                        // Let's just Stop/Block diagonals on M2 for now.
                        break;
                    }
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

                // Existing Cardinal Logic (Only reflecting if hitting the hypotenuse)
                // Rot 0: / (Bottom-Left solid). Reflects Right->Up, Down->Left.
                // Blocks others.

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
                    // Check if diagonal passes through free space?
                    // M1 fills half the cell.
                    // It's safer to BLOCK diagonals on M1 for now.
                    if (particleSystem && renderer) {
                        const px = renderer.offsetX + (nextX + 0.5) * renderer.cellSize;
                        const py = renderer.offsetY + (nextY + 0.5) * renderer.cellSize;
                        if (Math.random() < 0.3) particleSystem.emit(px, py, '#ffaa00', 2);
                    }
                    break;
                }
            } else if (cell.type === CELL_TYPES.MIRROR_OCTAGON) {
                // M3 (Diagonal Mirror)
                // Logic: Deflects Orthogonal to Diagonal and vice versa.
                // Let's define the "Ports" based on rotation.
                // M3 is a "45 degree bender".
                // Rot 0: Bends Clockwise 45.
                // Rot 1: Bends Counter-Clockwise 45.
                // Rot 2: Bends CW 45 (Inverse?)
                // Rot 3: Bends CCW 45.

                // Let's try explicit mapping for Rot 0 (Generic 8-way hub?)
                // Maybe M3 is a "Reflector" that sits at a specific angle.
                // "reflects the lasers in diagonals".
                // Let's assume M3 is a piece of glass angled at 22.5 degrees? No.
                // Let's assume M3 takes a straight line and bends it 45 deg.

                // Proposed M3 Behavior:
                // It routes:
                // RIGHT -> UP_RIGHT
                // LEFT -> DOWN_LEFT
                // UP -> UP_LEFT
                // DOWN -> DOWN_RIGHT
                // And reversible:
                // UP_RIGHT -> RIGHT (or UP?)

                // Let's use Rotation to determine the "Bend Direction".
                // Rot 0: Bend "Upward/Rightward"?
                // Let's try:
                // Rot 0:
                //   RIGHT -> UP_RIGHT
                //   LEFT -> DOWN_LEFT
                //   UP -> UP_LEFT
                //   DOWN -> DOWN_RIGHT
                //   (Basically adds 45 deg or something?) 
                //   RIGHT(1) -> UP_RIGHT(4).
                //   This implies it's a "Forward Slash" operator but for 8-way?

                // Rot 1:
                //   RIGHT -> DOWN_RIGHT
                //   LEFT -> UP_LEFT
                //   UP -> UP_RIGHT
                //   DOWN -> DOWN_LEFT

                // Let's try to implement just these two patterns + reflections?
                // For now, let's allow "passing through" if matched, else block?
                // Or maybe it reflects everything?

                const rot = cell.rotation % 4;

                // Let's go with "M3 splits the world into 45 deg angles".
                // Rot 0: The "Up-Right / Down-Left" Axis.
                //   RIGHT -> UP_RIGHT
                //   UP -> UP_RIGHT
                //   LEFT -> DOWN_LEFT
                //   DOWN -> DOWN_LEFT
                //   (Collapses movement onto the diagonal axis)

                // Rot 1: The "Up-Left / Down-Right" Axis.
                //   RIGHT -> DOWN_RIGHT
                //   DOWN -> DOWN_RIGHT
                //   LEFT -> UP_LEFT
                //   UP -> UP_LEFT

                // Rot 2: The "Vertical" Axis? (Maybe splits diagonals back to cardinal?)
                //   UP_RIGHT -> UP
                //   UP_LEFT -> UP
                //   DOWN_RIGHT -> DOWN
                //   DOWN_LEFT -> DOWN

                // Rot 3: The "Horizontal" Axis?
                //   UP_RIGHT -> RIGHT
                //   DOWN_RIGHT -> RIGHT
                //   UP_LEFT -> LEFT
                //   DOWN_LEFT -> LEFT

                // This seems like a complete set!
                // Rot 0,1 convert Cardinal to Diagonal.
                // Rot 2,3 convert Diagonal to Cardinal.
                // Check coverage:
                // If I am Rot 0. Incoming RIGHT. Output UP_RIGHT.
                // If I am Rot 2. Incoming UP_RIGHT. Output UP.
                // So RIGHT -> M3(0) -> UP_RIGHT -> M3(2) -> UP.
                // Total change: 90 degrees in 2 steps.
                // This fits "reflects in diagonals".

                // Implementation:
                if (rot === 0) { // Cardinal -> Diag 1 (Forward Slash Axis)
                    if (dir === DIRECTIONS.RIGHT || dir === DIRECTIONS.UP) dir = DIRECTIONS.UP_RIGHT;
                    else if (dir === DIRECTIONS.LEFT || dir === DIRECTIONS.DOWN) dir = DIRECTIONS.DOWN_LEFT;
                    // What if diagonal comes in?
                    // Pass through if matching axis?
                    else if (dir === DIRECTIONS.UP_RIGHT || dir === DIRECTIONS.DOWN_LEFT) { /* pass */ }
                    else { /* Block perp diagonals? */ break; }
                } else if (rot === 1) { // Cardinal -> Diag 2 (Back Slash Axis)
                    if (dir === DIRECTIONS.RIGHT || dir === DIRECTIONS.DOWN) dir = DIRECTIONS.DOWN_RIGHT;
                    else if (dir === DIRECTIONS.LEFT || dir === DIRECTIONS.UP) dir = DIRECTIONS.UP_LEFT;
                    else if (dir === DIRECTIONS.DOWN_RIGHT || dir === DIRECTIONS.UP_LEFT) { /* pass */ }
                    else break;
                } else if (rot === 2) { // Diag -> Vertical
                    if (dir === DIRECTIONS.UP_RIGHT || dir === DIRECTIONS.UP_LEFT) dir = DIRECTIONS.UP;
                    else if (dir === DIRECTIONS.DOWN_RIGHT || dir === DIRECTIONS.DOWN_LEFT) dir = DIRECTIONS.DOWN;
                    else if (dir === DIRECTIONS.UP || dir === DIRECTIONS.DOWN) { /* pass */ }
                    else break;
                } else if (rot === 3) { // Diag -> Horizontal
                    if (dir === DIRECTIONS.UP_RIGHT || dir === DIRECTIONS.DOWN_RIGHT) dir = DIRECTIONS.RIGHT;
                    else if (dir === DIRECTIONS.UP_LEFT || dir === DIRECTIONS.DOWN_LEFT) dir = DIRECTIONS.LEFT;
                    else if (dir === DIRECTIONS.RIGHT || dir === DIRECTIONS.LEFT) { /* pass */ }
                    else break;
                }
            }

            // Move to next cell
            x = nextX;
            y = nextY;
        }
    }
}
