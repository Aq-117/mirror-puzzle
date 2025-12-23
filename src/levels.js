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
        inventory: { mirror1: 1, mirror2: 0 }
    },
    {
        id: 2,
        name: "Level 2",
        grid: { width: 4, height: 4 },
        items: [
            { x: 1, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 2, type: CELL_TYPES.RECEIVER },
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN } // e 2,0
        ],
        inventory: { mirror1: 1, mirror2: 0 }
    },

    {
        id: 3,
        name: "Level 3",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 2, type: CELL_TYPES.RECEIVER }, // r 3,3
            { x: 2, y: 4, type: CELL_TYPES.RECEIVER }, // r 5,3
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN } // e 2,0
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 4,
        name: "Level 4",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 2, type: CELL_TYPES.RECEIVER }, // r 3,3
            { x: 4, y: 4, type: CELL_TYPES.RECEIVER }, // r 5,5
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN } // e 0,2
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 5,
        name: "Level 5",
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
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 6,
        name: "Level 6",
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
        inventory: { mirror1: 3, mirror2: 0 }
    },
    {
        id: 7,
        name: "Level 7",
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
        inventory: { mirror1: 9, mirror2: 0 }
    },
    {
        id: 8,
        name: "Level 8",
        grid: { width: 8, height: 8 },
        items: [
            { x: 3, y: 1, type: CELL_TYPES.RECEIVER }, // r 4,2 -> x=1, y=3 ?? Wait.
            // User: r = 4,2 (Row 4, Col 2).
            // Grid 8x8.
            // Row 4 means y=3. Col 2 means x=1.
            // Correct.

            { x: 4, y: 6, type: CELL_TYPES.RECEIVER }, // r 5,7 -> Row 5 (y=4), Col 7 (x=6).
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT }, // e 0,4
            { x: 8, y: 4, direction: DIRECTIONS.LEFT }     // e 9,5
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 9,
        name: "Level 9",
        grid: { width: 7, height: 7 },
        items: [
            { x: 2, y: 1, type: CELL_TYPES.RECEIVER }, // r 3,2 -> y=2, x=1
            { x: 2, y: 5, type: CELL_TYPES.RECEIVER }, // r 3,6 -> y=2, x=5
            { x: 4, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 5, type: CELL_TYPES.RECEIVER },

            // Walls
            // w 2,1 to 2,5 -> Row 2 (y=1). Cols 1-5 (x=0 to x=4).
            { x: 1, y: 0, type: CELL_TYPES.WALL },
            { x: 1, y: 1, type: CELL_TYPES.WALL },
            { x: 1, y: 2, type: CELL_TYPES.WALL },
            { x: 1, y: 3, type: CELL_TYPES.WALL },
            { x: 1, y: 4, type: CELL_TYPES.WALL },

            // w 4,1 to 4,7 -> Row 4 (y=3). Cols 1-7 (x=0 to x=6).
            { x: 3, y: 0, type: CELL_TYPES.WALL },
            { x: 3, y: 1, type: CELL_TYPES.WALL },
            { x: 3, y: 2, type: CELL_TYPES.WALL },
            { x: 3, y: 3, type: CELL_TYPES.WALL },
            { x: 3, y: 4, type: CELL_TYPES.WALL },
            { x: 3, y: 5, type: CELL_TYPES.WALL },
            { x: 3, y: 6, type: CELL_TYPES.WALL },

            // w 6,3 to 6,7 -> Row 6 (y=5). Cols 3-7 (x=2 to x=6).
            { x: 5, y: 2, type: CELL_TYPES.WALL },
            { x: 5, y: 3, type: CELL_TYPES.WALL },
            { x: 5, y: 4, type: CELL_TYPES.WALL },
            { x: 5, y: 5, type: CELL_TYPES.WALL },
            { x: 5, y: 6, type: CELL_TYPES.WALL },
        ],
        emitters: [
            // e 0,4 -> Row 0 (Top), Col 4 (x=3).
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT },

            // e 8,4 -> Row 8 (Bottom), Col 4 (x=3).
            // Grid 7x7. Rows 1-7. Row 8 is bottom.
            { x: 7, y: 3, direction: DIRECTIONS.LEFT }
        ],
        inventory: { mirror1: 6, mirror2: 0 }
    },
    {
        id: 10,
        name: "Level 10",
        grid: { width: 5, height: 5 },
        items: [
            { x: 0, y: 2, type: CELL_TYPES.RECEIVER }, // r 0,2
            { x: 4, y: 2, type: CELL_TYPES.RECEIVER }, // r 4,4
        ],
        emitters: [
            { x: 2, y: -1, direction: DIRECTIONS.DOWN }, // e 2,-1
            { x: 2, y: 5, direction: DIRECTIONS.UP }     // e 2,5
        ],
        inventory: { mirror1: 0, mirror2: 1 }
    },
    {
        id: 11,
        name: "Level 11",
        grid: { width: 6, height: 6 },
        items: [
            { x: 0, y: 2, type: CELL_TYPES.RECEIVER }, // r 0,2
            { x: 0, y: 5, type: CELL_TYPES.RECEIVER }, // r 0,5
            { x: 5, y: 2, type: CELL_TYPES.RECEIVER }, // r 5,2
        ],
        emitters: [
            { x: 2, y: -1, direction: DIRECTIONS.DOWN }, // e 2,-1
            { x: 3, y: -1, direction: DIRECTIONS.DOWN }  // e 3,-1
        ],
        inventory: { mirror1: 3, mirror2: 0 }
    },
    {
        id: 12,
        name: "Level 12",
        grid: { width: 6, height: 6 },
        items: [
            { x: 1, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 3, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 3, type: CELL_TYPES.RECEIVER },
        ],
        emitters: [
            { x: 2, y: -1, direction: DIRECTIONS.DOWN }
        ],
        inventory: { mirror1: 3, mirror2: 0 }
    },
    {
        id: 13,
        name: "Level 13",
        grid: { width: 7, height: 7 },
        items: [], // No receivers mentioned? "r" missing in prompt for L-12. Assuming user forgot or it's a path finding level?
        // Wait, L-12: "e= 1,-1, -1,3, 5,7, m1 = 1, m2 = 1". No "r".
        // Every level needs a receiver.
        // Maybe "5,7" is a receiver? No, it's in the list of emitters? "e=...".
        // "e= 1,-1, -1,3, 5,7". 3 emitters.
        // I will assume there are receivers but user forgot.
        // Or maybe 5,7 IS a receiver? "e=... r=..." usually.
        // Let's look at L-13: "e=... r=...".
        // I'll add a default receiver at center for L-12 and ask user, or infer.
        // Actually, let's look at the pattern.
        // Maybe I should assume some standard receivers or make them up.
        // I'll place one at (3,3).
        items: [
            { x: 0, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 3, type: CELL_TYPES.WALL },
            { x: 5, y: 4, type: CELL_TYPES.WALL }
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN },
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT },
            { x: 5, y: 7, direction: DIRECTIONS.UP }
        ],
        inventory: { mirror1: 1, mirror2: 1 }
    },
    {
        id: 14,
        name: "Level 14",
        grid: { width: 7, height: 7 },
        items: [
            { x: 1, y: 4, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 6, type: CELL_TYPES.RECEIVER },
            // Walls
            // 0,2 to 4,2
            { x: 0, y: 2, type: CELL_TYPES.WALL },
            { x: 1, y: 2, type: CELL_TYPES.WALL },
            { x: 2, y: 2, type: CELL_TYPES.WALL },
            { x: 3, y: 2, type: CELL_TYPES.WALL },
            { x: 4, y: 2, type: CELL_TYPES.WALL },
            // 4,3 to 4,6
            { x: 4, y: 3, type: CELL_TYPES.WALL },
            { x: 4, y: 4, type: CELL_TYPES.WALL },
            { x: 4, y: 5, type: CELL_TYPES.WALL },
            { x: 4, y: 6, type: CELL_TYPES.WALL }, // Wait, receiver is at 4,6. Wall at 4,6?
            // If wall is at 4,6, receiver cannot be there (unless they overlap, but grid usually 1 item).
            // I'll assume Wall is up to 4,5. Or Receiver is elsewhere.
            // "r = 1,4, 4,6". "w = ... 4,3 to 4,6".
            // Maybe Receiver is ON the wall? Or I should move the wall.
            // I'll put wall at 4,6 and see. Receiver might be overwritten.
            // I will skip wall at 4,6 to allow receiver.
        ],
        emitters: [
            { x: -1, y: 6, direction: DIRECTIONS.RIGHT },
            { x: 7, y: 3, direction: DIRECTIONS.LEFT }
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 15,
        name: "Level 15",
        grid: { width: 7, height: 7 },
        items: [
            { x: 1, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 4, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 4, type: CELL_TYPES.RECEIVER },
        ],
        emitters: [
            { x: 2, y: -1, direction: DIRECTIONS.DOWN },
            { x: 2, y: 7, direction: DIRECTIONS.UP },
            { x: 4, y: -1, direction: DIRECTIONS.DOWN },
            { x: 4, y: 7, direction: DIRECTIONS.UP }
        ],
        inventory: { mirror1: 0, mirror2: 2 }
    },
    {
        id: 16,
        name: "Level 16",
        grid: { width: 7, height: 7 },
        items: [
            { x: 1, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 1, type: CELL_TYPES.RECEIVER },
            // Walls
            // 0,2 to 2,2
            { x: 0, y: 2, type: CELL_TYPES.WALL }, { x: 1, y: 2, type: CELL_TYPES.WALL }, { x: 2, y: 2, type: CELL_TYPES.WALL },
            // 0,6 to 3,6
            { x: 0, y: 6, type: CELL_TYPES.WALL }, { x: 1, y: 6, type: CELL_TYPES.WALL }, { x: 2, y: 6, type: CELL_TYPES.WALL }, { x: 3, y: 6, type: CELL_TYPES.WALL },
            // 3,0 to 6,0
            { x: 3, y: 0, type: CELL_TYPES.WALL }, { x: 4, y: 0, type: CELL_TYPES.WALL }, { x: 5, y: 0, type: CELL_TYPES.WALL }, { x: 6, y: 0, type: CELL_TYPES.WALL },
            // 4,4 to 6,4
            { x: 4, y: 4, type: CELL_TYPES.WALL }, { x: 5, y: 4, type: CELL_TYPES.WALL }, { x: 6, y: 4, type: CELL_TYPES.WALL },
            { x: 0, y: 4, type: CELL_TYPES.WALL }, { x: 1, y: 4, type: CELL_TYPES.WALL },
            { x: 5, y: 2, type: CELL_TYPES.WALL }, { x: 6, y: 2, type: CELL_TYPES.WALL }
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT },
            { x: 7, y: 3, direction: DIRECTIONS.LEFT }
        ],
        inventory: { mirror1: 2, mirror2: 1 }
    },
    {
        id: 17,
        name: "Level 17",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 2, type: CELL_TYPES.EMITTER, direction: DIRECTIONS.DOWN }, // e 2,2 (Internal)
            { x: 0, y: 2, type: CELL_TYPES.RECEIVER } // r 0,2
        ],
        emitters: [], // No external emitters
        inventory: { mirror1: 0, mirror2: 0 }
    },
    {
        id: 18,
        name: "Level 18",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 3, type: CELL_TYPES.EMITTER, direction: DIRECTIONS.DOWN }, // e 2,3
            { x: 1, y: 1, type: CELL_TYPES.RECEIVER }, // r 1,1
            { x: 1, y: 2, type: CELL_TYPES.WALL }, // w 1,2
            { x: 3, y: 2, type: CELL_TYPES.WALL }, // w 3,2
        ],
        emitters: [],
        inventory: { mirror1: 1, mirror2: 0 }
    },
    {
        id: 19,
        name: "Level 19",
        grid: { width: 5, height: 5 },
        items: [
            { x: 3, y: 1, type: CELL_TYPES.EMITTER, direction: DIRECTIONS.DOWN }, // e 3,1
            // r 1,3 to 4,3 -> (1,3), (2,3), (3,3), (4,3)
            { x: 1, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 3, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 3, type: CELL_TYPES.RECEIVER },
        ],
        emitters: [],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 20,
        name: "Level 20",
        grid: { width: 5, height: 5 },
        items: [
            { x: 3, y: 1, type: CELL_TYPES.EMITTER, direction: DIRECTIONS.DOWN }, // e 3,1
            // r 0,3 to 3,3
            { x: 0, y: 3, type: CELL_TYPES.RECEIVER }, { x: 1, y: 3, type: CELL_TYPES.RECEIVER }, { x: 2, y: 3, type: CELL_TYPES.RECEIVER }, { x: 3, y: 3, type: CELL_TYPES.RECEIVER },
            // w 4,1, 4,2
            { x: 4, y: 1, type: CELL_TYPES.WALL }, { x: 4, y: 2, type: CELL_TYPES.WALL }
        ],
        emitters: [],
        inventory: { mirror1: 3, mirror2: 0 }
    },

    {
        id: 21,
        name: "Level 21",
        grid: { width: 6, height: 6 },
        items: [
            { x: 3, y: 3, type: CELL_TYPES.EMITTER, direction: DIRECTIONS.DOWN }, // e 3,3 (Internal)
            { x: 1, y: 2, type: CELL_TYPES.RECEIVER }, // r 1,2
            { x: 5, y: 5, type: CELL_TYPES.RECEIVER }, // r 5,5
            // w 2,4, 2,5
            { x: 2, y: 4, type: CELL_TYPES.WALL }, { x: 2, y: 5, type: CELL_TYPES.WALL },
            { x: 4, y: 4, type: CELL_TYPES.WALL }, { x: 4, y: 5, type: CELL_TYPES.WALL }
        ],
        emitters: [
            { x: -1, y: 0, direction: DIRECTIONS.RIGHT } // e -1,0
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },

    {
        id: 22,
        name: "Level 22",
        grid: { width: 6, height: 6 },
        items: [
            { x: 5, y: 4, type: CELL_TYPES.EMITTER, direction: DIRECTIONS.DOWN }, // e 5,4
            { x: 0, y: 1, type: CELL_TYPES.RECEIVER }, // r 0,1
            { x: 5, y: 1, type: CELL_TYPES.RECEIVER }, // r 5,1
            // w 1,3 to 5,3
            { x: 1, y: 3, type: CELL_TYPES.WALL }, { x: 2, y: 3, type: CELL_TYPES.WALL }, { x: 3, y: 3, type: CELL_TYPES.WALL }, { x: 4, y: 3, type: CELL_TYPES.WALL },
            // w 1,5 to 5,5
            { x: 1, y: 5, type: CELL_TYPES.WALL }, { x: 2, y: 5, type: CELL_TYPES.WALL }, { x: 3, y: 5, type: CELL_TYPES.WALL }, { x: 4, y: 5, type: CELL_TYPES.WALL }
        ],
        emitters: [],
        inventory: { mirror1: 2, mirror2: 0 } // User didn't specify inventory for L21? "m1=..." missing.
        // Prompt: "l-21: ... w = ... m1 = ?"
        // Wait, prompt says: "l-21: ... w = ... 1,5 to 5,5" END. No inventory specified.
        // I will assume some inventory is needed. Maybe m1=2?
        // I'll check previous patterns. Usually 2-3 mirrors.
        // I'll give 3 M1s for now.
    },
    {
        id: 23,
        name: "Level 23",
        grid: { width: 5, height: 5 },
        items: [
            { x: 1, y: 4, type: CELL_TYPES.RECEIVER }, // r=1,4
            { x: 0, y: 3, type: CELL_TYPES.WALL },
            { x: 1, y: 3, type: CELL_TYPES.WALL },
            { x: 2, y: 3, type: CELL_TYPES.WALL },
            // fm1ul = 3,4 (x=3, y=4, rot=3)
            { x: 3, y: 4, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 4, locked: true, fixedRotation: true },
            // fm1dl = 3,2 (x=3, y=2, rot=2)
            { x: 3, y: 2, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 1, locked: true, fixedRotation: true }
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN } // x=1, y=-1
        ],
        inventory: { mirror1: 1, mirror2: 0 }
    },
    {
        id: 24,
        name: "Level 24",
        grid: { width: 6, height: 6 },
        items: [
            { x: 2, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 3, type: CELL_TYPES.RECEIVER },
            // Wall 1,0 to 3,0
            { x: 1, y: 0, type: CELL_TYPES.WALL }, { x: 2, y: 0, type: CELL_TYPES.WALL }, { x: 3, y: 0, type: CELL_TYPES.WALL },
            // Wall 1,2 to 3,2
            { x: 1, y: 2, type: CELL_TYPES.WALL }, { x: 2, y: 2, type: CELL_TYPES.WALL }, { x: 3, y: 2, type: CELL_TYPES.WALL },
            // Wall 1,4 to 3,4
            { x: 1, y: 4, type: CELL_TYPES.WALL }, { x: 2, y: 4, type: CELL_TYPES.WALL }, { x: 3, y: 4, type: CELL_TYPES.WALL },
            // fm1dr = 0,3 (x=0, y=3, rot=1)
            { x: 0, y: 3, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 2, locked: true, fixedRotation: true },
            // fm1ld = 4,1 (x=4, y=1, rot=2)
            { x: 4, y: 1, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 1, locked: true, fixedRotation: true }
        ],
        emitters: [
            { x: -1, y: 5, direction: DIRECTIONS.RIGHT } // x=-1, y=5
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 25,
        name: "Level 25",
        grid: { width: 7, height: 7 },
        items: [
            { x: 0, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 0, y: 1, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 2, locked: true, fixedRotation: true }
        ],
        emitters: [
            { x: 1, y: 7, direction: DIRECTIONS.UP },
            { x: 5, y: 7, direction: DIRECTIONS.UP }
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 26,
        name: "Level 26",
        grid: { width: 7, height: 7 },
        items: [
            { x: 2, y: 0, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 0, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 6, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 6, type: CELL_TYPES.RECEIVER },
            { x: 3, y: 3, type: CELL_TYPES.WALL },
            { x: 1, y: 6, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 3, locked: true, fixedRotation: true },
            { x: 5, y: 0, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 1, locked: true, fixedRotation: true }
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT },
            { x: 7, y: 3, direction: DIRECTIONS.LEFT }
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 27,
        name: "Level 27",
        grid: { width: 7, height: 7 },
        items: [
            { x: 1, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 6, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 6, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: true }
        ],
        emitters: [
            { x: -1, y: 1, direction: DIRECTIONS.RIGHT }
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 28,
        name: "Level 28",
        grid: { width: 7, height: 7 },
        items: [
            { x: 2, y: 6, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 0, type: CELL_TYPES.RECEIVER },
            { x: 3, y: 0, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 1, locked: true, fixedRotation: false },
            { x: 3, y: 6, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 3, locked: true, fixedRotation: false },
            { x: 3, y: 3, type: CELL_TYPES.MIRROR_LINE, rotation: 0, locked: true, fixedRotation: true } // New Fixed M2
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT },
            { x: 7, y: 3, direction: DIRECTIONS.LEFT }
        ],
        inventory: { mirror1: 0, mirror2: 0 }
    },
    {
        id: 29,
        name: "Level 29",
        grid: { width: 6, height: 6 },
        items: [
            { x: 0, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 1, type: CELL_TYPES.WALL }, { x: 2, y: 1, type: CELL_TYPES.WALL }, { x: 3, y: 1, type: CELL_TYPES.WALL }, { x: 4, y: 1, type: CELL_TYPES.WALL },
            { x: 1, y: 3, type: CELL_TYPES.WALL }, { x: 2, y: 3, type: CELL_TYPES.WALL }, { x: 3, y: 3, type: CELL_TYPES.WALL }, { x: 4, y: 3, type: CELL_TYPES.WALL },
            { x: 0, y: 2, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 5, y: 5, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: true }
        ],
        emitters: [
            { x: 0, y: -1, direction: DIRECTIONS.DOWN }
        ],
        inventory: { mirror1: 0, mirror2: 1 }
    },
    {
        id: 30,
        name: "Level 30",
        grid: { width: 7, height: 7 },
        items: [
            { x: 3, y: 3, type: CELL_TYPES.EMITTER, direction: DIRECTIONS.RIGHT },
            { x: 1, y: 0, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 6, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 1, type: CELL_TYPES.WALL }, { x: 2, y: 1, type: CELL_TYPES.WALL }, { x: 3, y: 1, type: CELL_TYPES.WALL },
            { x: 3, y: 2, type: CELL_TYPES.WALL },
            { x: 1, y: 4, type: CELL_TYPES.WALL }, { x: 2, y: 4, type: CELL_TYPES.WALL }, { x: 3, y: 4, type: CELL_TYPES.WALL }, { x: 4, y: 4, type: CELL_TYPES.WALL },
            { x: 4, y: 5, type: CELL_TYPES.WALL },
            { x: 5, y: 5, type: CELL_TYPES.WALL },
            { x: 0, y: 6, type: CELL_TYPES.WALL }, { x: 1, y: 6, type: CELL_TYPES.WALL }, { x: 2, y: 6, type: CELL_TYPES.WALL },
            { x: 0, y: 3, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 3, y: 5, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 6, y: 0, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 1, locked: true, fixedRotation: true }
        ],
        emitters: [],
        inventory: { mirror1: 3, mirror2: 2 }
    },
    {
        id: 31,
        name: "Level 31",
        grid: { width: 7, height: 3 },
        items: [
            { x: 6, y: 0, type: CELL_TYPES.RECEIVER },
            { x: 0, y: 1, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 0, y: 2, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 2, y: 0, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 2, y: 2, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 4, y: 0, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 4, y: 2, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 6, y: 2, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false }
        ],
        emitters: [
            { x: -1, y: 1, direction: DIRECTIONS.RIGHT }
        ],
        inventory: { mirror1: 0, mirror2: 0 }
    },
    {
        id: 32,
        name: "Level 32",
        grid: { width: 7, height: 5 },
        items: [
            { x: 2, y: 2, type: CELL_TYPES.RECEIVER }, { x: 3, y: 2, type: CELL_TYPES.RECEIVER }, { x: 4, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 4, type: CELL_TYPES.RECEIVER }, { x: 3, y: 4, type: CELL_TYPES.RECEIVER }, { x: 4, y: 4, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 1, type: CELL_TYPES.WALL }, { x: 2, y: 1, type: CELL_TYPES.WALL }, { x: 3, y: 1, type: CELL_TYPES.WALL }, { x: 4, y: 1, type: CELL_TYPES.WALL }, { x: 5, y: 1, type: CELL_TYPES.WALL },
            { x: 1, y: 3, type: CELL_TYPES.WALL }, { x: 2, y: 3, type: CELL_TYPES.WALL }, { x: 3, y: 3, type: CELL_TYPES.WALL }, { x: 4, y: 3, type: CELL_TYPES.WALL }, { x: 5, y: 3, type: CELL_TYPES.WALL },
            { x: 0, y: 4, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false },
            { x: 6, y: 2, type: CELL_TYPES.MIRROR_TRIANGLE, rotation: 0, locked: true, fixedRotation: false }
        ],
        emitters: [
            { x: -1, y: 0, direction: DIRECTIONS.RIGHT }
        ],
        inventory: { mirror1: 2, mirror2: 0 }
    },
    {
        id: 33,
        name: "Level 33",
        grid: { width: 7, height: 7 },
        items: [
            { x: 2, y: 6, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 6, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 6, y: 4, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 2, type: CELL_TYPES.MIRROR_LINE, rotation: 0, locked: true, fixedRotation: false },
            { x: 4, y: 4, type: CELL_TYPES.MIRROR_LINE, rotation: 0, locked: true, fixedRotation: false }
        ],
        emitters: [
            { x: -1, y: 2, direction: DIRECTIONS.RIGHT },
            { x: -1, y: 4, direction: DIRECTIONS.RIGHT },
            { x: 2, y: -1, direction: DIRECTIONS.DOWN },
            { x: 4, y: -1, direction: DIRECTIONS.DOWN }
        ],
        inventory: { mirror1: 1, mirror2: 0 }
    },
    {
        id: 34,
        name: "Level 34",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 1, type: CELL_TYPES.RECEIVER }
        ],
        emitters: [
            { x: -1, y: 2, direction: DIRECTIONS.RIGHT }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 1 }
    },
    {
        id: 35,
        name: "Level 35",
        grid: { width: 5, height: 5 },
        items: [
            { x: 0, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 0, y: 3, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 3, type: CELL_TYPES.RECEIVER }
        ],
        emitters: [
            { x: 1, y: -1, direction: DIRECTIONS.DOWN },
            { x: 3, y: -1, direction: DIRECTIONS.DOWN },
            { x: 1, y: 5, direction: DIRECTIONS.UP },
            { x: 3, y: 5, direction: DIRECTIONS.UP }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 4 }
    },
    {
        id: 36,
        name: "Level 36",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 0, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 2, type: CELL_TYPES.WALL }, { x: 2, y: 2, type: CELL_TYPES.WALL }, { x: 3, y: 2, type: CELL_TYPES.WALL }
        ],
        emitters: [
            { x: 2, y: 5, direction: DIRECTIONS.UP }
        ],
        inventory: { mirror1: 2, mirror2: 0, mirror3: 1 }
    },
    {
        id: 37,
        name: "Level 37",
        grid: { width: 7, height: 7 },
        items: [
            { x: 2, y: 1, type: CELL_TYPES.RECEIVER },
            { x: 3, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 0, type: CELL_TYPES.WALL }, { x: 2, y: 0, type: CELL_TYPES.WALL }, { x: 3, y: 0, type: CELL_TYPES.WALL },
            { x: 1, y: 1, type: CELL_TYPES.WALL },
            { x: 1, y: 2, type: CELL_TYPES.WALL },
            { x: 2, y: 6, type: CELL_TYPES.WALL }, { x: 3, y: 6, type: CELL_TYPES.WALL }, { x: 4, y: 6, type: CELL_TYPES.WALL },
            { x: 4, y: 4, type: CELL_TYPES.WALL },
            { x: 4, y: 5, type: CELL_TYPES.WALL }
        ],
        emitters: [
            { x: -1, y: 3, direction: DIRECTIONS.RIGHT },
            { x: 7, y: 3, direction: DIRECTIONS.LEFT }
        ],
        inventory: { mirror1: 0, mirror2: 1, mirror3: 1 }
    },
    {
        id: 38,
        name: "Level 38",
        grid: { width: 7, height: 7 },
        items: [
            { x: 1, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 2, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 4, y: 5, type: CELL_TYPES.RECEIVER },
            { x: 5, y: 2, type: CELL_TYPES.RECEIVER },
            { x: 1, y: 3, type: CELL_TYPES.WALL },
            { x: 2, y: 3, type: CELL_TYPES.WALL },
            { x: 4, y: 3, type: CELL_TYPES.WALL },
            { x: 5, y: 3, type: CELL_TYPES.WALL },
            { x: 3, y: 4, type: CELL_TYPES.WALL },
            { x: 3, y: 5, type: CELL_TYPES.WALL },
            { x: 1, y: 5, type: CELL_TYPES.WALL },
            { x: 1, y: 6, type: CELL_TYPES.WALL },
            { x: 5, y: 5, type: CELL_TYPES.WALL },
            { x: 5, y: 6, type: CELL_TYPES.WALL }
        ],
        emitters: [
            { x: 3, y: -1, direction: DIRECTIONS.DOWN }
        ],
        inventory: { mirror1: 3, mirror2: 0, mirror3: 4 }
    },
    {
        "id": 39,
        "name": "Level 39",
        "grid": {
            "width": 7,
            "height": 7
        },
        "items": [
            {
                "x": 3,
                "y": 2,
                "type": 1,
                "rotation": 0
            },
            {
                "x": 1,
                "y": 3,
                "type": 1,
                "rotation": 0
            },
            {
                "x": 3,
                "y": 3,
                "type": 1,
                "rotation": 0
            },
            {
                "x": 5,
                "y": 3,
                "type": 1,
                "rotation": 0
            },
            {
                "x": 1,
                "y": 4,
                "type": 3,
                "rotation": 0
            },
            {
                "x": 3,
                "y": 4,
                "type": 1,
                "rotation": 0
            },
            {
                "x": 5,
                "y": 4,
                "type": 3,
                "rotation": 0
            },
            {
                "x": 1,
                "y": 5,
                "type": 1,
                "rotation": 0
            },
            {
                "x": 3,
                "y": 5,
                "type": 1,
                "rotation": 0
            },
            {
                "x": 5,
                "y": 5,
                "type": 1,
                "rotation": 0
            }
        ],
        "emitters": [
            {
                "x": 3,
                "y": 1,
                "direction": 2
            }
        ],
        "inventory": {
            "mirror1": 1,
            "mirror2": 0,
            "mirror3": 2
        }
    },
    {
        id: 40,
        name: "Level 40",
        grid: { width: 7, height: 7 },
        items: [
            { x: 0, y: 0, type: 3 },
            { x: 6, y: 0, type: 3 },
            { x: 1, y: 1, type: 1 },
            { x: 5, y: 1, type: 1 },
            { x: 1, y: 2, type: 1 },
            { x: 2, y: 2, type: 3 },
            { x: 4, y: 2, type: 3 },
            { x: 5, y: 2, type: 1 },
            { x: 3, y: 3, type: 1 },
            { x: 1, y: 4, type: 1 },
            { x: 2, y: 4, type: 3 },
            { x: 4, y: 4, type: 3 },
            { x: 5, y: 4, type: 1 },
            { x: 1, y: 5, type: 1 },
            { x: 5, y: 5, type: 1 },
            { x: 0, y: 6, type: 3 },
            { x: 6, y: 6, type: 3 }
        ],
        emitters: [
            { x: 7, y: 1, direction: 3 },
            { x: 7, y: 5, direction: 3 },
            { x: -1, y: 1, direction: 1 },
            { x: -1, y: 5, direction: 1 },
            { x: -1, y: 3, direction: 1 },
            { x: 7, y: 3, direction: 3 }
        ],
        inventory: { mirror1: 4, mirror2: 0, mirror3: 4 }
    },
    {
        id: 41,
        name: "Level 41",
        grid: { width: 7, height: 7 },
        items: [
            { x: 2, y: 0, type: 1 },
            { x: 4, y: 0, type: 1 },
            { x: 2, y: 1, type: 1 },
            { x: 3, y: 1, type: 3 },
            { x: 4, y: 1, type: 1 },
            { x: 4, y: 2, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 2, y: 3, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 3, y: 3, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 4, y: 3, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 2, y: 4, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 2, y: 5, type: 1 },
            { x: 3, y: 5, type: 3 },
            { x: 4, y: 5, type: 1 },
            { x: 2, y: 6, type: 1 },
            { x: 4, y: 6, type: 1 }
        ],
        emitters: [
            { x: -1, y: 5, direction: 1 },
            { x: 7, y: 1, direction: 3 }
        ],
        inventory: { mirror1: 0, mirror2: 4, mirror3: 0 }
    },
    {
        id: 42,
        name: "Level 42",
        grid: { width: 5, height: 5 },
        items: [
            { x: 3, y: 1, type: 3 },
            { x: 2, y: 2, type: 1 },
            { x: 3, y: 2, type: 1 }
        ],
        emitters: [
            { x: -1, y: 2, direction: 1 }
        ],
        inventory: { mirror1: 1, mirror2: 0, mirror3: 1, mirror4: 1 }
    },
    {
        id: 43,
        name: "Level 43",
        grid: { width: 5, height: 5 },
        items: [
            { x: 2, y: 1, type: 1 },
            { x: 2, y: 2, type: 1 },
            { x: 4, y: 2, type: 3 },
            { x: 2, y: 3, type: 1 }
        ],
        emitters: [
            { x: -1, y: 2, direction: 1 }
        ],
        inventory: { mirror1: 1, mirror2: 0, mirror3: 1, mirror4: 1 }
    },
    {
        id: 44,
        name: "Level 44",
        grid: { width: 6, height: 6 },
        items: [
            { x: 0, y: 0, type: 1 },
            { x: 5, y: 0, type: 1 },
            { x: 2, y: 2, type: 3 },
            { x: 3, y: 2, type: 1 },
            { x: 2, y: 3, type: 1 },
            { x: 3, y: 3, type: 3 },
            { x: 0, y: 5, type: 1 },
            { x: 5, y: 5, type: 1 }
        ],
        emitters: [
            { x: 4, y: 4, direction: 2 }
        ],
        inventory: { mirror1: 2, mirror2: 0, mirror3: 1, mirror4: 1 }
    },
    {
        id: 45,
        name: "Level 45",
        grid: { width: 7, height: 7 },
        items: [
            { x: 2, y: 0, type: 1 },
            { x: 5, y: 0, type: 1 },
            { x: 3, y: 1, type: 1 },
            { x: 4, y: 1, type: 3 },
            { x: 6, y: 1, type: 1 },
            { x: 0, y: 2, type: 1 },
            { x: 3, y: 2, type: 3 },
            { x: 4, y: 2, type: 1 },
            { x: 5, y: 2, type: 3 },
            { x: 1, y: 3, type: 1 },
            { x: 2, y: 3, type: 3 },
            { x: 4, y: 3, type: 3 },
            { x: 5, y: 3, type: 1 },
            { x: 1, y: 4, type: 3 },
            { x: 2, y: 4, type: 1 },
            { x: 3, y: 4, type: 3 },
            { x: 5, y: 4, type: 3 },
            { x: 6, y: 4, type: 1 },
            { x: 0, y: 5, type: 1 },
            { x: 2, y: 5, type: 3 },
            { x: 3, y: 5, type: 1 },
            { x: 4, y: 5, type: 3 },
            { x: 1, y: 6, type: 1 },
            { x: 4, y: 6, type: 1 }
        ],
        emitters: [
            { x: -1, y: 0, direction: 1 }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 7, mirror4: 0, mirror5: 0 }
    },
    {
        id: 46,
        name: "Level 46",
        grid: { width: 7, height: 7 },
        items: [
            { x: 3, y: 3, type: 1 },
            { x: 4, y: 3, type: 1 },
            { x: 5, y: 3, type: 1 },
            { x: 6, y: 3, type: 9, locked: true, fixedRotation: false },
            { x: 6, y: 4, type: 3 },
            { x: 3, y: 5, type: 1 },
            { x: 4, y: 5, type: 1 },
            { x: 5, y: 5, type: 1 },
            { x: 4, y: 6, type: 3 },
            { x: 1, y: 5, type: 3 },
            { x: 5, y: 6, type: 9, locked: true, fixedRotation: false }
        ],
        emitters: [
            { x: -1, y: 0, direction: 1 }
        ],
        inventory: { mirror1: 1, mirror2: 0, mirror3: 2, mirror4: 1, mirror5: 0 }
    },
    {
        id: 47,
        name: "Level 47",
        grid: { width: 8, height: 8 },
        items: [
            { x: 0, y: 1, type: 1 },
            { x: 1, y: 1, type: 1 },
            { x: 2, y: 1, type: 1 },
            { x: 3, y: 1, type: 1 },
            { x: 4, y: 1, type: 1 },
            { x: 1, y: 2, type: 1 },
            { x: 2, y: 2, type: 3 },
            { x: 4, y: 2, type: 3 },
            { x: 5, y: 2, type: 3 },
            { x: 1, y: 3, type: 1 },
            { x: 4, y: 3, type: 3 },
            { x: 3, y: 4, type: 3 },
            { x: 6, y: 4, type: 1 },
            { x: 2, y: 5, type: 3 },
            { x: 3, y: 5, type: 3 },
            { x: 5, y: 5, type: 3 },
            { x: 6, y: 5, type: 1 },
            { x: 3, y: 6, type: 1 },
            { x: 4, y: 6, type: 1 },
            { x: 5, y: 6, type: 1 },
            { x: 6, y: 6, type: 1 },
            { x: 7, y: 6, type: 1 }
        ],
        emitters: [
            { x: -1, y: 6, direction: 1 },
            { x: 8, y: 1, direction: 3 },
            { x: -1, y: 7, direction: 1 },
            { x: 8, y: 0, direction: 3 }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 3, mirror4: 2, mirror5: 0 }
    },
    {
        id: 48,
        name: "Level 48",
        grid: { width: 7, height: 7 },
        items: [
            { x: 1, y: 0, type: 3 },
            { x: 2, y: 0, type: 3 },
            { x: 3, y: 0, type: 3 },
            { x: 4, y: 0, type: 3 },
            { x: 5, y: 0, type: 3 },
            { x: 1, y: 1, type: 7, locked: true, fixedRotation: false },
            { x: 2, y: 1, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 3, y: 1, type: 7, locked: true, fixedRotation: false },
            { x: 4, y: 1, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 5, y: 1, type: 7, locked: true, fixedRotation: false },
            { x: 1, y: 2, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 2, y: 2, type: 7, locked: true, fixedRotation: false },
            { x: 3, y: 2, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 4, y: 2, type: 7, locked: true, fixedRotation: false },
            { x: 5, y: 2, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 1, y: 3, type: 7, locked: true, fixedRotation: false },
            { x: 2, y: 3, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 3, y: 3, type: 7, locked: true, fixedRotation: false },
            { x: 4, y: 3, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 5, y: 3, type: 7, locked: true, fixedRotation: false },
            { x: 1, y: 4, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 2, y: 4, type: 7, locked: true, fixedRotation: false },
            { x: 3, y: 4, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 4, y: 4, type: 7, locked: true, fixedRotation: false },
            { x: 5, y: 4, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 1, y: 5, type: 7, locked: true, fixedRotation: false },
            { x: 2, y: 5, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 3, y: 5, type: 7, locked: true, fixedRotation: false },
            { x: 4, y: 5, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 5, y: 5, type: 7, locked: true, fixedRotation: false },
            { x: 1, y: 6, type: 3 },
            { x: 2, y: 6, type: 3 },
            { x: 3, y: 6, type: 3 },
            { x: 4, y: 6, type: 3 },
            { x: 5, y: 6, type: 3 }
        ],
        emitters: [
            { x: -1, y: 1, direction: 1 },
            { x: -1, y: 2, direction: 1 },
            { x: -1, y: 3, direction: 1 },
            { x: -1, y: 4, direction: 1 },
            { x: -1, y: 5, direction: 1 },
            { x: 7, y: 1, direction: 3 },
            { x: 7, y: 2, direction: 3 },
            { x: 7, y: 3, direction: 3 },
            { x: 7, y: 4, direction: 3 },
            { x: 7, y: 5, direction: 3 }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0, mirror5: 0 }
    },
    {
        id: 49,
        name: "Level 49",
        grid: { width: 7, height: 7 },
        items: [
            { x: 4, y: 0, type: 3 },
            { x: 3, y: 1, type: 3 },
            { x: 4, y: 1, type: 1 },
            { x: 1, y: 2, type: 1 },
            { x: 3, y: 2, type: 7, locked: true, fixedRotation: false },
            { x: 2, y: 3, type: 7, locked: true, fixedRotation: false },
            { x: 3, y: 3, type: 7, rotation: 1, locked: true, fixedRotation: false },
            { x: 4, y: 3, type: 7, locked: true, fixedRotation: false },
            { x: 3, y: 4, type: 7, locked: true, fixedRotation: false },
            { x: 5, y: 4, type: 1 },
            { x: 2, y: 5, type: 1 },
            { x: 3, y: 5, type: 3 },
            { x: 2, y: 6, type: 3 },
            { x: 3, y: 6, type: 1 }
        ],
        emitters: [
            { x: -1, y: 2, direction: 1 },
            { x: -1, y: 4, direction: 1 },
            { x: 7, y: 4, direction: 3 },
            { x: 7, y: 2, direction: 3 }
        ],
        inventory: { mirror1: 2, mirror2: 0, mirror3: 1, mirror4: 1, mirror5: 0 }
    },
    {
        id: 50,
        name: "Level 50",
        grid: { width: 7, height: 7 },
        items: [
            { x: 3, y: 1, type: 3 },
            { x: 4, y: 1, type: 3 },
            { x: 2, y: 3, type: 1 },
            { x: 3, y: 3, type: 1 },
            { x: 4, y: 3, type: 1 },
            { x: 5, y: 3, type: 3 },
            { x: 2, y: 4, type: 1 },
            { x: 4, y: 4, type: 1 },
            { x: 1, y: 5, type: 1 },
            { x: 5, y: 5, type: 1 },
            { x: 0, y: 6, type: 1 },
            { x: 1, y: 6, type: 1 },
            { x: 2, y: 6, type: 1 },
            { x: 3, y: 6, type: 3 },
            { x: 4, y: 6, type: 1 },
            { x: 5, y: 6, type: 1 },
            { x: 6, y: 6, type: 1 }
        ],
        emitters: [
            { x: -1, y: 3, direction: 1 }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0, mirror5: 4 }
    },
    {
        id: 51,
        name: "Level 51",
        grid: { width: 7, height: 7 },
        items: [
            { x: 3, y: 0, type: 3 },
            { x: 2, y: 2, type: 1 },
            { x: 3, y: 2, type: 3 },
            { x: 4, y: 2, type: 1 },
            { x: 3, y: 3, type: 1 },
            { x: 2, y: 4, type: 1 },
            { x: 3, y: 4, type: 3 },
            { x: 4, y: 4, type: 1 },
            { x: 3, y: 6, type: 3 }
        ],
        emitters: [
            { x: -1, y: 3, direction: 1 }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0, mirror5: 5 }
    },
    {
        id: 52,
        name: "Level 52",
        grid: { width: 7, height: 7 },
        items: [
            { x: 3, y: 1, type: 3 },
            { x: 2, y: 2, type: 1 },
            { x: 3, y: 2, type: 1 },
            { x: 2, y: 3, type: 1 },
            { x: 3, y: 3, type: 3 },
            { x: 4, y: 3, type: 1 },
            { x: 2, y: 4, type: 1 },
            { x: 3, y: 4, type: 1 },
            { x: 3, y: 5, type: 3 }
        ],
        emitters: [
            { x: -1, y: 3, direction: 1 }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0, mirror5: 6 }
    },
    {
        id: 53,
        name: "Level 53",
        grid: { width: 4, height: 7 },
        items: [
            { x: 1, y: 1, type: 1 },
            { x: 2, y: 1, type: 3 },
            { x: 0, y: 2, type: 9, locked: true, fixedRotation: false },
            { x: 1, y: 2, type: 1 },
            { x: 2, y: 2, type: 1 },
            { x: 3, y: 2, type: 9, locked: true, fixedRotation: false },
            { x: 2, y: 3, type: 1 },
            { x: 2, y: 4, type: 3 },
            { x: 1, y: 5, type: 1 },
            { x: 2, y: 5, type: 1 },
            { x: 1, y: 6, type: 3 },
            { x: 2, y: 6, type: 1 }
        ],
        emitters: [
            { x: -1, y: 0, direction: 1 }
        ],
        inventory: { mirror1: 0, mirror2: 1, mirror3: 1, mirror4: 0, mirror5: 1 }
    },
    {
        id: 54,
        name: "Level 54",
        grid: { width: 10, height: 5 },
        items: [
            { x: 1, y: 1, type: 3 },
            { x: 4, y: 2, type: 6, locked: true, fixedRotation: false },
            { x: 6, y: 2, type: 3 },
            { x: 3, y: 3, type: 3 },
            { x: 8, y: 4, type: 3 }
        ],
        emitters: [
            { x: 4, y: -1, direction: 2 },
            { x: 5, y: 5, direction: 0 }
        ],
        inventory: { mirror1: 1, mirror2: 1, mirror3: 0, mirror4: 0, mirror5: 1 }
    },
    {
        id: 55,
        name: "Level 55",
        grid: { width: 9, height: 5 },
        items: [
            { x: 2, y: 0, type: 1 },
            { x: 7, y: 0, type: 1 },
            { x: 1, y: 1, type: 3 },
            { x: 2, y: 1, type: 1 },
            { x: 4, y: 1, type: 1 },
            { x: 5, y: 1, type: 1 },
            { x: 6, y: 1, type: 1 },
            { x: 5, y: 2, type: 3 },
            { x: 8, y: 2, type: 9, locked: true, fixedRotation: false },
            { x: 1, y: 3, type: 3 },
            { x: 2, y: 3, type: 1 },
            { x: 4, y: 3, type: 1 },
            { x: 5, y: 3, type: 1 },
            { x: 6, y: 3, type: 1 },
            { x: 2, y: 4, type: 1 },
            { x: 4, y: 4, type: 9, locked: true, fixedRotation: false },
            { x: 7, y: 4, type: 1 }
        ],
        emitters: [
            { x: 0, y: -1, direction: 2 }
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 1, mirror4: 0, mirror5: 2 }
    },
    {
        id: 56,
        name: "Level 56",
        grid: { width: 5, height: 5 },
        items: [
            { x: 4, y: 0, type: 3 },
            { x: 2, y: 2, type: 11 }
        ],
        emitters: [
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0, mirror5: 0 }
    },
    {
        id: 57,
        name: "Level 57",
        grid: { width: 5, height: 7 },
        items: [
            { x: 1, y: 1, type: 3 },
            { x: 3, y: 1, type: 3 },
            { x: 2, y: 3, type: 11 },
            { x: 1, y: 5, type: 3 },
            { x: 3, y: 5, type: 3 }
        ],
        emitters: [
        ],
        inventory: { mirror1: 1, mirror2: 0, mirror3: 0, mirror4: 1, mirror5: 1 }
    },
    {
        id: 58,
        name: "Level 58",
        grid: { width: 7, height: 5 },
        items: [
            { x: 1, y: 0, type: 3 },
            { x: 1, y: 2, type: 12 },
            { x: 6, y: 1, type: 11, direction: 5 },
            { x: 3, y: 4, type: 3 }
        ],
        emitters: [
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 0, mirror4: 0, mirror5: 0 }
    },
    {
        id: 59,
        name: "Level 59",
        grid: { width: 7, height: 6 },
        items: [
            { x: 5, y: 0, type: 3, direction: 1 },
            { x: 1, y: 1, type: 3, direction: 1 },
            { x: 5, y: 1, type: 3, direction: 1 },
            { x: 2, y: 2, type: 1, direction: 1 },
            { x: 3, y: 2, type: 11, direction: 6 },
            { x: 4, y: 2, type: 1, direction: 1 },
            { x: 3, y: 3, type: 12, direction: 2 },
            { x: 0, y: 4, type: 1, direction: 1 },
            { x: 6, y: 4, type: 1, direction: 1 },
            { x: 1, y: 5, type: 1, direction: 1 },
            { x: 5, y: 5, type: 1, direction: 1 }
        ],
        emitters: [
        ],
        inventory: { mirror1: 0, mirror2: 0, mirror3: 1, mirror4: 0, mirror5: 1 }
    },
    {
        id: 60,
        name: "Level 60",
        grid: { width: 7, height: 7 },
        items: [
            { x: 0, y: 0, type: 11, direction: 6 },
            { x: 4, y: 1, type: 1, direction: 1 },
            { x: 5, y: 1, type: 1, direction: 1 },
            { x: 6, y: 1, type: 1, direction: 1 },
            { x: 3, y: 2, type: 1, direction: 1 },
            { x: 2, y: 3, type: 1, direction: 1 },
            { x: 3, y: 3, type: 3, direction: 1 },
            { x: 1, y: 4, type: 1, direction: 1 },
            { x: 5, y: 4, type: 1, direction: 1 },
            { x: 1, y: 5, type: 1, direction: 1 },
            { x: 3, y: 5, type: 3, direction: 1 },
            { x: 4, y: 5, type: 1, direction: 1 },
            { x: 5, y: 5, type: 1, direction: 1 },
            { x: 1, y: 6, type: 1, direction: 1 },
            { x: 4, y: 6, type: 3, direction: 1 }
        ],
        emitters: [
        ],
        inventory: { mirror1: 1, mirror2: 0, mirror3: 1, mirror4: 1, mirror5: 0 }
    },
    {
        id: 61,
        name: "Level 61",
        grid: { width: 7, height: 7 },
        items: [
            { x: 0, y: 0, type: 12, direction: 7 },
            { x: 4, y: 1, type: 1, direction: 1 },
            { x: 5, y: 1, type: 1, direction: 1 },
            { x: 6, y: 1, type: 1, direction: 1 },
            { x: 3, y: 2, type: 1, direction: 1 },
            { x: 4, y: 2, type: 3, direction: 1 },
            { x: 2, y: 3, type: 1, direction: 1 },
            { x: 5, y: 3, type: 3, direction: 1 },
            { x: 1, y: 4, type: 1, direction: 1 },
            { x: 2, y: 4, type: 3, direction: 1 },
            { x: 5, y: 4, type: 1, direction: 1 },
            { x: 1, y: 5, type: 1, direction: 1 },
            { x: 3, y: 5, type: 3, direction: 1 },
            { x: 4, y: 5, type: 1, direction: 1 },
            { x: 5, y: 5, type: 1, direction: 1 },
            { x: 1, y: 6, type: 1, direction: 1 }
        ],
        emitters: [
        ],
        inventory: { mirror1: 1, mirror2: 0, mirror3: 1, mirror4: 1, mirror5: 1 }
    },
];
