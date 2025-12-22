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
        this.inventoryConfig = { mirror1: 0, mirror2: 0, mirror3: 0 };
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
            this.game.showHome();
        });

        this.canvas.addEventListener('mousedown', (e) => this.handleInput(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e)); // Window to catch release outside
        this.canvas.addEventListener('contextmenu', (e) => {
            if (this.isVisible) e.preventDefault();
        });

        // Inventory Inputs
        ['m1', 'm2', 'm3'].forEach(k => {
            document.getElementById(`editor-${k}-count`).addEventListener('change', (e) => {
                const key = k === 'm1' ? 'mirror1' : k === 'm2' ? 'mirror2' : 'mirror3';
                this.inventoryConfig[key] = parseInt(e.target.value) || 0;
            });
        });
    }

    show() {
        this.isVisible = true;
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('editor-screen').classList.remove('hidden');
        document.getElementById('ui-layer').classList.add('hidden');

        // Initial render
        this.game.renderer.calculateLayout(this.grid);
        // We rely on Game.loop to call this.draw()
    }

    hide() {
        this.isVisible = false;
        document.getElementById('editor-screen').classList.add('hidden');
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

        if (current && current.type === this.selectedTool) {
            // Interaction with existing item of same type
            if (isShiftClick) {
                // Toggle Fixed/Rotatable State
                // Only relevant for mirrors
                if ([CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON].includes(current.type)) {
                    current.fixedRotation = !current.fixedRotation;
                }
            } else {
                // Rotate / Change Direction
                if (this.selectedTool === CELL_TYPES.EMITTER) {
                    const nextDir = {
                        [DIRECTIONS.UP]: DIRECTIONS.RIGHT,
                        [DIRECTIONS.RIGHT]: DIRECTIONS.DOWN,
                        [DIRECTIONS.DOWN]: DIRECTIONS.LEFT,
                        [DIRECTIONS.LEFT]: DIRECTIONS.UP
                    };
                    const next = nextDir[current.direction];
                    current.direction = (next !== undefined) ? next : DIRECTIONS.RIGHT;
                } else if ([CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON].includes(this.selectedTool)) {
                    current.rotation = (current.rotation + 1) % 4;
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
                fixedRotation: true // Default to fixed (Red)
            };
            this.grid.setCell(x, y, newItem);
        }
        this.draw();
    }

    toggleExternalEmitter(x, y, isRightClick) {
        // Find existing
        const index = this.externalEmitters.findIndex(e => e.x === x && e.y === y);

        if (isRightClick) {
            if (index !== -1) {
                this.externalEmitters.splice(index, 1);
                this.draw();
            }
            return;
        }

        if (index !== -1) {
            // Rotate existing
            const em = this.externalEmitters[index];
            const nextDir = {
                [DIRECTIONS.UP]: DIRECTIONS.RIGHT,
                [DIRECTIONS.RIGHT]: DIRECTIONS.DOWN,
                [DIRECTIONS.DOWN]: DIRECTIONS.LEFT,
                [DIRECTIONS.LEFT]: DIRECTIONS.UP
            };
            em.direction = nextDir[em.direction] || DIRECTIONS.RIGHT;
        } else {
            // Add new
            // Smart default direction logic
            let dir = DIRECTIONS.RIGHT;
            if (x === -1) dir = DIRECTIONS.RIGHT;
            else if (x === this.grid.width) dir = DIRECTIONS.LEFT;
            else if (y === -1) dir = DIRECTIONS.DOWN;
            else if (y === this.grid.height) dir = DIRECTIONS.UP;

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
        // Construct JSON
        const items = [];
        const emitters = [...this.externalEmitters];
        const grid = { width: this.grid.width, height: this.grid.height };

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cell = this.grid.cells[y][x];
                if (!cell) continue;

                if (cell.type === CELL_TYPES.EMITTER) {
                    emitters.push({ x, y, direction: cell.direction });
                } else if (cell.type !== CELL_TYPES.EMPTY) {
                    // Generic Item
                    const item = { x, y, type: cell.type };
                    if (cell.rotation !== undefined) item.rotation = cell.rotation;
                    // Add locks/fixed logic if we add UI for it
                    if ([CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON].includes(cell.type)) {
                        item.locked = true;
                        item.fixedRotation = false; // Default
                    }
                    items.push(item);
                }
            }
        }

        const levelObj = {
            id: 999, // Placeholder
            name: "Custom Level",
            grid,
            items,
            emitters,
            inventory: { ...this.inventoryConfig }
        };

        const json = JSON.stringify(levelObj, null, 4);

        // Show in Modal
        const modal = document.getElementById('code-modal');
        const codeBlock = document.getElementById('level-json-code');
        if (modal && codeBlock) {
            codeBlock.textContent = json + ","; // Add comma for easy array pasting
            modal.classList.remove('hidden');
        } else {
            console.log(json);
            alert("Check console for JSON");
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
                    if ([CELL_TYPES.MIRROR_TRIANGLE, CELL_TYPES.MIRROR_LINE, CELL_TYPES.MIRROR_OCTAGON].includes(cell.type)) {
                        item.locked = true;
                        item.fixedRotation = false;
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
