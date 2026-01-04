export class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.masterGain.connect(this.ctx.destination);
        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);

        this.musicVolume = 0.5;
        this.sfxVolume = 0.5;

        this.musicGain.gain.value = this.musicVolume;
        this.sfxGain.gain.value = this.sfxVolume;

        // Music placeholder (Oscillator for now, or HTML Audio)
        // Using HTML Audio for easier looping and file management
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        // Ideally we load a file. For now, we'll leave it empty or user can provide one.
        // this.bgMusic.src = 'assets/music.mp3'; 
    }

    setMusicVolume(vol) {
        this.musicVolume = vol;
        this.musicGain.gain.value = vol;
        this.bgMusic.volume = vol;
    }

    setSoundVolume(vol) {
        this.sfxVolume = vol;
        this.sfxGain.gain.value = vol;
    }

    playMusic() {
        // Resume context if needed
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        // this.bgMusic.play().catch(e => console.log("Audio play failed", e));
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
        gain.connect(this.sfxGain); // Connect to SFX gain

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playMirrorRotate() {
        this.playTone(600, 'sine', 0.1);
    }

    playClick() {
        this.playTone(800, 'sine', 0.05);
    }

    playLaserHit() {
        // Skipped
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
