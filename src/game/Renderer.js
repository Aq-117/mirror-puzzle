import { CELL_TYPES, DIRECTIONS } from './Grid.js';

export class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.width = 0;
        this.height = 0;
        this.cellSize = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
    }

    calculateLayout(grid) {
        const aspect = this.width / this.height;
        const gridAspect = grid.width / grid.height;

        if (aspect > gridAspect) {
            this.cellSize = (this.height * 0.8) / grid.height;
        } else {
            this.cellSize = (this.width * 0.8) / grid.width;
        }

        this.offsetX = (this.width - grid.width * this.cellSize) / 2;
        this.offsetY = (this.height - grid.height * this.cellSize) / 2;

        grid.cellSize = this.cellSize; // Sync back to grid for input handling
    }

    draw(grid, laserSystem, particleSystem, emitters) {
        // Clear screen
        this.ctx.fillStyle = '#050510';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw Grid
        this.drawGrid(grid);

        // Draw Items
        this.drawItems(grid);

        // Draw External Emitters
        if (emitters) {
            this.drawExternalEmitters(emitters);
        }

        // Draw Lasers
        if (laserSystem) {
            this.drawLasers(laserSystem);
        }

        // Draw Particles
        if (particleSystem) {
            this.drawParticles(particleSystem);
        }
    }

    drawExternalEmitters(emitters) {
        emitters.forEach(emitter => {
            // Calculate position on border
            // If x = -1, draw left of grid
            const cx = this.offsetX + emitter.x * this.cellSize + this.cellSize / 2;
            const cy = this.offsetY + emitter.y * this.cellSize + this.cellSize / 2;
            const size = this.cellSize * 0.8;

            this.ctx.fillStyle = '#00f3ff';
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, size / 3, 0, Math.PI * 2);
            this.ctx.fill();
            // Direction indicator
            this.drawDirection(cx, cy, emitter.direction, size / 2, '#00f3ff');
        });
    }

    drawGrid(grid) {
        this.ctx.strokeStyle = '#1a1a2e';
        this.ctx.lineWidth = 1;

        for (let y = 0; y <= grid.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + y * this.cellSize);
            this.ctx.lineTo(this.offsetX + grid.width * this.cellSize, this.offsetY + y * this.cellSize);
            this.ctx.stroke();
        }

        for (let x = 0; x <= grid.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + x * this.cellSize, this.offsetY);
            this.ctx.lineTo(this.offsetX + x * this.cellSize, this.offsetY + grid.height * this.cellSize);
            this.ctx.stroke();
        }
    }

    drawItems(grid) {
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                const cell = grid.cells[y][x];
                const cx = this.offsetX + x * this.cellSize + this.cellSize / 2;
                const cy = this.offsetY + y * this.cellSize + this.cellSize / 2;
                const size = this.cellSize * 0.8;

                if (cell.type === CELL_TYPES.WALL) {
                    // Neon Wall
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = '#00f3ff';
                    this.ctx.strokeStyle = '#00f3ff';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);

                    // Inner detail
                    this.ctx.shadowBlur = 0;
                    this.ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
                    this.ctx.fillRect(cx - size / 2, cy - size / 2, size, size);

                    // Cross
                    this.ctx.beginPath();
                    this.ctx.moveTo(cx - size / 4, cy - size / 4);
                    this.ctx.lineTo(cx + size / 4, cy + size / 4);
                    this.ctx.moveTo(cx + size / 4, cy - size / 4);
                    this.ctx.lineTo(cx - size / 4, cy + size / 4);
                    this.ctx.stroke();

                } else if (cell.type === CELL_TYPES.EMITTER) {
                    this.ctx.fillStyle = '#00f3ff';
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, size / 3, 0, Math.PI * 2);
                    this.ctx.fill();
                    // Direction indicator
                    this.drawDirection(cx, cy, cell.direction, size / 2, '#00f3ff');
                } else if (cell.type === CELL_TYPES.RECEIVER) {
                    this.ctx.strokeStyle = '#00ff9d';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(cx, cy, size / 3, 0, Math.PI * 2);
                    this.ctx.stroke();
                } else if (cell.type === CELL_TYPES.MIRROR) {
                    this.ctx.strokeStyle = '#ff00ff';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    // Draw mirror line based on type/rotation
                    const half = size / 2;
                    if (cell.rotation === 0) {
                        this.ctx.moveTo(cx - half, cy + half);
                        this.ctx.lineTo(cx + half, cy - half);
                    } else {
                        this.ctx.moveTo(cx - half, cy - half);
                        this.ctx.lineTo(cx + half, cy + half);
                    }
                    this.ctx.stroke();
                }
            }
        }
    }

    drawDirection(x, y, dir, len, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        let dx = 0, dy = 0;
        if (dir === DIRECTIONS.UP) dy = -1;
        if (dir === DIRECTIONS.RIGHT) dx = 1;
        if (dir === DIRECTIONS.DOWN) dy = 1;
        if (dir === DIRECTIONS.LEFT) dx = -1;
        this.ctx.lineTo(x + dx * len, y + dy * len);
        this.ctx.stroke();
    }

    drawLasers(laserSystem) {
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';

        laserSystem.segments.forEach(seg => {
            const x1 = this.offsetX + seg.x1 * this.cellSize;
            const y1 = this.offsetY + seg.y1 * this.cellSize;
            const x2 = this.offsetX + seg.x2 * this.cellSize;
            const y2 = this.offsetY + seg.y2 * this.cellSize;

            // Glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ff0055';
            this.ctx.strokeStyle = '#ff0055';

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            // Inner core
            this.ctx.shadowBlur = 0;
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        });

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    drawParticles(particleSystem) {
        particleSystem.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;
    }
}
