import { API_BASE } from "../../../api/base";

type AudioPlayOptions = {
  source: string;
  volume?: number;
  loop?: boolean;
};

class AudioServiceClient {
  private audio = new Audio();
  private eventSource: EventSource | null = null;
  private connected = false;

  constructor() {
    this.audio.preload = "auto";
  }

  async play(opts: AudioPlayOptions): Promise<void> {
    this.audio.loop = !!opts.loop;
    this.audio.volume = Math.max(0, Math.min(1, opts.volume ?? 1));
    this.audio.src = opts.source;
    try {
      await this.audio.play();
    } catch (err) {
      console.error("[Audio] Playback failed:", err);
    }
  }

  async stop(): Promise<void> {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  async setVolume(volume: number): Promise<void> {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  connectSSE(onMessage: (event: string, data: unknown) => void): void {
    if (this.connected) return;
    const url = `${API_BASE}/automation/stream`;
    this.eventSource = new EventSource(url);
    this.eventSource.onopen = () => {
      this.connected = true;
      console.log("[Audio] SSE connected");
    };
    this.eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        onMessage("message", data);
      } catch {
        // ignore
      }
    };
    this.eventSource.addEventListener("audio:play", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as AudioPlayOptions;
        void this.play(data);
      } catch {
        // ignore
      }
    });
    this.eventSource.addEventListener("audio:stop", () => {
      void this.stop();
    });
    this.eventSource.addEventListener("audio:setVolume", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { volume: number };
        void this.setVolume(data.volume);
      } catch {
        // ignore
      }
    });
    this.eventSource.onerror = () => {
      this.connected = false;
      this.eventSource?.close();
      this.eventSource = null;
      // retry after 3s
      setTimeout(() => {
        if (!this.connected) this.connectSSE(onMessage);
      }, 3000);
    };
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.connected = false;
  }
}

export const audioClient = new AudioServiceClient();
