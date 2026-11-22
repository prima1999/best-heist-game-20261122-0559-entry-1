// Sound for The Gilded Vault, synthesized live with WebAudio oscillators:
// no audio files, no network. A soft footstep tick, a coin chime, a grab
// arpeggio, a rising alarm while seen, and short win and caught phrases.
export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.alarmNodes = null;
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  tone(freq, seconds, type, gainValue, when) {
    if (this.muted || !this.ctx) return;
    const start = this.ctx.currentTime + (when || 0);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue || 0.08, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + seconds);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(start);
    osc.stop(start + seconds + 0.05);
  }

  coin() {
    this.tone(988, 0.12, 'sine', 0.07, 0);
    this.tone(1319, 0.16, 'sine', 0.07, 0.07);
  }

  grab() {
    this.tone(523, 0.14, 'triangle', 0.09, 0);
    this.tone(659, 0.14, 'triangle', 0.09, 0.09);
    this.tone(784, 0.22, 'triangle', 0.09, 0.18);
  }

  tool() {
    this.tone(330, 0.1, 'square', 0.04, 0);
    this.tone(220, 0.14, 'square', 0.04, 0.08);
  }

  win() {
    this.tone(523, 0.16, 'triangle', 0.09, 0);
    this.tone(659, 0.16, 'triangle', 0.09, 0.14);
    this.tone(784, 0.16, 'triangle', 0.09, 0.28);
    this.tone(1047, 0.34, 'triangle', 0.09, 0.42);
    this.tone(1319, 0.3, 'triangle', 0.07, 0.58);
  }

  caught() {
    this.tone(392, 0.2, 'sawtooth', 0.06, 0);
    this.tone(311, 0.2, 'sawtooth', 0.06, 0.16);
    this.tone(233, 0.44, 'sawtooth', 0.06, 0.32);
  }

  startAlarm() {
    if (this.muted || !this.ctx || this.alarmNodes) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(620, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(2.2, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    lfo.start();
    this.alarmNodes = { osc, gain, lfo };
  }

  stopAlarm() {
    if (!this.alarmNodes) return;
    try {
      this.alarmNodes.osc.stop();
      this.alarmNodes.lfo.stop();
    } catch {
      // Already stopped.
    }
    this.alarmNodes = null;
  }
}
