import { CELL_TYPES } from '../game/Grid.js';
import { FastSimulator } from './FastSimulator.js';

export class Solver {
    constructor() {
        this.simulator = new FastSimulator();
        this.maxSolutionsToFind = 2; // Stop early if we find more than 1 (unless we want to count them all)
    }

    /**
     * Tries to solve the level.
     * @param {Object} level - The level object (grid, items, emitters, inventory)
     * @returns {Object} result - { solvable: boolean, solutions: Array, solutionCount: number }
     */
    solve(level) {
        // 1. Prepare initial state
        // Clone grid so we don't mess up original
        const gridData = {
            width: level.grid.width,
            height: level.grid.height,
            cells: Array(level.grid.height).fill().map(() => Array(level.grid.width).fill(null))
        };

        let totalReceivers = 0;
        const emptySlots = [];

        // 2. Parse items into grid
        // Initialize empty
        for (let y = 0; y < gridData.height; y++) {
            for (let x = 0; x < gridData.width; x++) {
                gridData.cells[y][x] = { type: CELL_TYPES.EMPTY };
            }
        }

        // Place fixed items
        level.items.forEach(item => {
            if (item.x >= 0 && item.x < gridData.width && item.y >= 0 && item.y < gridData.height) {
                gridData.cells[item.y][item.x] = { ...item };
                if (item.type === CELL_TYPES.RECEIVER) totalReceivers++;
            }
        });

        // Identify available slots (where user can place mirrors)
        // Usually any EMPTY cell is valid.
        // However, we should filter out cells that might be blocked or irrelevant?
        // For now, ALL empty cells are candidates.
        for (let y = 0; y < gridData.height; y++) {
            for (let x = 0; x < gridData.width; x++) {
                if (gridData.cells[y][x].type === CELL_TYPES.EMPTY) {
                    emptySlots.push({ x, y });
                }
            }
        }

        // 3. Prepare Inventory
        // Convert inventory object { mirror1: 2, ... } to list of items to place
        const itemsToPlace = [];
        if (level.inventory.mirror1) {
            for (let i = 0; i < level.inventory.mirror1; i++) itemsToPlace.push(CELL_TYPES.MIRROR_TRIANGLE); // M1
        }
        if (level.inventory.mirror2) {
            for (let i = 0; i < level.inventory.mirror2; i++) itemsToPlace.push(CELL_TYPES.MIRROR_LINE); // M2
        }
        if (level.inventory.mirror3) {
            for (let i = 0; i < level.inventory.mirror3; i++) itemsToPlace.push(CELL_TYPES.MIRROR_OCTAGON); // M3
        }
        // Note: Deprecated MIRROR type? Assuming not used in gen.

        this.solutions = [];
        this.search(gridData, level.emitters, itemsToPlace, emptySlots, totalReceivers);

        return {
            solvable: this.solutions.length > 0,
            solutions: this.solutions,
            solutionCount: this.solutions.length
        };
    }

    search(gridData, emitters, itemsToPlace, emptySlots, totalReceivers) {
        if (this.solutions.length >= this.maxSolutionsToFind) return;

        // Base case: No more items to place?
        // OR should we check solution at every step?
        // Usually we place ALL mirrors then check. 
        // Optimization: Can we check early? 
        // If we have 0 items left, we MUST check.

        if (itemsToPlace.length === 0) {
            // Run Simulation
            const hitReceivers = this.simulator.simulate(gridData, emitters);
            if (hitReceivers.size === totalReceivers) {
                // Found a solution!
                this.solutions.push(this.captureSolution(gridData));
            }
            return;
        }

        // Recursive Step
        const itemType = itemsToPlace[0];
        const remainingItems = itemsToPlace.slice(1);

        // Try placing this item in every available empty slot
        // Note: Permutations of identical items don't matter (M1 #1 vs M1 #2), but M1 vs M2 does.
        // Since we process `itemsToPlace` in order, we just need to pick a slot.
        // TO avoid duplicates (placing M1 at A then M1 at B vs M1 at B then M1 at A), 
        // we should enforce order on slots if items are identical.
        // BUT items might not be identical.
        // Simple approach: Try current item in all slots. Remove slot from list for next level.

        // OPTIMIZATION: If we have multiple IDENTICAL items (e.g. 3 M1s), does order matter?
        // If we treat them as unique in the loop we get N!.
        // Better: this is a "Place N items into M slots" problem.
        // For this prototype, standard backtracking is fine for small N.

        for (let i = 0; i < emptySlots.length; i++) {
            const slot = emptySlots[i];

            // Try all rotations
            // M1: 4 rotations
            // M2: 2 rotations (0 and 1 are distinct, 2=0, 3=1)
            // M3: 4 rotations

            let possibleRotations = [0];
            if (itemType === CELL_TYPES.MIRROR_TRIANGLE) possibleRotations = [0, 1, 2, 3];
            else if (itemType === CELL_TYPES.MIRROR_LINE) possibleRotations = [0, 1];
            else if (itemType === CELL_TYPES.MIRROR_OCTAGON) possibleRotations = [0, 1, 2, 3];

            for (const rot of possibleRotations) {
                // Place
                gridData.cells[slot.y][slot.x] = { type: itemType, rotation: rot };

                // Recurse
                // Remove this slot from future candidates
                const nextEmptySlots = [...emptySlots];
                nextEmptySlots.splice(i, 1);

                this.search(gridData, emitters, remainingItems, nextEmptySlots, totalReceivers);

                if (this.solutions.length >= this.maxSolutionsToFind) return;

                // Backtrack
                gridData.cells[slot.y][slot.x] = { type: CELL_TYPES.EMPTY };
            }
        }
    }

    captureSolution(gridData) {
        // Return a snapshot of the grid or just the placed items
        const placements = [];
        for (let y = 0; y < gridData.height; y++) {
            for (let x = 0; x < gridData.width; x++) {
                const c = gridData.cells[y][x];
                if (c && c.type !== CELL_TYPES.EMPTY && c.type !== CELL_TYPES.WALL && c.type !== CELL_TYPES.RECEIVER && c.type !== CELL_TYPES.EMITTER) {
                    placements.push({ x, y, type: c.type, rotation: c.rotation });
                }
            }
        }
        return placements;
    }
}
