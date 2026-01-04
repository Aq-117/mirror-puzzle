import { CELL_TYPES, DIRECTIONS } from './Grid.js';

export class TutorialSimple {
    constructor(game) {
        this.game = game;
        this.currentStep = 0;
        this.overlay = null;

        this.steps = [
            {
                title: "Welcome! 🎮",
                message: "Use mirrors to guide laser beams to their targets!",
                image: "./assets/tutorial.png"
            },
            {
                title: "How to Play 🏗️",
                message: "1. Select a mirror from the inventory.\n2. Click the grid to place it.\n3. Click it again to rotate.",
                image: "./assets/select-mirror.png"
            },
            {
                title: "Victory! 🏆",
                message: "You win if all targets are hit.\nYou can then proceed to the next level.",
                image: "./assets/victory.png"
            },
            {
                title: "Emitters 💡",
                message: "They are the source of laser beams.\nWe have different types of emitters.",
                image: "./assets/emitters.png"
            },
            {
                title: "External Emitters ☀️",
                message: "Emitters can be outside the grid and emit light into the puzzle.",
                image: "./assets/emitter-outside.png"
            },
            {
                title: "Internal Emitters 🔄",
                message: "Emitters can be inside and rotated.\nThey emit in 4 orthogonal directions: Up, Down, Left, Right.",
                image: "./assets/emitter-inside.png"
            },
            {
                title: "Diagonal Emitters",
                message: "A special type of emitter.\nOn rotation, it emits lasers in diagonals.",
                image: "./assets/emitter-diagonal.png"
            },
            {
                title: "Omni-Directional 🌟",
                message: "The most powerful emitter.\nCan emit lasers in all 8 directions (both diagonals and orthogonal).",
                image: "./assets/emitter-omni.png"
            },
            {
                title: "Receivers 🎯",
                message: "These are the targets.\nThe laser must pass through ALL receivers to win a level.",
                image: "./assets/receiver.png"
            },
            {
                title: "Walls 🧱",
                message: "Walls block the laser.\nLasers cannot pass through them.",
                image: "./assets/wall.png"
            },
            {
                title: "Mirrors 🪞",
                message: "Objects that reflect the laser to the target.\nDifferent mirrors reflect lasers in different directions.",
                image: "./assets/mirrors.png"
            },
            {
                title: "M1 & M2 Mirrors",
                message: "M1: Reflects from 1 face.\nM2: Reflects from both faces.\n⚠️ They cannot reflect lasers coming from diagonals.",
                image: "./assets/m1-m2.png"
            },
            {
                title: "Diagonal Mirror M3",
                message: "M3: Reflects lasers from orthogonal directions to diagonal directions.",
                image: "./assets/m3.png"
            },
            {
                title: "Mirror M4",
                message: "M4: Reflects diagonal lasers into orthogonal directions.\n⛔ It blocks lasers coming from orthogonal directions.",
                image: "./assets/m4.png"
            },
            {
                title: "Mirror M5 💎",
                message: "The most powerful mirror.\nReflects BOTH diagonal and orthogonal lasers to all 8 directions.",
                image: "./assets/m5.png"
            },
            {
                title: "Inventory & Tools 🛠️",
                message: "Inventory holds your mirrors.\n• Remove: Click mirror to delete\n• Undo: Revert last move\n• Reset: Restart level",
                image: "./assets/inventory.png"
            },
            {
                title: "All Done! 🚀",
                message: "You are ready to play.\nLet the game begin!",
                image: "./assets/lets-go.png"
            }
        ];
    }

    start() {
        // Always reset for manual start
        this.currentStep = 0;
        this.show();
    }

    show() {
        if (this.overlay) this.overlay.remove();

        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        `;

        const step = this.steps[this.currentStep];

        // Check if using an image or canvas
        let visualHtml = '';
        if (step.image) {
            visualHtml = `<img src="${step.image}" style="
                width: 300px; height: 150px; 
                object-fit: contain; 
                border: 1px solid #00f3ff; 
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 0 10px rgba(0,243,255,0.2);
                background: #000;
            ">`;
        } else {
            visualHtml = `<canvas id="tut-canvas" width="300" height="150" style="
                background: #050510; 
                border: 1px solid #00f3ff; 
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 0 10px rgba(0,243,255,0.2);
            "></canvas>`;
        }

        this.overlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #00f3ff;
                border-radius: 15px;
                padding: 30px;
                width: 90%;
                max-width: 450px;
                text-align: center;
                box-shadow: 0 0 30px rgba(0,243,255,0.5);
                display: flex; flex-direction: column; align-items: center;
            ">
                ${visualHtml}
                
