import { CELL_TYPES, DIRECTIONS } from '../game/Grid.js';
import { Solver } from './Solver.js';
import { FastSimulator } from './FastSimulator.js';

export class LevelGenerator {
    constructor() {
        this.solver = new Solver();
        this.simulator = new FastSimulator();
    }

    generate(config = {}) {
        // Randomize difficulty if not specified
        const difficulty = config.difficulty || Math.random() < 0.3 ? 'HARD' : (Math.random() < 0.5 ? 'MEDIUM' : 'EASY');

        let width = 6, height = 6;
        let numEmitters = 1;
        let minPathLength = 4;
        let allowedMirrors = [CELL_TYPES.MIRROR_TRIANGLE];

        if (difficulty === 'EASY') {
            width = 6; height = 6;
            numEmitters = 1;
            minPathLength = 4;
            allowedMirrors = [CELL_TYPES.MIRROR_TRIANGLE];
        } else if (difficulty === 'MEDIUM') {
            width = 7; height = 7;
            numEmitters = Math.random() < 0.3 ? 2 : 1;
            minPathLength = 5;
            allowedMirrors = [CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE];
        } else if (difficulty === 'HARD') {
            width = Math.floor(Math.random() * 3) + 8; // 8, 9, 10
            height = width;
            numEmitters = Math.random() < 0.5 ? 2 : 1; // 50% chance of 2 emitters
            minPathLength = 7;
            allowedMirrors = [CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON];
        }

        // Override if config provided
        if (config.width) width = config.width;
        if (config.height) height = config.height;

        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            attempts++;

            const level = {
                id: Date.now(),
                name: `Generated ${difficulty} Level`,
                grid: { width, height },
                items: [],
                emitters: [],
                inventory: { mirror1: 0, mirror2: 0, mirror3: 0 }
            };

            const occupied = new Set();
            const placementHistory = []; // Track mirrors placed for removal later

            // Generate Paths for each emitter
            let totalPathLength = 0;
            let success = true;

            for (let e = 0; e < numEmitters; e++) {
                // Place Emitter
                const edgeData = this.getRandomEdge(width, height, occupied);
                if (!edgeData) { success = false; break; }

                level.emitters.push({ x: edgeData.x, y: edgeData.y, direction: edgeData.dir });

                // Track start position
                let cx = this.clamp(edgeData.x, 0, width - 1); // If edge is -1
                let cy = this.clamp(edgeData.y, 0, height - 1);

                // Adjust if emitter is outside
                if (edgeData.x < 0) cx = 0;
                else if (edgeData.x >= width) cx = width - 1;
                else if (edgeData.y < 0) cy = 0;
                else if (edgeData.y >= height) cy = height - 1;

                let cDir = edgeData.dir;
                let pathLen = 0;

                // Mark start as occupied?
                // occupied.add(`${cx},${cy}`);

                // Walk
                let stepsIdx = 0;
                const maxSteps = 20; // Safety
                while (pathLen < minPathLength && stepsIdx < maxSteps) {
                    stepsIdx++;

                    // Raycast forward
                    const dist = Math.floor(Math.random() * (Math.max(width, height) / 2)) + 1;
                    let nx = cx, ny = cy;
                    let hitBlock = false;

                    for (let k = 0; k < dist; k++) {
                        let dx = 0, dy = 0;
                        if (cDir === DIRECTIONS.UP) dy = -1;
                        else if (cDir === DIRECTIONS.RIGHT) dx = 1;
                        else if (cDir === DIRECTIONS.DOWN) dy = 1;
                        else if (cDir === DIRECTIONS.LEFT) dx = -1;
                        else if (cDir === DIRECTIONS.UP_RIGHT) { dx = 1; dy = -1; } // M3 Support...

                        // Check Basic Validity
                        if (this.isValid(nx + dx, ny + dy, width, height) && !occupied.has(`${nx + dx},${ny + dy}`)) {
                            nx += dx; ny += dy;
                        } else {
                            hitBlock = true;
                            break;
                        }
                    }

                    if (nx === cx && ny === cy) {
                        // Stuck, just break and try to place receiver?
                        break;
                    }

                    cx = nx; cy = ny;
                    occupied.add(`${cx},${cy}`);

                    // Turn
                    const turnDir = Math.random() < 0.5 ? 'LEFT' : 'RIGHT';
                    const mirrorType = allowedMirrors[Math.floor(Math.random() * allowedMirrors.length)];

                    // Calculate Rotation
                    const rotationData = this.calculateRotation(cDir, turnDir, mirrorType);

                    if (rotationData) {
                        placementHistory.push({ x: cx, y: cy, type: mirrorType, rotation: rotationData.rot });
                        cDir = rotationData.newDir;
                        pathLen++;
                    } else {
                        // Impossible turn with this mirror?
                        break;
                    }
                }

                totalPathLength += pathLen;

                // Place Receiver
                // Move one step from last position in current direction
                let rx = cx, ry = cy;
                let dx = 0, dy = 0;
                // Basic dirs
                if (cDir === DIRECTIONS.UP) dy = -1;
                else if (cDir === DIRECTIONS.RIGHT) dx = 1;
                else if (cDir === DIRECTIONS.DOWN) dy = 1;
                else if (cDir === DIRECTIONS.LEFT) dx = -1;
                else if (cDir === DIRECTIONS.UP_RIGHT) { dx = 1; dy = -1; }
                else if (cDir === DIRECTIONS.DOWN_RIGHT) { dx = 1; dy = 1; }
                else if (cDir === DIRECTIONS.DOWN_LEFT) { dx = -1; dy = 1; }
                else if (cDir === DIRECTIONS.UP_LEFT) { dx = -1; dy = -1; }

                rx += dx; ry += dy;

                if (this.isValid(rx, ry, width, height) && !occupied.has(`${rx},${ry}`)) {
                    level.items.push({ x: rx, y: ry, type: CELL_TYPES.RECEIVER });
                    occupied.add(`${rx},${ry}`);
                } else {
                    // Failed to place receiver properly
                    success = false;
                }
            }

            if (!success || totalPathLength < minPathLength) continue;

            // Convert Placed Mirrors to Inventory or Fixed
            placementHistory.forEach(item => {
                const isFixed = Math.random() < 0.25; // 25% Fixed
                if (isFixed) {
                    level.items.push({
                        x: item.x, y: item.y, type: item.type,
                        rotation: item.rotation,
                        locked: true,
                        fixedRotation: Math.random() > 0.5
                    });
                    occupied.add(`${item.x},${item.y}`);
                } else {
                    // Add to Inventory
                    if (item.type === CELL_TYPES.MIRROR_TRIANGLE) level.inventory.mirror1++;
                    else if (item.type === CELL_TYPES.MIRROR_LINE) level.inventory.mirror2++;
                    else if (item.type === CELL_TYPES.MIRROR_OCTAGON) level.inventory.mirror3++;
                }
            });

            // Decoy Walls
            // Place walls to simple block direct paths or just add noise
            const wallCount = Math.floor(width * height * 0.1); // 10% walls
            for (let i = 0; i < wallCount; i++) {
                const wx = Math.floor(Math.random() * width);
                const wy = Math.floor(Math.random() * height);
                if (!occupied.has(`${wx},${wy}`) && this.isValid(wx, wy, width, height)) {
                    level.items.push({ x: wx, y: wy, type: CELL_TYPES.WALL });
                    occupied.add(`${wx},${wy}`);
                }
            }

            // Validate
            const solveResult = this.solver.solve(level);
            if (solveResult.solvable) {
                return level;
            }
        }

