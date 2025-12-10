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
        this.inventory = { mirror1: 0, mirror2: 0 };
        this.selectedMirrorType = CELL_TYPES.MIRROR_TRIANGLE; // Default to M1
        this.history = []; // Undo stack

        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
        document.getElementById('reset-btn').addEventListener('click', () => this.loadLevel(this.currentLevel));
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            document.getElementById('victory-popup').classList.add('hidden');
            this.loadLevel(0);
        });

        // Mirror Selection UI
        document.getElementById('select-m1').addEventListener('click', () => this.selectMirror(CELL_TYPES.MIRROR_TRIANGLE));
        document.getElementById('select-m2').addEventListener('click', () => this.selectMirror(CELL_TYPES.MIRROR_LINE));

        // Debug
        document.getElementById('level-jump-btn').addEventListener('click', () => {
            const val = parseInt(document.getElementById('level-jump-input').value);
            if (!isNaN(val)) this.jumpToLevel(val);
        });

        this.loadLevel(0);
        window.game = this; // Expose for debugging
    }

    jumpToLevel(n) {
        // n is 1-based level number
        if (n >= 1 && n <= levels.length) {
            this.loadLevel(n - 1);
        } else {
            console.warn("Level out of range");
        }
    }

    selectMirror(type) {
        // Check if locked
        if (type === CELL_TYPES.MIRROR_LINE && this.currentLevel < 8) { // Level 9 is index 8
            this.audioSystem.playError();
            return;
        }
        this.selectedMirrorType = type;
        this.updateInventoryUI();
    }

    undo() {
        if (this.history.length > 0) {
            const action = this.history.pop();
            const { x, y, prevCell, prevInventory } = action;

            if (prevCell) {
                this.grid.setCell(x, y, prevCell);
            } else {
                this.grid.clearCell(x, y);
            }

            this.inventory = { ...prevInventory };
            this.updateInventoryUI();
            this.audioSystem.playMirrorRotate();
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
        if (this.history.length > 10) this.history.shift();
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
            // Default to 0 if not specified
            this.inventory = {
                mirror1: level.inventory.mirror1 || 0,
                mirror2: level.inventory.mirror2 || 0
            };

            // If old format (mirrors), map to mirror1
            if (level.inventory.mirrors !== undefined) {
                this.inventory.mirror1 = level.inventory.mirrors;
            }

            // Reset selection to M1
            this.selectedMirrorType = CELL_TYPES.MIRROR_TRIANGLE;

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
        // Update counts
        document.getElementById('m1-count').innerText = this.inventory.mirror1;
        document.getElementById('m2-count').innerText = this.inventory.mirror2;

        // Update selection styling
        const m1El = document.getElementById('select-m1');
        const m2El = document.getElementById('select-m2');

        m1El.classList.toggle('selected', this.selectedMirrorType === CELL_TYPES.MIRROR_TRIANGLE);
        m2El.classList.toggle('selected', this.selectedMirrorType === CELL_TYPES.MIRROR_LINE);

        // Update locking visual
        const m2Lock = m2El.querySelector('.icon-lock');
        const m2Icon = m2El.querySelector('.icon-m2');

        if (this.currentLevel < 8) { // Level 9 is index 8
            m2El.classList.add('locked');
            if (m2Lock) m2Lock.classList.remove('hidden');
            if (m2Icon) m2Icon.classList.add('hidden');
        } else {
            m2El.classList.remove('locked');
            if (m2Lock) m2Lock.classList.add('hidden');
            if (m2Icon) m2Icon.classList.remove('hidden');
        }
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
            // Victory
            document.getElementById('victory-popup').classList.remove('hidden');
            this.audioSystem.playLevelComplete(); // Or a victory sound
        }
    }
}
