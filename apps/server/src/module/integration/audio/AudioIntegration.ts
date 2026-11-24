import { sseBroadcaster } from "../sse/SseBroadcaster";

export type AudioPlayOptions = {
  source: string;
  volume?: number;
  loop?: boolean;
};

export class AudioIntegration {
  async play(opts: AudioPlayOptions): Promise<void> {
    sseBroadcaster.broadcast("audio:play", opts);
  }

  async stop(): Promise<void> {
    sseBroadcaster.broadcast("audio:stop", {});
  }

  async setVolume(volume: number): Promise<void> {
    sseBroadcaster.broadcast("audio:setVolume", { volume });
  }
}

export const audioIntegration = new AudioIntegration();
