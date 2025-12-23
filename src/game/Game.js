import { Grid, CELL_TYPES, DIRECTIONS } from './Grid.js';
import { Renderer } from './Renderer.js';
import { LaserSystem } from './LaserSystem.js';
import { InputHandler } from './InputHandler.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AudioSystem } from './AudioSystem.js';
import { levels } from '../levels.js';
import { LevelGenerator } from '../generator/LevelGenerator.js';
import { LevelEditor } from '../editor/LevelEditor.js';

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
        this.maxLevelReached = parseInt(localStorage.getItem('maxLevelReached')) || 0;
        this.inventory = { mirror1: 0, mirror2: 0 };
        this.selectedMirrorType = CELL_TYPES.MIRROR_TRIANGLE; // Default to M1
        this.selectedMirrorType = CELL_TYPES.MIRROR_TRIANGLE; // Default to M1
        this.history = []; // Undo stack
        this.editor = new LevelEditor(this);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Game UI Buttons
        document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
        document.getElementById('reset-btn').addEventListener('click', () => this.loadLevel(this.currentLevel));
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('restart-game-btn').addEventListener('click', () => {
            document.getElementById('victory-popup').classList.add('hidden');
            this.showHome();
        });
        document.getElementById('game-home-btn').addEventListener('click', () => this.showHome());

        // Home Screen Buttons
        document.getElementById('home-levels-btn').addEventListener('click', () => this.showLevels());
        document.getElementById('home-settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('home-editor-btn').addEventListener('click', () => this.showEditor());

        const genBtn = document.getElementById('generate-btn');
        if (genBtn) genBtn.addEventListener('click', () => this.generateLevel());

        // Level Select Buttons
        document.getElementById('back-home-btn').addEventListener('click', () => this.showHome());

        // Settings Buttons
        document.getElementById('back-home-settings-btn').addEventListener('click', () => this.showHome());
        document.getElementById('music-vol').addEventListener('input', (e) => this.audioSystem.setMusicVolume(e.target.value));
        document.getElementById('sfx-vol').addEventListener('input', (e) => this.audioSystem.setSoundVolume(e.target.value));

        // Mirror Selection UI
        document.getElementById('select-m1').addEventListener('click', () => this.selectMirror(CELL_TYPES.MIRROR_TRIANGLE));
        document.getElementById('select-m2').addEventListener('click', () => this.selectMirror(CELL_TYPES.MIRROR_LINE));

        const m3Btn = document.getElementById('select-m3');
        if (m3Btn) m3Btn.addEventListener('click', () => this.selectMirror(CELL_TYPES.MIRROR_OCTAGON));

        const m4Btn = document.getElementById('select-m4');
        if (m4Btn) m4Btn.addEventListener('click', () => this.selectMirror(CELL_TYPES.MIRROR_SQUARE));

        const homeBtn = document.getElementById('game-home-btn');
        if (homeBtn) homeBtn.addEventListener('click', () => this.showHome());

        this.showHome(); // Start at home
        window.game = this; // Expose for debugging
    }

    showHome() {
        document.getElementById('home-screen').classList.remove('hidden');
        document.getElementById('level-select-screen').classList.add('hidden');
        document.getElementById('settings-screen').classList.add('hidden');
        document.getElementById('ui-layer').classList.add('hidden');
        this.audioSystem.playMusic();
    }

    showLevels() {
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('level-select-screen').classList.remove('hidden');
        this.renderLevelGrid();
    }

    showSettings() {
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('settings-screen').classList.remove('hidden');
    }

    showEditor() {
        this.editor.init(); // Ensure events are bound
        this.editor.show();
    }

    renderLevelGrid() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        levels.forEach((level, index) => {
            const btn = document.createElement('div');
            btn.className = 'level-btn';
            if (index > this.maxLevelReached) {
                btn.classList.add('locked');
            } else {
                const span = document.createElement('span');
                span.innerText = index + 1;
                btn.appendChild(span);
                btn.addEventListener('click', () => {
                    this.loadLevel(index);
                    document.getElementById('level-select-screen').classList.add('hidden');
                    document.getElementById('ui-layer').classList.remove('hidden');
                });
            }
            grid.appendChild(btn);
        });
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
        if (type === CELL_TYPES.MIRROR_LINE && this.currentLevel !== -1 && this.currentLevel < 8) { // Level 9 is index 8
            this.audioSystem.playError();
            return;
        }
        if (type === CELL_TYPES.MIRROR_OCTAGON && this.currentLevel !== -1 && this.currentLevel < 33) { // Level 34 is index 33
            this.audioSystem.playError();
            return;
        }
        // M4 Locking Logic (e.g. unlock at Level 40?)
        // For now, let's say Level 40 (If exists, or just unlock for custom levels)
        if (type === CELL_TYPES.MIRROR_SQUARE && this.currentLevel !== -1 && this.currentLevel < 39) { // Unlock at Level 40
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
                mirror2: level.inventory.mirror2 || 0,
                mirror3: level.inventory.mirror3 || 0,
                mirror4: level.inventory.mirror4 || 0
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
        if (!this.inventory) return;

        const m1Count = document.getElementById('m1-count');
        const m2Count = document.getElementById('m2-count');
        const m3Count = document.getElementById('m3-count');
        const m4Count = document.getElementById('m4-count');

        if (m1Count) m1Count.textContent = this.inventory.mirror1;
        if (m2Count) m2Count.textContent = this.inventory.mirror2;
        if (m3Count) m3Count.textContent = this.inventory.mirror3 || 0;
        if (m4Count) m4Count.textContent = this.inventory.mirror4 || 0;

        // Highlight selected
        document.querySelectorAll('.inventory-item').forEach(el => el.classList.remove('selected'));
        if (this.selectedMirrorType === CELL_TYPES.MIRROR_TRIANGLE) {
            document.getElementById('select-m1').classList.add('selected');
        } else if (this.selectedMirrorType === CELL_TYPES.MIRROR_LINE) {
            document.getElementById('select-m2').classList.add('selected');
        } else if (this.selectedMirrorType === CELL_TYPES.MIRROR_OCTAGON) {
            const el = document.getElementById('select-m3');
            if (el) el.classList.add('selected');
        } else if (this.selectedMirrorType === CELL_TYPES.MIRROR_SQUARE) {
            const el = document.getElementById('select-m4');
            if (el) el.classList.add('selected');
        }

        // Handle Locks Visibility
        const m2El = document.getElementById('select-m2');
        const m2Lock = m2El.querySelector('.icon-lock');
        const m2Icon = m2El.querySelector('.icon-m2');

        const m3El = document.getElementById('select-m3');
        const m3Lock = m3El ? m3El.querySelector('.icon-lock') : null;
        const m3Icon = m3El ? m3El.querySelector('.icon-m3') : null;

        const m4El = document.getElementById('select-m4');
        const m4Lock = m4El ? m4El.querySelector('.icon-lock') : null;
        const m4Icon = m4El ? m4El.querySelector('.icon-m4') : null;

        // Unlock logic
        // M2
        if (this.currentLevel !== -1 && this.currentLevel < 8) {
            m2El.classList.add('locked');
            if (m2Lock) m2Lock.classList.remove('hidden');
            if (m2Icon) m2Icon.classList.add('hidden');
        } else {
            m2El.classList.remove('locked');
            if (m2Lock) m2Lock.classList.add('hidden');
            if (m2Icon) m2Icon.classList.remove('hidden');
        }

        // M3
        if (this.currentLevel !== -1 && this.currentLevel < 33) {
            if (m3El) m3El.classList.add('locked');
            if (m3Lock) m3Lock.classList.remove('hidden');
            if (m3Icon) m3Icon.classList.add('hidden');
        } else {
            if (m3El) m3El.classList.remove('locked');
            if (m3Lock) m3Lock.classList.add('hidden');
            if (m3Icon) m3Icon.classList.remove('hidden');
        }

        // M4
        if (this.currentLevel !== -1 && this.currentLevel < 39) {
            if (m4El) m4El.classList.add('locked');
            if (m4Lock) m4Lock.classList.remove('hidden');
            if (m4Icon) m4Icon.classList.add('hidden');
        } else {
            if (m4El) m4El.classList.remove('locked');
            if (m4Lock) m4Lock.classList.add('hidden');
            if (m4Icon) m4Icon.classList.remove('hidden');
        }
    }

    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => this.loop());

        // Check Priority: Editor -> Game -> Home
        if (this.editor && this.editor.isVisible) {
            this.editor.draw();
            return;
        }

        // Logic updates
        // Only update if in game mode (UI layer visible)
        if (!document.getElementById('ui-layer').classList.contains('hidden')) {
            const currentLevelData = (this.currentLevel === -1) ? this.generatedLevel : levels[this.currentLevel];

            if (currentLevelData) {
                this.laserSystem.update(this.particleSystem, this.renderer, currentLevelData.emitters);
                this.particleSystem.update();
                this.checkWinCondition();

                // Render
                this.renderer.draw(this.grid, this.laserSystem, this.particleSystem, currentLevelData.emitters);
            }
        } else {
            // Just clear
            this.ctx.fillStyle = '#050510';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
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

                // Unlock next level
                if (this.currentLevel + 1 > this.maxLevelReached) {
                    this.maxLevelReached = this.currentLevel + 1;
                    localStorage.setItem('maxLevelReached', this.maxLevelReached);
                }
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

    generateLevel() {
        try {
            const generator = new LevelGenerator();
            // Difficulty curve based on maxLevelReached?
            // For now, random or medium
            const level = generator.generate({
                width: 7,
                height: 7,
                minPathLength: 4,
                maxReceivers: 2
            });

            console.log("Generated Level:", level);

            // Hack: inject into levels array or just load it directly
            // We'll load it as a temporary level.
            this.currentLevel = -1; // Specific ID for generated?
            this.generatedLevel = level;

            this.grid.initialize(level);
            this.renderer.calculateLayout(this.grid);

            this.inventory = {
                mirror1: level.inventory.mirror1,
                mirror2: level.inventory.mirror2,
                mirror3: level.inventory.mirror3
            };
            this.selectedMirrorType = CELL_TYPES.MIRROR_TRIANGLE;
            this.updateInventoryUI();
            this.history = [];

            // UI Changes
            document.getElementById('home-screen').classList.add('hidden');
            document.getElementById('ui-layer').classList.remove('hidden');
            const titleEl = document.getElementById('level-title');
            if (titleEl) titleEl.innerText = "Generated Level";
            document.getElementById('next-level-btn').disabled = true;

        } catch (e) {
            console.error("Generation Failed:", e);
            alert("Generation failed, trying again...");
        }
    }
}
