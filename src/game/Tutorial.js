export class Tutorial {
    constructor(game) {
        this.game = game;
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;

        this.steps = [
            {
                title: "Welcome to Laser Puzzle! 🎮",
                message: "Guide laser beams to their targets using mirrors!",
                highlight: null,
                position: "center"
            },
            {
                title: "The Goal 🎯",
                message: "Make all green receivers glow by directing lasers into them. When all receivers are lit, you win!",
                highlight: ".receiver-example",
                position: "center"
            },
            {
                title: "Laser Emitters 💡",
                message: "Cyan circles shoot laser beams. They come in 3 types:\n• Standard (4 directions)\n• Diagonal (diagonal only)\n• Omni (8 directions)",
                highlight: null,
                position: "center"
            },
            {
                title: "Your Inventory 📦",
                message: "These numbers show how many mirrors you have. Use them wisely!",
                highlight: "#controls",
                position: "bottom"
            },
            {
                title: "M1 - Triangle Mirror 🔺",
                message: "Reflects lasers at 90° angles. Click to place, click again to rotate counter-clockwise.",
                highlight: "#select-m1",
                position: "bottom"
            },
            {
                title: "M2 - Line Mirror ➗",
                message: "Simple diagonal reflector. Two rotation states: / or \\",
                highlight: "#select-m2",
                position: "bottom"
            },
            {
                title: "M3 - Octagon Mirror 🔷",
                message: "Converts straight beams into diagonal directions. Unlocks at Level 34!",
                highlight: "#select-m3",
                position: "bottom"
            },
            {
                title: "M4 - Square Mirror ⬜",
                message: "Converts diagonal beams into straight directions. Unlocks at Level 42!",
                highlight: "#select-m4",
                position: "bottom"
            },
            {
                title: "M5 - Omni Mirror ⭐",
                message: "The ultimate mirror! Redirects ANY beam to ANY of 8 directions. Unlocks at Level 50!",
                highlight: "#select-m5",
                position: "bottom"
            },
            {
                title: "Placing Mirrors 🎯",
                message: "1. Click a mirror type in your inventory\n2. Click an empty cell to place it\n3. Click the mirror again to rotate it",
                highlight: null,
                position: "center"
            },
            {
                title: "Fixed Mirrors 🔒",
                message: "Red mirrors = Cannot rotate\nYellow mirrors = Can rotate\nThese are part of the puzzle!",
                highlight: null,
                position: "center"
            },
            {
                title: "Remove Button ❌",
                message: "Made a mistake? Click 'Remove', then click any mirror you placed to take it back!",
                highlight: "#remove-btn",
                position: "top"
            },
            {
                title: "Undo Button ↩️",
                message: "Undo your last 50 moves. Experiment freely!",
                highlight: "#undo-btn",
                position: "top"
            },
            {
                title: "Reset Button 🔄",
                message: "Start the level over from scratch.",
                highlight: "#reset-btn",
                position: "top"
            },
            {
                title: "Walls 🧱",
                message: "Cyan squares block lasers. Plan your path around them!",
                highlight: null,
                position: "center"
            },
            {
                title: "Ready to Play! 🚀",
                message: "You're all set! Start with Level 1 and work your way up. Good luck!",
                highlight: null,
                position: "center"
            }
        ];
    }

    start() {
        if (localStorage.getItem('tutorialCompleted') === 'true') {
            return; // Don't show tutorial if already completed
        }

        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.showStep(0);
    }

    createOverlay() {
        // Create dark overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorial-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.id = 'tutorial-tooltip';
        this.tooltip.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00f3ff;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            box-shadow: 0 0 30px rgba(0, 243, 255, 0.5);
            color: #e0e0e0;
            font-family: 'Segoe UI', sans-serif;
            position: relative;
        `;

        this.overlay.appendChild(this.tooltip);
        document.body.appendChild(this.overlay);
    }

    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;

        // Clear previous highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        // Highlight element if specified
        if (step.highlight) {
            const element = document.querySelector(step.highlight);
            if (element) {
                element.classList.add('tutorial-highlight');
                element.style.position = 'relative';
                element.style.zIndex = '10000';
            }
        }

        // Update tooltip content
        this.tooltip.innerHTML = `
            <div style="text-align: center;">
                <h2 style="color: #00f3ff; margin: 0 0 15px 0; font-size: 24px; text-shadow: 0 0 10px #00f3ff;">
                    ${step.title}
                </h2>
                <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; white-space: pre-line;">
                    ${step.message}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #888; font-size: 14px;">
                        Step ${stepIndex + 1} of ${this.steps.length}
                    </span>
                    <div style="display: flex; gap: 10px;">
                        ${stepIndex > 0 ? `
                            <button id="tutorial-prev-btn" style="
                                background: transparent;
                                border: 1px solid #888;
                                color: #888;
                                padding: 8px 16px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 14px;
                                transition: all 0.2s;
                            ">Previous</button>
                        ` : ''}
                        <button id="tutorial-next-btn" style="
                            background: #00f3ff;
                            border: none;
                            color: #000;
                            padding: 8px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.2s;
                            box-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
                        ">${stepIndex === this.steps.length - 1 ? 'Start Playing!' : 'Next'}</button>
                        <button id="tutorial-skip-btn" style="
                            background: transparent;
                            border: 1px solid #ff3333;
                            color: #ff3333;
                            padding: 8px 16px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                            transition: all 0.2s;
                        ">Skip Tutorial</button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners AFTER innerHTML is set
        const nextBtn = document.getElementById('tutorial-next-btn');
        const skipBtn = document.getElementById('tutorial-skip-btn');
        const prevBtn = document.getElementById('tutorial-prev-btn');

        if (nextBtn) {
            nextBtn.onclick = () => this.next();
            nextBtn.onmouseenter = function () {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.8)';
            };
            nextBtn.onmouseleave = function () {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.5)';
            };
        }

        if (skipBtn) {
            skipBtn.onclick = () => this.skip();
            skipBtn.onmouseenter = function () {
                this.style.background = 'rgba(255, 51, 51, 0.1)';
            };
            skipBtn.onmouseleave = function () {
                this.style.background = 'transparent';
            };
        }

        if (prevBtn) {
            prevBtn.onclick = () => this.previous();
            prevBtn.onmouseenter = function () {
                this.style.background = 'rgba(136, 136, 136, 0.1)';
            };
            prevBtn.onmouseleave = function () {
                this.style.background = 'transparent';
            };
        }
    }

    next() {
        console.log('Tutorial: Next clicked');
        this.showStep(this.currentStep + 1);
    }

    previous() {
        console.log('Tutorial: Previous clicked');
        this.showStep(this.currentStep - 1);
    }

    skip() {
        console.log('Tutorial: Skip clicked');
        this.complete();
    }

    complete() {
        localStorage.setItem('tutorialCompleted', 'true');
        this.isActive = false;

        // Remove overlay
        if (this.overlay) {
            this.overlay.remove();
        }

        // Remove highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
            el.style.zIndex = '';
        });

        // Show completion message
        this.showCompletionMessage();
    }

    showCompletionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00ff9d;
            border-radius: 15px;
            padding: 30px;
            z-index: 10001;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 157, 0.5);
            animation: fadeIn 0.3s ease-out;
        `;

        message.innerHTML = `
            <h2 style="color: #00ff9d; margin: 0 0 15px 0; font-size: 28px; text-shadow: 0 0 10px #00ff9d;">
                🎉 Tutorial Complete!
            </h2>
            <p style="color: #e0e0e0; font-size: 16px; margin: 0;">
                You're ready to solve puzzles!<br>Good luck! 🚀
            </p>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => message.remove(), 300);
        }, 2000);
    }

    reset() {
        localStorage.removeItem('tutorialCompleted');
    }
}