                <h2 style="color: #00f3ff; margin: 0 0 15px 0; font-size: 24px;">${step.title}</h2>
                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.5; margin: 0 0 25px 0; white-space: pre-line; min-height: 50px;">
                    ${step.message}
                </p>
                
                <div style="color: #888; margin-bottom: 20px; font-size: 14px;">
                    Step ${this.currentStep + 1} of ${this.steps.length}
                </div>
                
                <div style="display: flex; gap: 10px; width: 100%; justify-content: center;">
                    ${this.currentStep > 0 ? '<button id="tut-prev" style="padding: 10px 20px; background: #444; border: none; color: #fff; border-radius: 5px; cursor: pointer;">Back</button>' : ''}
                    <button id="tut-next" style="padding: 10px 30px; background: #00f3ff; border: none; color: #000; border-radius: 5px; cursor: pointer; font-weight: bold; box-shadow: 0 0 10px rgba(0,243,255,0.5);">
                        ${this.currentStep === this.steps.length - 1 ? 'Play!' : 'Next'}
                    </button>
                    ${this.currentStep < this.steps.length - 1 ? '<button id="tut-skip" style="padding: 10px 20px; background: transparent; border: 1px solid #ff3333; color: #ff3333; border-radius: 5px; cursor: pointer;">Skip</button>' : ''}
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Only draw if not using an image
        if (!step.image) {
            setTimeout(() => {
                this.drawVisual(step.visual);
            }, 10);
        }

