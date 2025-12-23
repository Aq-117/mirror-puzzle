import { Grid, CELL_TYPES, DIRECTIONS } from '../game/Grid.js';

export class LevelEditor {
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.grid = new Grid(8, 8); // Default editor grid
        this.selectedTool = CELL_TYPES.WALL;
        this.selectedDirection = DIRECTIONS.RIGHT;
        this.selectedRotation = 0;
        this.inventoryConfig = {
            mirror1: 0,
            mirror2: 0,
            mirror3: 0,
            mirror4: 0,
            mirror5: 0
        };
        this.externalEmitters = []; // Store emitters outside grid
        this.isVisible = false;

        // UI Elements
        this.ui = null;
        this.gridWidthInput = null;
        this.gridHeightInput = null;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        // Create UI if not exists (or bind if exists)
        // We will assume UI is in index.html, we just bind
        this.bindEvents();
    }

    bindEvents() {
        // Bind tool buttons
        document.querySelectorAll('.editor-tool').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = parseInt(e.currentTarget.dataset.type);
                this.selectedTool = type;
                this.updateToolUI();

                // If emitter, cycle direction on re-click? Or separate direction buttons?
                // For now, let's keep it simple.
            });
        });

        // Grid Resize
        document.getElementById('editor-update-grid').addEventListener('click', () => {
            const w = parseInt(document.getElementById('editor-width').value);
            const h = parseInt(document.getElementById('editor-height').value);
            if (w > 0 && h > 0) {
                this.grid = new Grid(w, h);
                this.game.renderer.calculateLayout(this.grid);
            }
        });

        // Export
        document.getElementById('editor-export-btn').addEventListener('click', () => this.exportLevel());

        // Test
        document.getElementById('editor-test-btn').addEventListener('click', () => this.testLevel());

        // Exit
        document.getElementById('editor-exit-btn').addEventListener('click', () => {
            this.hide();
        });

        this.canvas.addEventListener('mousedown', (e) => this.handleInput(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e)); // Window to catch release outside
        this.canvas.addEventListener('contextmenu', (e) => {
            if (this.isVisible) e.preventDefault();
        });

        // Inventory Inputs
        document.getElementById('editor-m1-count').addEventListener('change', (e) => this.inventoryConfig.mirror1 = parseInt(e.target.value));
        document.getElementById('editor-m2-count').addEventListener('change', (e) => this.inventoryConfig.mirror2 = parseInt(e.target.value));
        document.getElementById('editor-m3-count').addEventListener('change', (e) => this.inventoryConfig.mirror3 = parseInt(e.target.value));
        document.getElementById('editor-m4-count').addEventListener('change', (e) => this.inventoryConfig.mirror4 = parseInt(e.target.value));
        document.getElementById('editor-m5-count').addEventListener('change', (e) => this.inventoryConfig.mirror5 = parseInt(e.target.value));
    }

    show() {
        this.isVisible = true;
        document.getElementById('editor-screen').classList.remove('hidden');
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('ui-layer').classList.add('hidden');

        // Initial render
        this.game.renderer.calculateLayout(this.grid);
        // We rely on Game.loop to call this.draw()
        this.draw();
    }

    hide() {
        this.isVisible = false;
        document.getElementById('editor-screen').classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
    }

    handleInput(e) {
        if (!this.isVisible) return;
        console.log('[Editor] HandleInput Triggered');
        // Prevent context menu on right click inside editor
        if (e.button === 2) {
            e.preventDefault();
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cellSize = this.game.renderer.cellSize;
        const offsetX = this.game.renderer.offsetX;
        const offsetY = this.game.renderer.offsetY;

        const gridX = Math.floor((x - offsetX) / cellSize);
        const gridY = Math.floor((y - offsetY) / cellSize);

        if (gridX >= 0 && gridX < this.grid.width && gridY >= 0 && gridY < this.grid.height) {
            const isRightClick = e.button === 2;
            const isShiftClick = e.shiftKey;

            // For click, always toggle
            this.toggleCell(gridX, gridY, isRightClick, isShiftClick);

            // Start dragging state
            this.isDragging = true;
            this.dragButton = e.button; // 0 left, 2 right
            this.lastGridX = gridX;
            this.lastGridY = gridY;
        }
        // Check external border (allow generous hit area for usability, e.g. -2 to width+1)
        else if (gridX >= -2 && gridX <= this.grid.width + 1 && gridY >= -2 && gridY <= this.grid.height + 1) {
            // Only emitters allowed outside
            // Emitters or Eraser allowed outside
            if (this.selectedTool === CELL_TYPES.EMITTER || this.selectedTool === CELL_TYPES.EMPTY || e.button === 2) {
                // Snap to closest border
                let targetX = gridX;
                let targetY = gridY;

                if (targetX < 0) targetX = -1;
                if (targetX >= this.grid.width) targetX = this.grid.width;
                if (targetY < 0) targetY = -1;
                if (targetY >= this.grid.height) targetY = this.grid.height;

                const isRightClick = e.button === 2;
                this.toggleExternalEmitter(targetX, targetY, isRightClick);
            }
        }
    }

    handleMouseMove(e) {
        if (!this.isVisible || !this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const cellSize = this.game.renderer.cellSize;
        const offsetX = this.game.renderer.offsetX;
        const offsetY = this.game.renderer.offsetY;

        const gridX = Math.floor((x - offsetX) / cellSize);
        const gridY = Math.floor((y - offsetY) / cellSize);

        if (gridX >= 0 && gridX < this.grid.width && gridY >= 0 && gridY < this.grid.height) {
            // Only update if moved to new cell
            if (gridX !== this.lastGridX || gridY !== this.lastGridY) {
                const isRightClick = this.dragButton === 2;
                const isShiftClick = e.shiftKey;

                this.toggleCell(gridX, gridY, isRightClick, isShiftClick);

                this.lastGridX = gridX;
                this.lastGridY = gridY;
            }
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
    }

    toggleCell(x, y, isRightClick, isShiftClick) {
        console.log(`[Editor] toggleCell ${x},${y} ${isRightClick}`);
        const current = this.grid.getCell(x, y);

        if (isRightClick) {
            // Remove
            this.grid.clearCell(x, y);
            this.draw();
            return;
        }

        if (current && (current.type === this.selectedTool ||
            (this.selectedTool === CELL_TYPES.EMITTER && [CELL_TYPES.EMITTER, CELL_TYPES.EMITTER_DIAGONAL, CELL_TYPES.EMITTER_OMNI].includes(current.type)))) {

            // Interaction with existing item
            if (isShiftClick) {
                // Shift-Click: Toggle Properties / Types

                // MIRRORS: Toggle Fixed Logic
                if ([CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON, CELL_TYPES.MIRROR_SQUARE, CELL_TYPES.MIRROR_OMNI].includes(current.type)) {
                    current.fixedRotation = !current.fixedRotation;
                }
                // EMITTERS: Cycle Type (Normal -> Diagonal -> Omni -> Normal)
                else if ([CELL_TYPES.EMITTER, CELL_TYPES.EMITTER_DIAGONAL, CELL_TYPES.EMITTER_OMNI].includes(current.type)) {
                    if (current.type === CELL_TYPES.EMITTER) {
                        current.type = CELL_TYPES.EMITTER_DIAGONAL;
                        current.direction = DIRECTIONS.DOWN_LEFT; // Default diagonal
                    } else if (current.type === CELL_TYPES.EMITTER_DIAGONAL) {
                        current.type = CELL_TYPES.EMITTER_OMNI;
                        current.direction = DIRECTIONS.RIGHT; // Reset to standard
                    } else {
                        current.type = CELL_TYPES.EMITTER;
                        current.direction = DIRECTIONS.RIGHT;
                    }
                }

            } else {
                // Regular Click: Rotate / Change Direction
                if (current.type === CELL_TYPES.EMITTER) {
                    // Orthogonal Only
                    const nextDir = {
                        [DIRECTIONS.UP]: DIRECTIONS.RIGHT,
                        [DIRECTIONS.RIGHT]: DIRECTIONS.DOWN,
                        [DIRECTIONS.DOWN]: DIRECTIONS.LEFT,
                        [DIRECTIONS.LEFT]: DIRECTIONS.UP
                    };
                    const next = nextDir[current.direction];
                    current.direction = (next !== undefined) ? next : DIRECTIONS.RIGHT;
                } else if (current.type === CELL_TYPES.EMITTER_DIAGONAL) {
                    // Diagonal Only
                    const nextDir = {
                        [DIRECTIONS.UP_RIGHT]: DIRECTIONS.DOWN_RIGHT,
                        [DIRECTIONS.DOWN_RIGHT]: DIRECTIONS.DOWN_LEFT,
                        [DIRECTIONS.DOWN_LEFT]: DIRECTIONS.UP_LEFT,
                        [DIRECTIONS.UP_LEFT]: DIRECTIONS.UP_RIGHT
                    };
                    const next = nextDir[current.direction];
                    current.direction = (next !== undefined) ? next : DIRECTIONS.DOWN_LEFT;
                } else if (current.type === CELL_TYPES.EMITTER_OMNI) {
                    // 8-Way
                    // Cycle through: Up -> UpRight -> Right -> DownRight -> Down -> ...
                    // DIRECTIONS are 0-7 but not in order. 
                    // 0:UP, 1:RIGHT, 2:DOWN, 3:LEFT
                    // 4:UP_RIGHT, 5:DOWN_RIGHT, 6:DOWN_LEFT, 7:UP_LEFT
                    // Let's implement a logical clockwise rotation
                    const map = {
                        [DIRECTIONS.UP]: DIRECTIONS.UP_RIGHT,
                        [DIRECTIONS.UP_RIGHT]: DIRECTIONS.RIGHT,
                        [DIRECTIONS.RIGHT]: DIRECTIONS.DOWN_RIGHT,
                        [DIRECTIONS.DOWN_RIGHT]: DIRECTIONS.DOWN,
                        [DIRECTIONS.DOWN]: DIRECTIONS.DOWN_LEFT,
                        [DIRECTIONS.DOWN_LEFT]: DIRECTIONS.LEFT,
                        [DIRECTIONS.LEFT]: DIRECTIONS.UP_LEFT,
                        [DIRECTIONS.UP_LEFT]: DIRECTIONS.UP
                    };
                    const next = map[current.direction];
                    current.direction = (next !== undefined) ? next : DIRECTIONS.RIGHT;
                } else if (this.selectedTool === CELL_TYPES.MIRROR_LINE) {
                    current.rotation = (current.rotation + 1) % 2; // 2-way
                } else if (this.selectedTool === CELL_TYPES.MIRROR_TRIANGLE) {
                    current.rotation = (current.rotation + 3) % 4; // CCW for M1
                } else if ([CELL_TYPES.MIRROR_OCTAGON, CELL_TYPES.MIRROR_SQUARE].includes(this.selectedTool)) {
                    current.rotation = (current.rotation + 1) % 4; // CW for M3, M4
                } else if (this.selectedTool === CELL_TYPES.MIRROR_OMNI) {
                    current.rotation = (current.rotation + 1) % 8; // 8-way
                }
            }
        } else {
            // Place new item (overwrite if different)
            // Default properties
            const newItem = {
                type: this.selectedTool,
                direction: DIRECTIONS.RIGHT,
                rotation: 0,
                locked: true, // Items in level file are usually locked
                fixedRotation: !isShiftClick // Shift-Click creates Rotatable (Yellow)
            };
            this.grid.setCell(x, y, newItem);
        }
        this.draw();
    }

    toggleExternalEmitter(x, y, isRightClick) {
        // Find existing
        const index = this.externalEmitters.findIndex(e => e.x === x && e.y === y);

        // Erase if Right Click OR Eraser Tool
        if (isRightClick || this.selectedTool === CELL_TYPES.EMPTY) {
            if (index !== -1) {
                this.externalEmitters.splice(index, 1);
                this.draw();
            }
            return;
        }

        // Determine Direction based on Side (Strict Auto-Orient)
        let dir = DIRECTIONS.RIGHT;
        if (x === -1) dir = DIRECTIONS.RIGHT;
        else if (x === this.grid.width) dir = DIRECTIONS.LEFT;
        else if (y === -1) dir = DIRECTIONS.DOWN;
        else if (y === this.grid.height) dir = DIRECTIONS.UP;

        if (index !== -1) {
            // Already exists. Ensure orientation is correct (Fix if wrong)
            this.externalEmitters[index].direction = dir;
        } else {
            // Add new
            this.externalEmitters.push({ x, y, direction: dir });
        }
        this.draw();
    }



    draw() {
        // Calculate layout for Editor Grid (as Renderer might hold Game Grid metrics)
        this.game.renderer.calculateLayout(this.grid);

        // Clear
        this.ctx.fillStyle = '#050510';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Grid
        this.game.renderer.drawGrid(this.grid);

        // Draw Items (using Renderer)
        // We pass empty laser system and particle system
        this.game.renderer.drawItems(this.grid, []);

        // Draw External Emitters
        if (this.game.renderer.drawExternalEmitters) {
            this.game.renderer.drawExternalEmitters(this.externalEmitters);
        }

        // Draw specific editor overlays (e.g. valid placement indicators) if needed
    }

    exportLevel() {
        // Construct Concise Level Object
        const grid = { width: this.grid.width, height: this.grid.height };
        const items = [];
        const emitters = [...this.externalEmitters];

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.cells[y][x];
                if (!cell) continue;

                if (cell.type === CELL_TYPES.EMITTER) {
                    emitters.push({ x, y, direction: cell.direction });
                } else if (cell.type !== CELL_TYPES.EMPTY) {
                    const item = { x, y, type: cell.type };
                    if (cell.rotation !== undefined && cell.rotation !== 0) item.rotation = cell.rotation;
                    if (cell.direction !== undefined) item.direction = cell.direction; // Copy direction

                    // Locks
                    if ([CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON, CELL_TYPES.MIRROR_SQUARE, CELL_TYPES.MIRROR_OMNI].includes(cell.type)) {
                        item.locked = true;
                        if (!cell.fixedRotation) item.fixedRotation = false; // Default true (red)
                    }
                    items.push(item);
                }
            }
        }

        // Helper to stringify item compactly
        const stringifyItem = (obj) => {
            const parts = [];
            parts.push(`x: ${obj.x}`);
            parts.push(`y: ${obj.y}`);
            if (obj.type !== undefined) parts.push(`type: ${obj.type}`);
            if (obj.direction !== undefined) parts.push(`direction: ${obj.direction}`);
            if (obj.rotation !== undefined) parts.push(`rotation: ${obj.rotation}`);
            if (obj.locked === true) parts.push(`locked: true`);
            if (obj.fixedRotation === false) parts.push(`fixedRotation: false`);
            return `{ ${parts.join(', ')} }`;
        };

        let output = `{\n`;
        output += `    id: 999,\n`;
        output += `    name: "Custom Level",\n`;
        output += `    grid: { width: ${grid.width}, height: ${grid.height} },\n`;
        output += `    items: [\n`;
        items.forEach((item, i) => {
            output += `        ${stringifyItem(item)}${i < items.length - 1 ? ',' : ''}\n`;
        });
        output += `    ],\n`;
        output += `    emitters: [\n`;
        emitters.forEach((em, i) => {
            output += `        ${stringifyItem(em)}${i < emitters.length - 1 ? ',' : ''}\n`;
        });
        output += `    ],\n`;
        output += `    inventory: { mirror1: ${this.inventoryConfig.mirror1}, mirror2: ${this.inventoryConfig.mirror2}, mirror3: ${this.inventoryConfig.mirror3}, mirror4: ${this.inventoryConfig.mirror4}, mirror5: ${this.inventoryConfig.mirror5} }\n`;
        output += `}`;

        // Show in Modal
        const modal = document.getElementById('code-modal'); // Assuming standard modal ID
        const codeBlock = document.getElementById('level-json-code');
        if (modal && codeBlock) {
            codeBlock.textContent = output + ",";
            modal.classList.remove('hidden');
        } else {
            console.log(output);
            alert("Check console for Code");
        }
    }

    testLevel() {
        // Just like Game.generateLevel logic
        const items = [];
        const emitters = [...this.externalEmitters];
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.cells[y][x];
                if (!cell) continue;
                if (cell.type === CELL_TYPES.EMITTER) {
                    emitters.push({ x, y, direction: cell.direction });
                } else {
                    const item = { x, y, type: cell.type };
                    if (cell.rotation !== undefined) item.rotation = cell.rotation;
                    if (cell.direction !== undefined) item.direction = cell.direction; // Copy direction
                    if ([CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON, CELL_TYPES.MIRROR_SQUARE, CELL_TYPES.MIRROR_OMNI].includes(cell.type)) {
                        item.locked = true;
                        item.fixedRotation = cell.fixedRotation;
                    }
                    items.push(item);
                }
            }
        }

        const level = {
            id: -1,
            name: "Test Level",
            grid: { width: this.grid.width, height: this.grid.height },
            items,
            emitters,
            inventory: { ...this.inventoryConfig }
        };

        this.hide();
        // Load into game
        this.game.currentLevel = -1;
        this.game.generatedLevel = level;
        this.game.grid.initialize(level);
        this.game.renderer.calculateLayout(this.game.grid);
        this.game.inventory = { ...level.inventory };
        this.game.selectedMirrorType = CELL_TYPES.MIRROR_TRIANGLE;
        this.game.updateInventoryUI();
        this.game.history = [];

        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('ui-layer').classList.remove('hidden');
        document.getElementById('level-title').innerText = "Editor Test";
        document.getElementById('next-level-btn').disabled = true;
    }

    updateToolUI() {
        document.querySelectorAll('.editor-tool').forEach(btn => {
            if (parseInt(btn.dataset.type) === this.selectedTool) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
}
