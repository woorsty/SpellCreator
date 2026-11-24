export type HomeAssistantConfig = {
  baseUrl: string;
  token: string;
  webSocketEnabled?: boolean;
};

export class HomeAssistantService {
  private config: HomeAssistantConfig | null = null;
  private ws: WebSocket | null = null;
  private wsConnected = false;
  private wsMessageId = 1;
  private wsPending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private wsSubscribers = new Map<string, (data: unknown) => void>();
  private wsReconnectTimer: NodeJS.Timeout | null = null;

  configure(config: HomeAssistantConfig): void {
    this.config = config;
    if (config.webSocketEnabled) {
      void this.connectWebSocket();
    }
  }

  private get headers(): Record<string, string> {
    if (!this.config) throw new Error("Home Assistant not configured");
    return {
      Authorization: `Bearer ${this.config.token}`,
      "Content-Type": "application/json",
    };
  }

  private restUrl(path: string): string {
    if (!this.config) throw new Error("Home Assistant not configured");
    return `${this.config.baseUrl.replace(/\/$/, "")}/api/${path.replace(/^\//, "")}`;
  }

  async callService(
    domain: string,
    service: string,
    data: Record<string, unknown> = {},
  ): Promise<unknown> {
    const url = this.restUrl(`services/${domain}/${service}`);
    const res = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HA callService ${domain}.${service} failed: ${res.status} ${text}`);
    }
    try {
      return await res.json();
    } catch {
      return {};
    }
  }

  async getState(entityId: string): Promise<unknown> {
    const url = this.restUrl(`states/${entityId}`);
    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HA getState ${entityId} failed: ${res.status} ${text}`);
    }
    return res.json();
  }

  async getStates(): Promise<Record<string, unknown>> {
    const url = this.restUrl("states");
    const res = await fetch(url, { headers: this.headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HA getStates failed: ${res.status} ${text}`);
    }
    const states = await res.json() as Array<{ entity_id: string }>;
    const result: Record<string, unknown> = {};
    for (const s of states) {
      result[s.entity_id] = s;
    }
    return result;
  }

  isConfigured(): boolean {
    return !!this.config;
  }

  /* ---------------------------------------------------------------- *
   * WebSocket                                                          *
   * ---------------------------------------------------------------- */

  private async connectWebSocket(): Promise<void> {
    if (!this.config) return;
    const wsUrl = this.config.baseUrl
      .replace(/^http/, "ws")
      .replace(/\/$/, "") + "/api/websocket";
    try {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => {
        this.wsConnected = true;
        console.log("[HomeAssistant] WebSocket connected");
      };
      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(String(event.data)) as {
            id?: number;
            type?: string;
            success?: boolean;
            error?: unknown;
            result?: unknown;
            event?: unknown;
          };
          if (msg.id && this.wsPending.has(msg.id)) {
            const { resolve, reject } = this.wsPending.get(msg.id)!;
            this.wsPending.delete(msg.id);
            if (msg.success === false) {
              reject(new Error(JSON.stringify(msg.error)));
            } else {
              resolve(msg.result);
            }
          } else if (msg.type === "event") {
            const evt = msg.event as Record<string, unknown> | undefined;
            const sub = evt?.event_type as string | undefined;
            if (sub && this.wsSubscribers.has(sub)) {
              this.wsSubscribers.get(sub)!(msg.event);
            }
            // global wildcard
            this.wsSubscribers.forEach((cb) => cb(msg.event));
          }
        } catch {
          // ignore malformed WS messages
        }
      };
      this.ws.onerror = () => {
        this.wsConnected = false;
      };
      this.ws.onclose = () => {
        this.wsConnected = false;
        this.ws = null;
        // reconnect after 5s
        this.wsReconnectTimer = setTimeout(() => {
          void this.connectWebSocket();
        }, 5000).unref?.();
      };
      // wait for auth (HA sends auth_required first)
      await new Promise<void>((resolve) => {
        if (!this.ws) return resolve();
        const check = () => {
          if (this.wsConnected) return resolve();
          setTimeout(check, 50);
        };
        check();
      });
      // send auth
      await this.wsSend({ type: "auth", access_token: this.config.token });
    } catch (err) {
      console.error("[HomeAssistant] WebSocket connect error:", err);
      this.wsConnected = false;
      this.wsReconnectTimer = setTimeout(() => {
        void this.connectWebSocket();
      }, 5000).unref?.();
    }
  }

  private wsSend(payload: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("Home Assistant WebSocket not connected"));
        return;
      }
      const id = this.wsMessageId++;
      this.wsPending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, ...(payload as Record<string, unknown>) }));
    });
  }

  async subscribeEvents(
    eventType: string,
    callback: (data: unknown) => void,
  ): Promise<void> {
    if (!this.wsConnected || !this.ws) {
      throw new Error("Home Assistant WebSocket not connected");
    }
    this.wsSubscribers.set(eventType, callback);
    await this.wsSend({ type: "subscribe_events", event_type: eventType });
  }

  async unsubscribeEvents(eventType: string): Promise<void> {
    this.wsSubscribers.delete(eventType);
    if (this.ws) {
      await this.wsSend({ type: "unsubscribe_events", event_type: eventType });
    }
  }

  async callServiceWS(
    domain: string,
    service: string,
    data: Record<string, unknown> = {},
  ): Promise<unknown> {
    return this.wsSend({
      type: "call_service",
      domain,
      service,
      service_data: data,
    });
  }

  disconnect(): void {
    if (this.wsReconnectTimer) {
      clearTimeout(this.wsReconnectTimer);
      this.wsReconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.wsConnected = false;
  }
}

export const homeAssistantService = new HomeAssistantService();
