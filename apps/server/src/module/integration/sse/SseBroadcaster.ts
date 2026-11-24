import type { ServerResponse } from "http";

type SSEClient = {
  res: ServerResponse;
  id: string;
  connectedAt: number;
};

export class SseBroadcaster {
  private clients = new Map<string, SSEClient>();
  private counter = 0;

  addClient(res: ServerResponse): string {
    const id = `sse-${++this.counter}`;
    const client: SSEClient = { res, id, connectedAt: Date.now() };

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.write(`: connected\n\n`);

    this.clients.set(id, client);

    res.on("close", () => this.clients.delete(id));
    res.on("error", () => this.clients.delete(id));

    return id;
  }

  removeClient(id: string): void {
    this.clients.delete(id);
  }

  getClientCount(): number {
    return this.clients.size;
  }

  broadcast(event: string, data: unknown): void {
    const payload = JSON.stringify(data);
    const message = `event: ${event}\ndata: ${payload}\n\n`;
    for (const client of this.clients.values()) {
      try {
        client.res.write(message);
      } catch {
        this.clients.delete(client.id);
      }
    }
  }

  broadcastToClient(clientId: string, event: string, data: unknown): void {
    const client = this.clients.get(clientId);
    if (!client) return;
    try {
      const payload = JSON.stringify(data);
      client.res.write(`event: ${event}\ndata: ${payload}\n\n`);
    } catch {
      this.clients.delete(clientId);
    }
  }
}

export const sseBroadcaster = new SseBroadcaster();
