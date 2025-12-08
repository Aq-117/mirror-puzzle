import { CELL_TYPES, DIRECTIONS } from './game/Grid.js';

export const levels = [
    {
        id: 1,
        name: "Level 1",
        grid: { width: 4, height: 4 },
        items: [
            { x: 0, y: 2, type: CELL_TYPES.RECEIVER }, // r 3,1
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN } // e 2,0
        ],
        inventory: { mirrors: 1 }
    },
    {
        id: 2,
        name: "Level 2",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 2, type: CELL_TYPES.RECEIVER }, // r 3,3
            { x: 2, y: 4, type: CELL_TYPES.RECEIVER }, // r 5,3
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN } // e 2,0
        ],
        inventory: { mirrors: 2 }
    },
    {
        id: 3,
        name: "Level 3",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 2, type: CELL_TYPES.RECEIVER }, // r 3,3
            { x: 4, y: 4, type: CELL_TYPES.RECEIVER }, // r 5,5
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN } // e 0,2
        ],
        inventory: { mirrors: 2 }
    },
    {
        id: 4,
        name: "Level 4",
        grid: { width: 6, height: 6 },
        items: [
            { x: 4, y: 1, type: CELL_TYPES.RECEIVER }, // r 2,5
            { x: 2, y: 2, type: CELL_TYPES.WALL }, // w 3,3
            { x: 2, y: 3, type: CELL_TYPES.WALL }, // w 4,3
            { x: 2, y: 4, type: CELL_TYPES.WALL }, // w 5,3
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT } // e 4,0
        ],
        inventory: { mirrors: 2 }
    },
    {
        id: 5,
        name: "Level 5",
        grid: { width: 8, height: 8 },
        items: [
            { x: 3, y: 0, type: CELL_TYPES.RECEIVER }, // r 1,4
            { x: 3, y: 7, type: CELL_TYPES.RECEIVER }, // r 8,4
            { x: 7, y: 3, type: CELL_TYPES.RECEIVER }, // r 4,8
            // Walls
            { x: 1, y: 1, type: CELL_TYPES.WALL }, // 2,2
            { x: 2, y: 2, type: CELL_TYPES.WALL }, // 3,3
            { x: 3, y: 3, type: CELL_TYPES.WALL }, // 4,4
            { x: 4, y: 4, type: CELL_TYPES.WALL }, // 5,5
            { x: 5, y: 5, type: CELL_TYPES.WALL }, // 6,6
            { x: 6, y: 6, type: CELL_TYPES.WALL }, // 7,7
            { x: 1, y: 6, type: CELL_TYPES.WALL }, // 7,2
            { x: 2, y: 5, type: CELL_TYPES.WALL }, // 6,3
            { x: 3, y: 4, type: CELL_TYPES.WALL }, // 5,4
            { x: 4, y: 3, type: CELL_TYPES.WALL }, // 4,5
            { x: 5, y: 2, type: CELL_TYPES.WALL }, // 3,6
            { x: 6, y: 1, type: CELL_TYPES.WALL }, // 2,7
        ],
        emitters: [
            { x: 0, y: -1, direction: DIRECTIONS.DOWN } // e 1,0
        ],
        inventory: { mirrors: 3 }
    },
    {
        id: 6,
        name: "Level 6",
        grid: { width: 12, height: 6 },
        items: [
            { x: 10, y: 3, type: CELL_TYPES.RECEIVER }, // r 11,4
            // Walls
            { x: 2, y: 0, type: CELL_TYPES.WALL }, // 3,1
            { x: 2, y: 1, type: CELL_TYPES.WALL }, // 3,2
            { x: 2, y: 2, type: CELL_TYPES.WALL }, // 3,3
            { x: 4, y: 3, type: CELL_TYPES.WALL }, // 5,4
            { x: 4, y: 4, type: CELL_TYPES.WALL }, // 5,5
            { x: 4, y: 5, type: CELL_TYPES.WALL }, // 5,6
            { x: 7, y: 0, type: CELL_TYPES.WALL }, // 8,1
            { x: 7, y: 1, type: CELL_TYPES.WALL }, // 8,2
            { x: 7, y: 2, type: CELL_TYPES.WALL }, // 8,3
            { x: 9, y: 3, type: CELL_TYPES.WALL }, // 10,4
            { x: 9, y: 4, type: CELL_TYPES.WALL }, // 10,5
            { x: 9, y: 5, type: CELL_TYPES.WALL }, // 10,6
        ],
        emitters: [
            { x: -1, y: 2, direction: DIRECTIONS.RIGHT } // e 0,3
        ],
        inventory: { mirrors: 9 }
    }
];
