import { Howl } from 'howler';

class AudioService {
  private music: Howl | null = null;
  private engine: Howl | null = null;
  private sfx: Record<string, Howl> = {};

  init() {
    this.music = new Howl({
      src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'],
      loop: true,
      volume: 0.3,
      html5: true
    });

    this.engine = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-engine-loop-2539.mp3'],
      loop: true,
      volume: 0.1,
      rate: 1.0
    });

    this.sfx = {
      boost: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-fast-rocket-whoosh-1714.mp3'], volume: 0.5 }),
      crash: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-hard-metal-hit-2228.mp3'], volume: 0.6 }),
      purchase: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-magic-marimba-notification-212.mp3'], volume: 0.4 }),
      button: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'], volume: 0.3 })
    };
  }

  playMusic() {
    if (!this.music?.playing()) this.music?.play();
  }

  stopMusic() {
    this.music?.stop();
  }

  updateEngine(speed: number, maxSpeed: number) {
    if (!this.engine) return;
    if (!this.engine.playing()) this.engine.play();
    
    // Pitch up as speed increases
    const rate = 0.5 + (speed / maxSpeed) * 1.5;
    this.engine.rate(rate);
    this.engine.volume(0.05 + (speed / maxSpeed) * 0.15);
  }

  playSfx(key: string) {
    this.sfx[key]?.play();
  }

  setMusicVolume(v: number) {
    this.music?.volume(v);
  }

  setSfxVolume(v: number) {
    Object.values(this.sfx).forEach(h => h.volume(v));
    this.engine?.volume(v * 0.2);
  }
}

export const audioService = new AudioService();
