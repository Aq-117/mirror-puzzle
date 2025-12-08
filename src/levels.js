import { CELL_TYPES, DIRECTIONS } from './game/Grid.js';

export const levels = [
    {
        id: 1,
        name: "Level 1: The Beginning",
        grid: { width: 8, height: 6 },
        items: [
            { x: 6, y: 1, type: CELL_TYPES.RECEIVER },
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT }
        ],
        inventory: {
            mirrors: 1
        }
    },
    {
        id: 2,
        name: "Level 2: Split Path",
        grid: { width: 8, height: 8 },
        items: [
            { x: 4, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 7, y: 3, type: CELL_TYPES.RECEIVER },
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT }
        ],
        inventory: {
            mirrors: 3
        }
    },
    {
        id: 3,
        name: "Level 3: Obstacles",
        grid: { width: 10, height: 8 },
        items: [
            { x: 8, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 3, type: CELL_TYPES.WALL },
            { x: 4, y: 4, type: CELL_TYPES.WALL },
            { x: 4, y: 5, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: -1, y: 4, direction: DIRECTIONS.RIGHT }
        ],
        inventory: {
            mirrors: 4
        }
    },
    {
        id: 4,
        name: "Level 4: Precision",
        grid: { width: 10, height: 10 },
        items: [
            { x: 2, y: 8, type: CELL_TYPES.RECEIVER },
            { x: 8, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 5, type: CELL_TYPES.WALL },
            { x: 4, y: 4, type: CELL_TYPES.WALL },
            { x: 6, y: 6, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: 5, y: -1, direction: DIRECTIONS.DOWN }
        ],
        inventory: {
            mirrors: 6
        }
    },
    {
        id: 5,
        name: "Level 5: The Maze",
        grid: { width: 12, height: 12 },
        items: [
            { x: 10, y: 10, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 10, type: CELL_TYPES.RECEIVER },
            { x: 10, y: 1, type: CELL_TYPES.RECEIVER },

            // Maze walls
            { x: 3, y: 3, type: CELL_TYPES.WALL },
            { x: 3, y: 4, type: CELL_TYPES.WALL },
            { x: 3, y: 5, type: CELL_TYPES.WALL },
            { x: 3, y: 6, type: CELL_TYPES.WALL },

            { x: 8, y: 6, type: CELL_TYPES.WALL },
            { x: 8, y: 7, type: CELL_TYPES.WALL },
            { x: 8, y: 8, type: CELL_TYPES.WALL },
            { x: 8, y: 9, type: CELL_TYPES.WALL },

            { x: 5, y: 8, type: CELL_TYPES.WALL },
            { x: 6, y: 8, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: 0, y: -1, direction: DIRECTIONS.DOWN }
        ],
        inventory: {
            mirrors: 10
        }
    },
    {
        id: 6,
        name: "Level 6: The Gauntlet",
        grid: { width: 12, height: 6 },
        items: [
            { x: 10, y: 3, type: CELL_TYPES.RECEIVER },
            // Zig-zag walls
            { x: 2, y: 0, type: CELL_TYPES.WALL }, { x: 2, y: 1, type: CELL_TYPES.WALL }, { x: 2, y: 2, type: CELL_TYPES.WALL },
            { x: 4, y: 5, type: CELL_TYPES.WALL }, { x: 4, y: 4, type: CELL_TYPES.WALL }, { x: 4, y: 3, type: CELL_TYPES.WALL },
            { x: 6, y: 0, type: CELL_TYPES.WALL }, { x: 6, y: 1, type: CELL_TYPES.WALL }, { x: 6, y: 2, type: CELL_TYPES.WALL },
            { x: 8, y: 5, type: CELL_TYPES.WALL }, { x: 8, y: 4, type: CELL_TYPES.WALL }, { x: 8, y: 3, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: -1, y: 2, direction: DIRECTIONS.RIGHT }
        ],
        inventory: {
            mirrors: 9
        }
    },
    {
        id: 7,
        name: "Level 7: Dual Source",
        grid: { width: 10, height: 10 },
        items: [
            { x: 5, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 4, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 4, type: CELL_TYPES.WALL }, // Block direct path
            { x: 4, y: 5, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: 5, y: -1, direction: DIRECTIONS.DOWN },
            { x: -1, y: 4, direction: DIRECTIONS.RIGHT }
        ],
        inventory: {
            mirrors: 5
        }
    },
    {
        id: 8,
        name: "Level 8: Reflection Chamber",
        grid: { width: 11, height: 11 },
        items: [
            { x: 5, y: 0, type: CELL_TYPES.RECEIVER },
            { x: 10, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 10, type: CELL_TYPES.RECEIVER },
            { x: 0, y: 5, type: CELL_TYPES.RECEIVER },
            // Central block
            { x: 5, y: 5, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: 2, y: -1, direction: DIRECTIONS.DOWN }
        ],
        inventory: {
            mirrors: 10
        }
    },
    {
        id: 9,
        name: "Level 9: The Detour",
        grid: { width: 12, height: 8 },
        items: [
            { x: 1, y: 4, type: CELL_TYPES.RECEIVER },
            // Wall blocking direct path
            { x: 1, y: 3, type: CELL_TYPES.WALL },
            { x: 2, y: 3, type: CELL_TYPES.WALL },
            { x: 2, y: 4, type: CELL_TYPES.WALL },
            // Perimeter obstacles forcing long path
            { x: 6, y: 2, type: CELL_TYPES.WALL },
            { x: 6, y: 5, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT }
        ],
        inventory: {
            mirrors: 8
        }
    },
    {
        id: 10,
        name: "Level 10: Grand Finale",
        grid: { width: 14, height: 14 },
        items: [
            { x: 12, y: 12, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 12, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 12, type: CELL_TYPES.RECEIVER },

            // Random obstacles
            { x: 4, y: 4, type: CELL_TYPES.WALL },
            { x: 9, y: 9, type: CELL_TYPES.WALL },
            { x: 4, y: 9, type: CELL_TYPES.WALL },
            { x: 9, y: 4, type: CELL_TYPES.WALL },

            { x: 6, y: 6, type: CELL_TYPES.WALL },
            { x: 7, y: 7, type: CELL_TYPES.WALL },
            { x: 6, y: 7, type: CELL_TYPES.WALL },
            { x: 7, y: 6, type: CELL_TYPES.WALL },
        ],
        emitters: [
            { x: 7, y: -1, direction: DIRECTIONS.DOWN },
            { x: -1, y: 7, direction: DIRECTIONS.RIGHT }
        ],
        inventory: {
            mirrors: 15
        }
    }
];
