import { Grid, CELL_TYPES, DIRECTIONS } from './Grid.js';
import { Renderer } from './Renderer.js';
import { LaserSystem } from './LaserSystem.js';
import { InputHandler } from './InputHandler.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AudioSystem } from './AudioSystem.js';
import { levels } from '../levels.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = new Grid(10, 10);
        this.renderer = new Renderer(this.ctx);
        this.laserSystem = new LaserSystem(this.grid);
        this.inputHandler = new InputHandler(canvas, this);
        this.particleSystem = new ParticleSystem();
        this.audioSystem = new AudioSystem();
        this.currentLevel = 0;
        this.currentLevel = 0;
        this.inventory = { mirrors: 0 };
        this.history = []; // Undo stack

        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
        document.getElementById('reset-btn').addEventListener('click', () => this.loadLevel(this.currentLevel));
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());

        this.loadLevel(0);
    }

    undo() {
        if (this.history.length > 0) {
            const action = this.history.pop();
            // Action: { type: 'place'|'remove'|'rotate', x, y, prevCell, prevInventory }
            // Actually, simplest is to store cell state and inventory before change.

            const { x, y, prevCell, prevInventory } = action;

            if (prevCell) {
                this.grid.setCell(x, y, prevCell);
            } else {
                this.grid.clearCell(x, y);
            }

            this.inventory = { ...prevInventory };
            this.updateInventoryUI();
            this.audioSystem.playMirrorRotate(); // Feedback
        }
    }

    pushHistory(x, y) {
        const cell = this.grid.getCell(x, y);
        this.history.push({
            x,
            y,
            prevCell: cell ? { ...cell } : null,
            prevInventory: { ...this.inventory }
        });
        if (this.history.length > 10) this.history.shift(); // Limit history
    }

    resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.renderer.calculateLayout(this.grid);
    }

    loadLevel(index) {
        if (index >= 0 && index < levels.length) {
            this.currentLevel = index;
            const level = levels[index];
            this.grid.initialize(level);
            this.renderer.calculateLayout(this.grid);

            // Inventory
            this.inventory = { ...level.inventory };
            this.updateInventoryUI();
            this.history = []; // Clear history

            // Update UI
            const titleEl = document.getElementById('level-title');
            const descEl = document.getElementById('level-desc');
            if (titleEl) titleEl.innerText = level.name;
            if (descEl) descEl.innerText = "Guide the laser to the target.";
            document.getElementById('next-level-btn').disabled = true;
        }
    }

    updateInventoryUI() {
        document.getElementById('mirror-count').innerText = this.inventory.mirrors;
    }

    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => this.loop());

        // Logic updates
        const currentLevelData = levels[this.currentLevel];
        this.laserSystem.update(this.particleSystem, this.renderer, currentLevelData.emitters);
        this.particleSystem.update();
        this.checkWinCondition();

        // Render
        this.renderer.draw(this.grid, this.laserSystem, this.particleSystem, currentLevelData.emitters);
    }

    checkWinCondition() {
        // Get all receivers from grid
        let totalReceivers = 0;
        let activeReceivers = 0;

        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                if (this.grid.cells[y][x].type === CELL_TYPES.RECEIVER) {
                    totalReceivers++;
                    if (this.laserSystem.activeReceivers.has(`${x},${y}`)) {
                        activeReceivers++;
                    }
                }
            }
        }

        if (totalReceivers > 0 && totalReceivers === activeReceivers) {
            // Level Complete
            if (document.getElementById('next-level-btn').disabled) {
                this.audioSystem.playLevelComplete();
            }
            document.getElementById('next-level-btn').disabled = false;
            document.getElementById('level-desc').innerText = "LEVEL COMPLETE! Press Next Level.";
        } else {
            document.getElementById('next-level-btn').disabled = true;
            if (this.currentLevel < levels.length) {
                // Only reset text if not complete
            }
        }
    }

    nextLevel() {
        if (this.currentLevel + 1 < levels.length) {
            this.loadLevel(this.currentLevel + 1);
        } else {
            alert("You have beaten all levels!");
        }
    }
}
