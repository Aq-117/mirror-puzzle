import { CELL_TYPES, DIRECTIONS } from './Grid.js';

export class InputHandler {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.isDragging = false;

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });
    }

    getGridPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - this.game.renderer.offsetX;
        const y = e.clientY - rect.top - this.game.renderer.offsetY;

        const gridX = Math.floor(x / this.game.renderer.cellSize);
        const gridY = Math.floor(y / this.game.renderer.cellSize);

        return { x: gridX, y: gridY };
    }

    handleMouseDown(e) {
        if (this.game.editor && this.game.editor.isVisible) return;
        if (e.button !== 0) return; // Only left click

        const { x, y } = this.getGridPos(e);
        const cell = this.game.grid.getCell(x, y);

        if (cell) {
            if (cell.type === CELL_TYPES.EMPTY) {
                // Place mirror if available
                const selectedType = this.game.selectedMirrorType;
                let available = 0;

                if (selectedType === CELL_TYPES.MIRROR_TRIANGLE) available = this.game.inventory.mirror1;
                else if (selectedType === CELL_TYPES.MIRROR_LINE) available = this.game.inventory.mirror2;
                else if (selectedType === CELL_TYPES.MIRROR_OCTAGON) available = this.game.inventory.mirror3;
                else if (selectedType === CELL_TYPES.MIRROR_SQUARE) available = this.game.inventory.mirror4;
                else if (selectedType === CELL_TYPES.MIRROR_OMNI) available = this.game.inventory.mirror5;

                if (available > 0) {
                    this.game.pushHistory(x, y);
                    this.game.grid.setCell(x, y, { type: selectedType, rotation: 0 });

                    if (selectedType === CELL_TYPES.MIRROR_TRIANGLE) this.game.inventory.mirror1--;
                    else if (selectedType === CELL_TYPES.MIRROR_LINE) this.game.inventory.mirror2--;
                    else if (selectedType === CELL_TYPES.MIRROR_OCTAGON) this.game.inventory.mirror3--;
                    else if (selectedType === CELL_TYPES.MIRROR_SQUARE) this.game.inventory.mirror4--;
                    else if (selectedType === CELL_TYPES.MIRROR_OMNI) this.game.inventory.mirror5--;

                    this.game.updateInventoryUI();
                    this.game.audioSystem.playMirrorRotate();
                } else {
                    this.game.audioSystem.playError();
                }
            } else if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_TRIANGLE || cell.type === CELL_TYPES.MIRROR_OCTAGON || cell.type === CELL_TYPES.MIRROR_SQUARE || cell.type === CELL_TYPES.MIRROR_OMNI) {
                // Check if rotation is fixed
                if (cell.fixedRotation) {
                    this.game.audioSystem.playError();
                    return;
                }

                // Rotate mirror
                this.game.pushHistory(x, y);
                if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR) {
                    cell.rotation = (cell.rotation + 1) % 2;
                } else if (cell.type === CELL_TYPES.MIRROR_OMNI) {
                    // M5 is 8-way
                    cell.rotation = (cell.rotation + 1) % 8; // Clockwise
                } else if (cell.type === CELL_TYPES.MIRROR_TRIANGLE) {
                    // M1 is 4-way, rotate Counter-Clockwise
                    cell.rotation = (cell.rotation + 3) % 4;
                } else {
                    // M3, M4 are 4-way
                    // Rotate Clockwise
                    cell.rotation = (cell.rotation + 1) % 4;
                }
                this.game.audioSystem.playMirrorRotate();
            } else if ([CELL_TYPES.EMITTER, CELL_TYPES.EMITTER_DIAGONAL, CELL_TYPES.EMITTER_OMNI].includes(cell.type)) {
                // Rotate emitter
                this.game.pushHistory(x, y);

                if (cell.type === CELL_TYPES.EMITTER) {
                    // Orthogonal Only: UP -> RIGHT -> DOWN -> LEFT
                    const nextDir = {
                        [DIRECTIONS.UP]: DIRECTIONS.RIGHT,
                        [DIRECTIONS.RIGHT]: DIRECTIONS.DOWN,
                        [DIRECTIONS.DOWN]: DIRECTIONS.LEFT,
                        [DIRECTIONS.LEFT]: DIRECTIONS.UP
                    };
                    const next = nextDir[cell.direction];
                    cell.direction = (next !== undefined) ? next : DIRECTIONS.RIGHT;
                } else if (cell.type === CELL_TYPES.EMITTER_DIAGONAL) {
                    // Diagonal Only
                    const nextDir = {
                        [DIRECTIONS.UP_RIGHT]: DIRECTIONS.DOWN_RIGHT,
                        [DIRECTIONS.DOWN_RIGHT]: DIRECTIONS.DOWN_LEFT,
                        [DIRECTIONS.DOWN_LEFT]: DIRECTIONS.UP_LEFT,
                        [DIRECTIONS.UP_LEFT]: DIRECTIONS.UP_RIGHT
                    };
                    const next = nextDir[cell.direction];
                    cell.direction = (next !== undefined) ? next : DIRECTIONS.DOWN_LEFT;
                } else if (cell.type === CELL_TYPES.EMITTER_OMNI) {
                    // 8-Way Clockwise
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
                    const next = map[cell.direction];
                    cell.direction = (next !== undefined) ? next : DIRECTIONS.RIGHT;
                }

                this.game.audioSystem.playMirrorRotate();
            }
        }
    }

    handleMouseMove(e) {
        // Highlight cell?
    }

    handleMouseUp(e) {
        this.isDragging = false;
    }

    handleRightClick(e) {
        const { x, y } = this.getGridPos(e);
        const cell = this.game.grid.getCell(x, y);

        if (cell && (cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR_TRIANGLE || cell.type === CELL_TYPES.MIRROR_OCTAGON || cell.type === CELL_TYPES.MIRROR_SQUARE || cell.type === CELL_TYPES.MIRROR_OMNI)) {
            // Check if locked (Fixed position)
            if (cell.locked) {
                this.game.audioSystem.playError();
                return;
            }

            this.game.pushHistory(x, y);

            // Return to inventory
            if (cell.type === CELL_TYPES.MIRROR_TRIANGLE) this.game.inventory.mirror1++;
            else if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR) this.game.inventory.mirror2++;
            else if (cell.type === CELL_TYPES.MIRROR_OCTAGON) this.game.inventory.mirror3++;
            else if (cell.type === CELL_TYPES.MIRROR_SQUARE) this.game.inventory.mirror4++;
            else if (cell.type === CELL_TYPES.MIRROR_OMNI) this.game.inventory.mirror5++;

            this.game.grid.clearCell(x, y);
            this.game.updateInventoryUI();
            this.game.audioSystem.playMirrorRotate();
        }
    }
}
