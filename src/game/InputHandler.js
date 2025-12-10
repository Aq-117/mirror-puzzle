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

                if (available > 0) {
                    this.game.pushHistory(x, y);
                    this.game.grid.setCell(x, y, { type: selectedType, rotation: 0 });

                    if (selectedType === CELL_TYPES.MIRROR_TRIANGLE) this.game.inventory.mirror1--;
                    else if (selectedType === CELL_TYPES.MIRROR_LINE) this.game.inventory.mirror2--;

                    this.game.updateInventoryUI();
                    this.game.audioSystem.playMirrorRotate();
                } else {
                    this.game.audioSystem.playError();
                }
            } else if (cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR_TRIANGLE) {
                // Rotate mirror
                this.game.pushHistory(x, y);
                // M1 has 4 rotations, M2 has 2 (effectively, but we can allow 4 for simplicity or mod 2)
                // Actually M2 only needs 2 states (/ and \). 0 and 1.
                // M1 needs 4 states.

                if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR) {
                    cell.rotation = (cell.rotation + 1) % 2;
                } else {
                    // Reverse rotation (Counter-Clockwise)
                    cell.rotation = (cell.rotation + 3) % 4;
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

        if (cell && (cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR_TRIANGLE)) {
            this.game.pushHistory(x, y);

            // Return to inventory
            if (cell.type === CELL_TYPES.MIRROR_TRIANGLE) this.game.inventory.mirror1++;
            else if (cell.type === CELL_TYPES.MIRROR_LINE || cell.type === CELL_TYPES.MIRROR) this.game.inventory.mirror2++; // Treat old mirrors as M2 if removed? Or M1?
            // Actually old levels use MIRROR. If we replace them with M1, they become M1.
            // If we remove a legacy MIRROR, what do we get back?
            // Since we are converting levels to use M1/M2, we shouldn't see generic MIRROR much.
            // But if we do, let's assume it maps to M1 for now as per plan "Update Levels 1-6 to use M1".
            // Wait, if I place M1, it is MIRROR_TRIANGLE.
            // If I place M2, it is MIRROR_LINE.

            this.game.grid.clearCell(x, y);
            this.game.updateInventoryUI();
            this.game.audioSystem.playMirrorRotate();
        }
    }
}