        setTimeout(() => {
            const nextBtn = document.getElementById('tut-next');
            const skipBtn = document.getElementById('tut-skip');
            const prevBtn = document.getElementById('tut-prev');

            if (nextBtn) nextBtn.onclick = () => {
                if (this.currentStep < this.steps.length - 1) {
                    this.currentStep++;
                    this.show();
                } else this.complete();
            };

            if (skipBtn) skipBtn.onclick = () => this.complete();
            if (prevBtn) prevBtn.onclick = () => { this.currentStep--; this.show(); };
        }, 10);
    }

    drawVisual(type) {
        const canvas = document.getElementById('tut-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Helper: Draw Grid Background (Exact match to Game)
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
        for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

        const size = 32; // cellSize * 0.8 (40 * 0.8)

        const drawDirection = (cx, cy, dir, len, color) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            // Standard directions
            if (dir === DIRECTIONS.RIGHT) { ctx.moveTo(cx, cy); ctx.lineTo(cx + len, cy); }
            else if (dir === DIRECTIONS.DOWN) { ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + len); }
            else if (dir === DIRECTIONS.UP_RIGHT) { ctx.moveTo(cx, cy); ctx.lineTo(cx + len * 0.7, cy - len * 0.7); }
            else if (dir === DIRECTIONS.DOWN_RIGHT) { ctx.moveTo(cx, cy); ctx.lineTo(cx + len * 0.7, cy + len * 0.7); }

            ctx.stroke();
        };

        const drawCell = (x, y, type, rotation = 0, locked = false) => {
            const cx = x;
            const cy = y;
            const cellSize = 40;

            ctx.save();
            ctx.translate(cx, cy);

            if (type === 'WALL') {
                // Neon Wall (Exact)
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f3ff';
                ctx.strokeStyle = '#00f3ff';
                ctx.lineWidth = 2;
                ctx.strokeRect(-size / 2, -size / 2, size, size);

                // Inner
                ctx.shadowBlur = 0;
                ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
                ctx.fillRect(-size / 2, -size / 2, size, size);

                // Cross
                ctx.beginPath();
                ctx.moveTo(-size / 4, -size / 4); ctx.lineTo(size / 4, size / 4);
                ctx.moveTo(size / 4, -size / 4); ctx.lineTo(-size / 4, size / 4);
                ctx.stroke();

            } else if (type === 'EMITTER') {
                ctx.fillStyle = '#00f3ff';
                ctx.beginPath(); ctx.arc(0, 0, size / 3, 0, Math.PI * 2); ctx.fill();
                drawDirection(0, 0, DIRECTIONS.RIGHT, size / 2, '#00f3ff');

            } else if (type === 'EMITTER_DIAGONAL') {
                ctx.fillStyle = '#00f3ff';
                ctx.beginPath(); ctx.arc(0, 0, size / 3, 0, Math.PI * 2); ctx.fill();
                // Dark Blue Center
                ctx.fillStyle = '#00008b';
                ctx.fillRect(-size / 8, -size / 8, size / 4, size / 4);
                drawDirection(0, 0, DIRECTIONS.DOWN_RIGHT, size / 2, '#00008b');

            } else if (type === 'EMITTER_OMNI') {
                ctx.fillStyle = '#00f3ff';
                ctx.beginPath(); ctx.arc(0, 0, size / 3, 0, Math.PI * 2); ctx.fill();
                // Royal Blue Center Circle
                ctx.fillStyle = '#ff0055ff';
                ctx.beginPath(); ctx.arc(0, 0, size / 6, 0, Math.PI * 2); ctx.fill();
                // 3 directions for demo
                drawDirection(0, 0, DIRECTIONS.RIGHT, size / 2, '#4169e1');
                drawDirection(0, 0, DIRECTIONS.UP_RIGHT, size / 2, '#4169e1');
                drawDirection(0, 0, DIRECTIONS.DOWN_RIGHT, size / 2, '#4169e1');

            } else if (type === 'RECEIVER') {
                ctx.strokeStyle = '#00ff9d';
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(0, 0, size / 3, 0, Math.PI * 2); ctx.stroke();

            } else if (type === 'M1') { // Triangle
                let hue = '#ff00ff';
                let fillHue = 'rgba(255, 0, 255, 0.3)';

                ctx.rotate(rotation * Math.PI / 180);

                ctx.fillStyle = fillHue;
                ctx.strokeStyle = hue;
                ctx.lineWidth = 2;

                // Triangle pointing TR (Simulated)
                ctx.beginPath();
                ctx.moveTo(-size / 2, size / 2); // BL
                ctx.lineTo(size / 2, -size / 2); // TR
                ctx.lineTo(-size / 2, -size / 2); // TL (Solid back)
                ctx.closePath();
                ctx.fill();

                // Reflective face
                ctx.beginPath();
                ctx.moveTo(-size / 2, size / 2);
                ctx.lineTo(size / 2, -size / 2);
                ctx.stroke();

            } else if (type === 'M2') { // Line
                ctx.strokeStyle = '#ff00ff';
                ctx.lineWidth = 3;
                ctx.rotate(rotation * Math.PI / 180);
                ctx.beginPath(); ctx.moveTo(0, -size / 2); ctx.lineTo(0, size / 2); ctx.stroke();

            } else if (type === 'M3') { // Octagon
                ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                ctx.strokeStyle = '#ff00ff';
                ctx.lineWidth = 2;

                ctx.beginPath();
                const r = size / 2.5;
                for (let i = 0; i < 8; i++) {
                    const ang = (i * 45) * Math.PI / 180;
                    ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
                }
                ctx.closePath();
                ctx.fill(); ctx.stroke();

            } else if (type === 'M4') { // Square
                ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                ctx.strokeStyle = '#ff00ff';
                ctx.lineWidth = 2;
                ctx.fillRect(-size / 2.5, -size / 2.5, size / 1.25, size / 1.25);
                ctx.strokeRect(-size / 2.5, -size / 2.5, size / 1.25, size / 1.25);

            } else if (type === 'M5') { // Omni
                ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                ctx.strokeStyle = '#ff00ff';
                ctx.lineWidth = 2;

                // Circle
                ctx.beginPath(); ctx.arc(0, 0, size / 2.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                // Star
                ctx.beginPath();
                ctx.moveTo(-size / 3, 0); ctx.lineTo(size / 3, 0);
                ctx.moveTo(0, -size / 3); ctx.lineTo(0, size / 3);
                ctx.moveTo(-size / 4, -size / 4); ctx.lineTo(size / 4, size / 4);
                ctx.moveTo(size / 4, -size / 4); ctx.lineTo(-size / 4, size / 4);
                ctx.stroke();
            }
            ctx.restore();
        };

        if (type === 'welcome') {
            // Scene
            drawCell(150, 75, 'EMITTER');
            ctx.font = 'bold 30px Segoe UI';
            ctx.fillStyle = '#00f3ff';
            ctx.textAlign = 'center';
            ctx.shadowBlur = 10; ctx.shadowColor = '#00f3ff';
            ctx.fillText("LASER PUZZLE", w / 2, h / 2 + 40);
            ctx.shadowBlur = 0;

            // Decorative Beams
            ctx.strokeStyle = '#00f3ff'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(150, 75); ctx.lineTo(300, 75); ctx.stroke();
        }
        else if (type === 'goal') {
            // Emitter -> Mirror -> Receiver
            drawCell(50, 75, 'EMITTER');
            drawCell(150, 75, 'M1', 0); // Triangle
            drawCell(150, 25, 'RECEIVER'); // Receiver

            // Laser
            ctx.strokeStyle = '#00ff9d'; // Green success beam
            ctx.lineWidth = 3;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ff9d';
            ctx.beginPath();
            ctx.moveTo(50, 75);
            ctx.lineTo(150, 75); // Hit mirror
            ctx.lineTo(150, 25); // Hit receiver
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Glow on receiver
            ctx.fillStyle = 'rgba(0, 255, 157, 0.5)';
            ctx.beginPath(); ctx.arc(150, 25, 15, 0, Math.PI * 2); ctx.fill();
        }
        else if (type === 'placing') {
            // Draw Inventory Bar mockup at bottom
            ctx.fillStyle = '#222';
            ctx.fillRect(80, 110, 140, 40);
            ctx.strokeStyle = '#444'; ctx.strokeRect(80, 110, 140, 40);

            // Selected item
            ctx.fillStyle = '#333'; ctx.fillRect(90, 115, 30, 30);
            ctx.strokeStyle = '#00f3ff'; ctx.lineWidth = 2; ctx.strokeRect(90, 115, 30, 30);
            drawCell(105, 130, 'M1', 0); // Icon in inventory

            // Grid cell
            ctx.strokeStyle = '#00f3ff'; ctx.lineWidth = 2; ctx.strokeRect(130, 55, 40, 40); // Hover effect
            drawCell(150, 75, 'M1', 0); // Placed mirror

            // Cursor arrow
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.moveTo(160, 85); ctx.lineTo(160, 100); ctx.lineTo(170, 95); ctx.fill();

            // Dotted line from inventory to grid
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(105, 115); ctx.lineTo(140, 85); ctx.stroke(); ctx.setLineDash([]);
        }
        else if (type === 'walls') {
            drawCell(80, 75, 'WALL');
            drawCell(150, 75, 'WALL');
            drawCell(220, 75, 'WALL');

            // Blocked Laser
            ctx.strokeStyle = '#ff3333';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 75); ctx.lineTo(65, 75); ctx.stroke();
            // X mark
            ctx.strokeStyle = '#ff3333';
            ctx.beginPath(); ctx.moveTo(60, 70); ctx.lineTo(70, 80); ctx.moveTo(70, 70); ctx.lineTo(60, 80); ctx.stroke();
        }
        else if (type === 'emitters') {
            drawCell(60, 75, 'EMITTER');
            drawCell(150, 75, 'EMITTER_DIAGONAL');
            drawCell(240, 75, 'EMITTER_OMNI');
        }
        else if (type === 'mirrors_basic') {
            drawCell(100, 75, 'M1', 0);
            ctx.fillStyle = '#fff'; ctx.font = '14px Arial'; ctx.textAlign = 'center';
            ctx.fillText('M1', 100, 110);

            drawCell(200, 75, 'M2', 45);
            ctx.fillText('M2', 200, 110);
        }
        else if (type === 'mirrors_adv') {
            drawCell(60, 75, 'M3');
            ctx.fillStyle = '#fff'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
            ctx.fillText('M3', 60, 110);

            drawCell(150, 75, 'M4');
            ctx.fillText('M4', 150, 110);

            drawCell(240, 75, 'M5');
            ctx.fillText('M5', 240, 110);
        }
        else if (type === 'controls') {
            // Updated Controls Visual - Better Buttons
            const drawBtn = (x, y, label, color) => {
                ctx.fillStyle = '#222';
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(x, y, 90, 40, 5);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = color;
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(label, x + 45, y + 25);
            };

            drawBtn(105, 20, 'Remove', '#ff3333');
            ctx.fillStyle = '#888'; ctx.font = '12px Arial'; ctx.textAlign = 'left';
            ctx.fillText('→ Click mirror to delete', 105, 75);

            drawBtn(20, 90, 'Undo', '#ebb434');
            drawBtn(190, 90, 'Reset', '#00f3ff');
        }
        else if (type === 'finish') {
            drawCell(150, 75, 'RECEIVER');
            // Green check
            ctx.font = '40px Arial';
            ctx.fillStyle = '#00ff9d';
            ctx.textAlign = 'center';
            ctx.fillText("✓", 150, 85);

            // Confetti
            for (let i = 0; i < 30; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#00f3ff' : '#00ff9d';
                const x = Math.random() * w;
                const y = Math.random() * h;
                ctx.fillRect(x, y, 4, 4);
            }
        }
    }

    complete() {
        localStorage.setItem('tutorialCompleted', 'true');
        if (this.overlay) this.overlay.remove();

        // No popup, just clean exit per user request
    }

    reset() {
        localStorage.removeItem('tutorialCompleted');
    }
}
