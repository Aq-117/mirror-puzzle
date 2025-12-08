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
                if (this.game.inventory.mirrors > 0) {
                    this.game.pushHistory(x, y);
                    this.game.grid.setCell(x, y, { type: CELL_TYPES.MIRROR, rotation: 0 });
                    this.game.inventory.mirrors--;
                    this.game.updateInventoryUI();
                    this.game.audioSystem.playMirrorRotate();
                } else {
                    this.game.audioSystem.playError();
                }
            } else if (cell.type === CELL_TYPES.MIRROR) {
                // Rotate mirror
                this.game.pushHistory(x, y);
                cell.rotation = (cell.rotation + 1) % 2;
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

        if (cell && cell.type === CELL_TYPES.MIRROR) {
            this.game.pushHistory(x, y);
            this.game.grid.clearCell(x, y);
            this.game.inventory.mirrors++;
            this.game.updateInventoryUI();
            this.game.audioSystem.playMirrorRotate();
        }
    }
}
