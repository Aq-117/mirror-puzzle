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
                } else if (cell.type === CELL_TYPES.MIRROR || cell.type === CELL_TYPES.MIRROR_LINE) {
                    // Line Mirror (M2)
                    this.ctx.strokeStyle = '#ff00ff';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    const half = size / 2;
                    if (cell.rotation === 0) {
                        this.ctx.moveTo(cx - half, cy + half);
                        this.ctx.lineTo(cx + half, cy - half);
                    } else {
                        this.ctx.moveTo(cx - half, cy - half);
                        this.ctx.lineTo(cx + half, cy + half);
                    }
                    this.ctx.stroke();
                } else if (cell.type === CELL_TYPES.MIRROR_TRIANGLE) {
                    // Triangle Mirror (M1)
                    this.ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                    this.ctx.strokeStyle = '#ff00ff';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();

                    const half = size / 2;
                    const rot = cell.rotation % 4;

                    // Draw right-angled triangle based on rotation
                    // 0: / (Bottom-Left solid) -> Points: Top-Left, Bottom-Right, Bottom-Left
                    // 1: \ (Top-Left solid) -> Points: Top-Right, Bottom-Left, Top-Left
                    // 2: / (Top-Right solid) -> Points: Bottom-Right, Top-Left, Top-Right
                    // 3: \ (Bottom-Right solid) -> Points: Bottom-Left, Top-Right, Bottom-Right

                    // Actually, let's simplify. The hypotenuse is the reflective face.
                    // 0: / (Reflects Right->Up). Hypotenuse from (x-h, y+h) to (x+h, y-h). Solid corner is (x-h, y+h)?? No.
                    // Let's visualize:
                    // / means line from BL to TR.
                    // If rot 0 (Reflects Right->Up), then the mirror faces Bottom-Right. The solid part is Top-Left?
                    // Wait, logic in LaserSystem:
                    // rot 0: / (Reflects Right->Up). 
                    // Ray Right->Up hits the "bottom" or "right" side of the slash?
                    // A ray moving RIGHT hits the / and goes UP. It hits the "bottom-left" side of the line.
                    // So the reflective face is facing Bottom-Left.
                    // The solid block should be Top-Right?
                    // Let's verify LaserSystem logic again.
                    // rot 0: if RIGHT -> UP. Ray comes from left, moving right. Hits / . Goes Up. 
                    // This implies the mirror is facing Left/Bottom.
                    // So the triangle should fill the Top-Right corner?
                    // If Top-Right is filled, then a ray from Left hits the hypotenuse and reflects.
                    // A ray from Right (moving Left) hits the vertical/horizontal legs and is blocked?
                    // LaserSystem: rot 0: if DOWN -> LEFT. Ray comes from top, moving down. Hits /. Goes Left.
                    // So yes, the reflective face is the Bottom-Left face.
                    // The solid part is the Top-Right triangle.

                    if (rot === 0) { // Solid Top-Right
                        this.ctx.moveTo(cx - half, cy + half); // BL
                        this.ctx.lineTo(cx + half, cy - half); // TR
                        this.ctx.lineTo(cx + half, cy + half); // BR - Wait, Top-Right is solid?
                        // If Top-Right is solid, points are: Top-Left, Top-Right, Bottom-Right?
                        // No, triangle is half-square.
                        // Hypotenuse is BL to TR.
                        // Top-Right triangle is (BL, TR, BR)? No that's Bottom-Right.
                        // Top-Right triangle is (TL, TR, BR)? No.
                        // Points: (TL, TR, BL)? No.
                        // Points: (cx-h, cy+h) is BL. (cx+h, cy-h) is TR.
                        // If we want Top-Right solid, we connect BL->TR->BR->BL? No that's Bottom-Right.
                        // BL->TR->TL->BL? That's Top-Left.

                        // Let's stick to the visual representation of the wall.
                        // rot 0: Reflective face is BL. So we draw a line BL->TR.
                        // We want to show it's a triangle.
                        // If we fill the "back" of the mirror.
                        // Back is Top-Right.
                        this.ctx.moveTo(cx - half, cy + half); // BL
                        this.ctx.lineTo(cx + half, cy - half); // TR
                        this.ctx.lineTo(cx + half, cy + half); // BR ?? No.
                        // Let's try:
                        // 0: / Reflective side is facing Bottom-Left. Back is Top-Right.
                        // Draw Triangle: (BL, TR, TR_Corner?) No.
                        // Square corners: TL(-h,-h), TR(h,-h), BR(h,h), BL(-h,h)
                        // Diagonal BL to TR.
                        // Top-Right Triangle: BL, TR, BR? No.
                        // Top-Right Triangle: TL, TR, BR? No.
                        // The two triangles are (TL, TR, BL) and (TR, BR, BL).
                        // (TL, TR, BL) is Top-Left.
                        // (TR, BR, BL) is Bottom-Right.

                        // Wait, my LaserSystem logic:
                        // rot 0: /
                        // RIGHT -> UP. (Incoming from Left). Hits hypotenuse.
                        // DOWN -> LEFT. (Incoming from Top). Hits hypotenuse.
                        // So the "open" side is Top-Left?
                        // If I come from Top (DOWN), I hit the mirror and go LEFT.
                        // So I am in the Top-Left quadrant?
                        // Yes.
                        // So the Top-Left is EMPTY. The Bottom-Right is SOLID.
                        // Let's re-read LaserSystem.
                        // rot 0: /
                        // if RIGHT (moving >) -> UP (^).
                        // Ray is at (x,y). Moving Right. Enters cell.
                        // Hits / line.
                        // If it reflects UP, it stays in (x,y)? No, next step it moves.
                        // Visual:
                        //  .|.
                        // -/
                        // If I come from Left (-), I hit / and go Up (|).
                        // So I am "outside" the triangle.
                        // The triangle is in the Bottom-Right.

                        // So for rot 0 (/), the solid triangle is Bottom-Right.
                        // Points: (cx-h, cy+h) BL, (cx+h, cy-h) TR, (cx+h, cy+h) BR.
                        this.ctx.moveTo(cx - half, cy + half); // BL
                        this.ctx.lineTo(cx + half, cy - half); // TR
                        this.ctx.lineTo(cx + half, cy + half); // BR
                        this.ctx.lineTo(cx - half, cy + half); // Back to BL
                    } else if (rot === 1) { // \ Reflects Right->Down. (Incoming from Left).
                        // Incoming Left -> Hits \ -> Goes Down.
                        // So Left-Bottom is open.
                        // Solid is Top-Right?
                        // Points: TL, BR, TR.
                        this.ctx.moveTo(cx - half, cy - half); // TL
                        this.ctx.lineTo(cx + half, cy + half); // BR
                        this.ctx.lineTo(cx + half, cy - half); // TR
                        this.ctx.lineTo(cx - half, cy - half); // Back to TL
                    } else if (rot === 2) { // / Reflects Left->Down. (Incoming from Right).
                        // Incoming Right -> Hits / -> Goes Down.
                        // So Right-Bottom is open.
                        // Solid is Top-Left.
                        // Points: BL, TR, TL.
                        this.ctx.moveTo(cx - half, cy + half); // BL
                        this.ctx.lineTo(cx + half, cy - half); // TR
                        this.ctx.lineTo(cx - half, cy - half); // TL
                        this.ctx.lineTo(cx - half, cy + half); // Back to BL
                    } else if (rot === 3) { // \ Reflects Left->Up. (Incoming from Right).
                        // Incoming Right -> Hits \ -> Goes Up.
                        // So Right-Top is open.
                        // Solid is Bottom-Left.
                        // Points: TL, BR, BL.
                        this.ctx.moveTo(cx - half, cy - half); // TL
                        this.ctx.lineTo(cx + half, cy + half); // BR
                        this.ctx.lineTo(cx - half, cy + half); // BL
                        this.ctx.lineTo(cx - half, cy - half); // Back to TL
                    }

                    this.ctx.fill();
                    this.ctx.stroke();

                    // Draw reflective face (hypotenuse) brighter
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = '#ffffff';
                    if (rot === 0 || rot === 2) {
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
        // Draw laser segments
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';

        laserSystem.segments.forEach(seg => {
            this.ctx.strokeStyle = seg.color || '#00f3ff';
            this.ctx.shadowColor = seg.color || '#00f3ff';
            this.ctx.shadowBlur = 10;

            this.ctx.beginPath();
            this.ctx.moveTo(
                this.offsetX + seg.x1 * this.cellSize,
                this.offsetY + seg.y1 * this.cellSize
            );
            this.ctx.lineTo(
                this.offsetX + seg.x2 * this.cellSize,
                this.offsetY + seg.y2 * this.cellSize
            );
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