        throw new Error("Generation Failed");
    }

    // Helper: Determine rotation for a turn
    calculateRotation(inDir, turn, type) {
        // Simplified Logic: 
        // We iterate all rotations of the mirror type.
        // We simulate "reflect" logic locally.
        // If output matches desired turn, we pick it.

        // Desired params:
        // turn='LEFT' means if I am UP, I want LEFT. 
        // turn='RIGHT' means if I am UP, I want RIGHT.
        // For M3 (Diag), 'LEFT' from UP might mean UP_LEFT or DOWN_LEFT?
        // Let's define turns loosely.

        const testMirror = (rot) => {
            // Use FastSimulator logic implicitly
            let dir = inDir;
            if (type === CELL_TYPES.MIRROR_TRIANGLE) {
                const r = rot % 4;
                if (r === 0) { if (dir === DIRECTIONS.RIGHT) return DIRECTIONS.UP; if (dir === DIRECTIONS.DOWN) return DIRECTIONS.LEFT; }
                else if (r === 1) { if (dir === DIRECTIONS.RIGHT) return DIRECTIONS.DOWN; if (dir === DIRECTIONS.UP) return DIRECTIONS.LEFT; }
                else if (r === 2) { if (dir === DIRECTIONS.LEFT) return DIRECTIONS.DOWN; if (dir === DIRECTIONS.UP) return DIRECTIONS.RIGHT; }
                else if (r === 3) { if (dir === DIRECTIONS.LEFT) return DIRECTIONS.UP; if (dir === DIRECTIONS.DOWN) return DIRECTIONS.RIGHT; }
            } else if (type === CELL_TYPES.MIRROR_LINE) {
                const isFrwd = (rot % 2 === 0);
                if (isFrwd) { // /
                    if (dir === DIRECTIONS.RIGHT) return DIRECTIONS.UP;
                    if (dir === DIRECTIONS.UP) return DIRECTIONS.RIGHT;
                    if (dir === DIRECTIONS.LEFT) return DIRECTIONS.DOWN;
                    if (dir === DIRECTIONS.DOWN) return DIRECTIONS.LEFT;
                } else { // \
                    if (dir === DIRECTIONS.RIGHT) return DIRECTIONS.DOWN;
                    if (dir === DIRECTIONS.DOWN) return DIRECTIONS.RIGHT;
                    if (dir === DIRECTIONS.LEFT) return DIRECTIONS.UP;
                    if (dir === DIRECTIONS.UP) return DIRECTIONS.LEFT;
                }
            } else if (type === CELL_TYPES.MIRROR_OCTAGON) {
                // M3 always reflects to specific diagonal regardless of input (Simplification from LaserSystem)
                // But LaserSystem says: Orthogonal -> Diagonal.
                const r = rot % 4;
                if (r === 0) return DIRECTIONS.UP_RIGHT; // NE
                if (r === 1) return DIRECTIONS.DOWN_RIGHT; // SE
                if (r === 2) return DIRECTIONS.DOWN_LEFT; // SW
                if (r === 3) return DIRECTIONS.UP_LEFT; // NW
            }
            return null;
        };

        const possibleRotations = type === CELL_TYPES.MIRROR_LINE ? [0, 1] : [0, 1, 2, 3];
        // Shuffle rotations to be random
        possibleRotations.sort(() => Math.random() - 0.5);

        for (let rot of possibleRotations) {
            const outDir = testMirror(rot);
            if (outDir !== null && outDir !== inDir) {
                // Check if this matches "LEFT" or "RIGHT" loose constraint?
                // Or just return ANY valid reflection that changes direction?
                // Random turn is better.
                return { rot, newDir: outDir };
            }
        }
        return null;
    }

    getRandomEdge(w, h, occupied) {
        // Try to find an unoccupied edge
        for (let i = 0; i < 10; i++) {
            const side = Math.floor(Math.random() * 4);
            let x, y, dir;
            if (side === 0) { x = Math.floor(Math.random() * w); y = -1; dir = DIRECTIONS.DOWN; }
            else if (side === 1) { x = w; y = Math.floor(Math.random() * h); dir = DIRECTIONS.LEFT; }
            else if (side === 2) { x = Math.floor(Math.random() * w); y = h; dir = DIRECTIONS.UP; }
            else { x = -1; y = Math.floor(Math.random() * h); dir = DIRECTIONS.RIGHT; }

            // Check if blocking?
            // Emitters at -1 can conflict if x is same?
            // Just check if near an existing one?
            // Simple check: don't place if adjacent to existing?
            // For now, accept.
            return { x, y, dir };
        }
        return null;
    }

    clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
    isValid(x, y, w, h) { return x >= 0 && x < w && y >= 0 && y < h; }
}
