type EventHandler<T extends string = string, P = unknown> = (
  event: T,
  payload: P,
) => void | Promise<void>;

interface ListenerEntry<T extends string, P> {
  id: string;
  handler: EventHandler<T, P>;
  once: boolean;
  priority: number;
}

export class EventBus<T extends string = string, P = unknown> {
  private exactListeners = new Map<string, ListenerEntry<T, P>[]>();
  private patternListeners = new Map<RegExp, ListenerEntry<T, P>[]>();
  private counter = 0;

  subscribe(
    event: T | RegExp,
    handler: EventHandler<T, P>,
    options: { once?: boolean; priority?: number } = {},
  ): string {
    const id = `listener-${++this.counter}`;
    const entry: ListenerEntry<T, P> = {
      id,
      handler,
      once: options.once ?? false,
      priority: options.priority ?? 0,
    };

    if (event instanceof RegExp) {
      const bucket = this.patternListeners.get(event) ?? [];
      bucket.push(entry);
      bucket.sort((a, b) => b.priority - a.priority);
      this.patternListeners.set(event, bucket);
    } else {
      const key = String(event);
      const bucket = this.exactListeners.get(key) ?? [];
      bucket.push(entry);
      bucket.sort((a, b) => b.priority - a.priority);
      this.exactListeners.set(key, bucket);
    }

    return id;
  }

  unsubscribe(listenerId: string): boolean {
    for (const bucket of this.exactListeners.values()) {
      const idx = bucket.findIndex((l) => l.id === listenerId);
      if (idx !== -1) {
        bucket.splice(idx, 1);
        return true;
      }
    }
    for (const bucket of this.patternListeners.values()) {
      const idx = bucket.findIndex((l) => l.id === listenerId);
      if (idx !== -1) {
        bucket.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  once(event: T | RegExp, handler: EventHandler<T, P>, priority?: number): string {
    return this.subscribe(event, handler, { once: true, priority });
  }

  removeAllListeners(event?: T | RegExp): void {
    if (event === undefined) {
      this.exactListeners.clear();
      this.patternListeners.clear();
      return;
    }
    if (event instanceof RegExp) {
      this.patternListeners.delete(event);
    } else {
      this.exactListeners.delete(String(event));
    }
  }

  listenerCount(event: T | RegExp): number {
    if (event instanceof RegExp) {
      return (this.patternListeners.get(event) ?? []).length;
    }
    return (this.exactListeners.get(String(event)) ?? []).length;
  }

  async emit(event: T, payload: P): Promise<void> {
    const exact = this.exactListeners.get(String(event)) ?? [];
    const pattern: ListenerEntry<T, P>[] = [];
    for (const [re, bucket] of this.patternListeners) {
      if (re.test(String(event))) {
        pattern.push(...bucket);
      }
    }

    const all = [...exact, ...pattern].sort((a, b) => b.priority - a.priority);

    const toRemove: string[] = [];
    const results: Promise<void>[] = [];

    for (const listener of all) {
      if (listener.once) {
        toRemove.push(listener.id);
      }
      try {
        const result = listener.handler(event, payload);
        if (result instanceof Promise) {
          results.push(
            result.catch((err) => {
              console.error(
                `[EventBus] Handler "${listener.id}" for event "${String(event)}" threw:`,
                err,
              );
            }),
          );
        }
      } catch (err) {
        console.error(
          `[EventBus] Handler "${listener.id}" for event "${String(event)}" threw:`,
          err,
        );
      }
    }

    for (const id of toRemove) {
      this.unsubscribe(id);
    }

    await Promise.all(results);
  }

  getListeners(event: T | RegExp): ListenerEntry<T, P>[] {
    if (event instanceof RegExp) {
      return [...(this.patternListeners.get(event) ?? [])];
    }
    return [...(this.exactListeners.get(String(event)) ?? [])];
  }

  setMaxListeners(_limit: number): void {
    // kept for API compatibility; no hard limit enforced
  }
}
