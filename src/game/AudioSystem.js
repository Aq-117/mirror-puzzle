export class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Lower volume
        this.masterGain.connect(this.ctx.destination);
    }

    playTone(freq, type, duration) {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playMirrorRotate() {
        this.playTone(600, 'sine', 0.1);
    }

    playLaserHit() {
        // Low hum or zap?
        // Maybe just a very short high pitch for spark
        // But continuous laser hit might be annoying if triggered every frame.
        // We should only play it on impact or loop a hum.
        // For now, let's skip continuous hit sound to avoid noise.
    }

    playLevelComplete() {
        this.playTone(440, 'sine', 0.2);
        setTimeout(() => this.playTone(554, 'sine', 0.2), 200);
        setTimeout(() => this.playTone(659, 'sine', 0.4), 400);
    }

    playError() {
        this.playTone(150, 'sawtooth', 0.2);
    }
}
