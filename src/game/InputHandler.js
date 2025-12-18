import { CELL_TYPES } from './Grid.js';

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

                if (available > 0) {
                    this.game.pushHistory(x, y);
                    this.game.grid.setCell(x, y, { type: selectedType, rotation: 0 });

                    if (selectedType === CELL_TYPES.MIRROR_TRIANGLE) this.game.inventory.mirror1--;
                    else if (selectedType === CELL_TYPES.MIRROR_LINE) this.game.inventory.mirror2--;
                    else if (selectedType === CELL_TYPES.MIRROR_OCTAGON) this.game.inventory.mirror3--;

                    this.game.updateInventoryUI();
                    this.game.audioSystem.playMirrorRotate();
                } else {
                    this.game.audioSystem.playError();
                }
            } else if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_TRIANGLE || cell.type === CELL_TYPES.MIRROR_OCTAGON) {
                // Check if rotation is fixed
                if (cell.fixedRotation) {
                    this.game.audioSystem.playError();
                    return;
                }

                // Rotate mirror
                this.game.pushHistory(x, y);
                if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR) {
                    cell.rotation = (cell.rotation + 1) % 2;
                } else {
                    // Reverse rotation (Counter-Clockwise)
                    cell.rotation = (cell.rotation + 3) % 4;
                }
                this.game.audioSystem.playMirrorRotate();
            } else if (cell.type === CELL_TYPES.EMITTER) {
                // Rotate emitter
                this.game.pushHistory(x, y);
                // Rotate clockwise: UP -> RIGHT -> DOWN -> LEFT
                // DIRECTIONS: UP=0, RIGHT=1, DOWN=2, LEFT=3
                cell.direction = (cell.direction + 1) % 4;
                this.game.audioSystem.playMirrorRotate(); // Reuse sound
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

        if (cell && (cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR_TRIANGLE)) {
            // Check if locked (Fixed position)
            if (cell.locked) {
                this.game.audioSystem.playError();
                return;
            }

            this.game.pushHistory(x, y);

            // Return to inventory
            if (cell.type === CELL_TYPES.MIRROR_TRIANGLE) this.game.inventory.mirror1++;
            else if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR) this.game.inventory.mirror2++;

            this.game.grid.clearCell(x, y);
            this.game.updateInventoryUI();
            this.game.audioSystem.playMirrorRotate();
        }
    }
}
