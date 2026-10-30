/**
 * OpenCV & Canvas Computer Vision Engine for Dota 2 Screen Monitoring
 * Provides live screen capture, HUD Region-of-Interest (ROI) segmentation,
 * edge detection filters, motion/activity difference, and voice callout speech synthesis.
 */

export interface HudRegions {
  minimap: { x: number; y: number; width: number; height: number };
  topClock: { x: number; y: number; width: number; height: number };
  heroHud: { x: number; y: number; width: number; height: number };
}

export type VisionFilter = 'normal' | 'edges' | 'threshold' | 'hud_boxes' | 'color_mask';

export class ComputerVisionEngine {
  private lastImageData: ImageData | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.getVoices();
          window.speechSynthesis.onvoiceschanged = () => {
            try {
              window.speechSynthesis.getVoices();
            } catch (_) {}
          };
        } catch (_) {}
      }

      const unlockAudio = () => {
        try {
          if (!this.audioContext) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) this.audioContext = new AudioCtx();
          }
          if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
          }
        } catch (_) {}
      };

      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }
  }

  /**
   * Request display capture stream from browser
   */
  async requestScreenStream(): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error('Captura de tela (Screen Capture API) não suportada neste navegador.');
    }

    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
        frameRate: { ideal: 30, max: 60 },
      } as any,
      audio: false,
    });
  }

  /**
   * Calculates standardized HUD bounding boxes based on video resolution
   * In standard 16:9 Dota 2 HUD:
   * - Minimap: Bottom Left (~23% width, ~28% height)
   * - Clock/Scoreboard: Top Center (~22% width, ~8% height)
   * - Hero Status/Inventory: Bottom Center (~36% width, ~18% height)
   */
  getHudRegions(width: number, height: number): HudRegions {
    return {
      minimap: {
        x: Math.round(width * 0.005),
        y: Math.round(height * 0.72),
        width: Math.round(width * 0.23),
        height: Math.round(height * 0.275),
      },
      topClock: {
        x: Math.round(width * 0.40),
        y: 0,
        width: Math.round(width * 0.20),
        height: Math.round(height * 0.08),
      },
      heroHud: {
        x: Math.round(width * 0.32),
        y: Math.round(height * 0.81),
        width: Math.round(width * 0.38),
        height: Math.round(height * 0.185),
      },
    };
  }

  /**
   * Draws a video frame to canvas and applies optional OpenCV computer vision filter
   */
  processFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    filter: VisionFilter = 'normal',
    showHudBoxes: boolean = true
  ): { base64: string; motionScore: number } {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { base64: '', motionScore: 0 };

    const width = canvas.width;
    const height = canvas.height;

    // Draw main video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Activity / Motion diff calculation
    let motionScore = 0;
    try {
      const currentData = ctx.getImageData(0, 0, width, height);
      if (this.lastImageData && this.lastImageData.data.length === currentData.data.length) {
        let diffPixels = 0;
        const total = currentData.data.length;
        // Sample every 16th pixel for high performance
        for (let i = 0; i < total; i += 16) {
          const rDiff = Math.abs(currentData.data[i] - this.lastImageData.data[i]);
          const gDiff = Math.abs(currentData.data[i + 1] - this.lastImageData.data[i + 1]);
          const bDiff = Math.abs(currentData.data[i + 2] - this.lastImageData.data[i + 2]);
          if (rDiff + gDiff + bDiff > 80) {
            diffPixels++;
          }
        }
        motionScore = Math.min(100, Math.round((diffPixels / (total / 16)) * 400));
      }
      this.lastImageData = currentData;

      // Apply Computer Vision Filters
      if (filter === 'edges') {
        this.applyEdgeFilter(ctx, width, height);
      } else if (filter === 'threshold') {
        this.applyThresholdFilter(ctx, width, height);
      } else if (filter === 'color_mask') {
        this.applyColorMask(ctx, width, height);
      }
    } catch (e) {
      // Ignore cross-origin image data restrictions if any
    }

    // Draw HUD Detection Overlay bounding boxes (OpenCV style)
    if (showHudBoxes) {
      const regions = this.getHudRegions(width, height);

      // Minimap Box (Cyan)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(regions.minimap.x, regions.minimap.y, regions.minimap.width, regions.minimap.height);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('ROI 1: MINIMAP & TRACKING', regions.minimap.x + 8, regions.minimap.y + 20);

      // Top Bar Clock Box (Amber)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(regions.topClock.x, regions.topClock.y, regions.topClock.width, regions.topClock.height);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('ROI 2: GAME CLOCK / SCORE', regions.topClock.x + 8, regions.topClock.y + 20);

      // Hero HUD & Inventory Box (Emerald)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(regions.heroHud.x, regions.heroHud.y, regions.heroHud.width, regions.heroHud.height);
      ctx.fillStyle = '#10b981';
      ctx.fillText('ROI 3: HP/MANA & INVENTÁRIO', regions.heroHud.x + 8, regions.heroHud.y + 20);
    }

    // Export frame as JPEG base64 for Gemini multimodal API
    const base64 = canvas.toDataURL('image/jpeg', 0.82);
    return { base64, motionScore };
  }

  /**
   * Sobel / Canny Edge Detection Filter (Canvas implementation)
   */
  private applyEdgeFilter(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const gray = new Uint8ClampedArray(width * height);

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
      gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    // Sobel operator
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const gx =
          -gray[idx - width - 1] +
          gray[idx - width + 1] -
          2 * gray[idx - 1] +
          2 * gray[idx + 1] -
          gray[idx + width - 1] +
          gray[idx + width + 1];

        const gy =
          -gray[idx - width - 1] -
          2 * gray[idx - width] -
          gray[idx - width + 1] +
          gray[idx + width - 1] +
          2 * gray[idx + width] +
          gray[idx + width + 1];

        const val = Math.min(255, Math.sqrt(gx * gx + gy * gy) * 1.8);
        const pixelIdx = idx * 4;
        data[pixelIdx] = val > 40 ? 0 : 15; // R
        data[pixelIdx + 1] = val > 40 ? 255 : 20; // G (Cyber green edges)
        data[pixelIdx + 2] = val > 40 ? 120 : 30; // B
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * Binary Thresholding Filter
   */
  private applyThresholdFilter(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const v = avg > 110 ? 240 : 15;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * Color segmentation: enhances HUD health greens, threat reds and objective golds
   */
  private applyColorMask(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Highlight greens (Health bar / allies)
      if (g > 100 && g > r * 1.3 && g > b * 1.3) {
        data[i] = 34;
        data[i + 1] = 197;
        data[i + 2] = 94;
      }
      // Highlight reds (Enemy heroes / danger)
      else if (r > 120 && r > g * 1.3 && r > b * 1.3) {
        data[i] = 239;
        data[i + 1] = 68;
        data[i + 2] = 68;
      }
      // Darken background slightly to emphasize features
      else {
        data[i] = Math.round(r * 0.45);
        data[i + 1] = Math.round(g * 0.45);
        data[i + 2] = Math.round(b * 0.45);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * Web Audio API synthesized audio ping (alarm for critical callouts)
   */
  playAlertTone(type: 'warning' | 'critical' | 'objective' | 'ping'): void {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
        }
      }
      if (!this.audioContext) return;

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      const now = this.audioContext.currentTime;

      if (type === 'critical') {
        // High urgency double beep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(440, now + 0.12);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'warning') {
        // Single alert chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        // Gentle objective / info blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.15); // B5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio playback can fail if user hasn't interacted with page yet
    }
  }

  /**
   * Text-to-Speech Voice Coach
   */
  speakCallout(
    text: string,
    options: {
      enabled: boolean;
      rate?: number;
      pitch?: number;
      volume?: number;
      lang?: string;
    }
  ): void {
    if (!options.enabled || !('speechSynthesis' in window)) return;
    if (!text || text.trim().length === 0) return;

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech so new urgent callout takes priority
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 1.1; // Slightly faster for game callouts
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = options.lang || 'pt-BR';

      // Pick preferred Brazilian Portuguese voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(
        (v) => v.lang.includes('pt-BR') || v.lang.includes('pt') || v.name.toLowerCase().includes('brazil')
      );
      if (ptVoice && utterance.lang.startsWith('pt')) {
        utterance.voice = ptVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }
}

export const cvEngine = new ComputerVisionEngine();
