import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventBus } from "./EventBus";

describe("EventBus", () => {
  let bus: EventBus<string, { foo: string }>;

  beforeEach(() => {
    bus = new EventBus<string, { foo: string }>();
  });

  it("should call subscribed handler on emit", async () => {
    const handler = vi.fn();
    bus.subscribe("test.event", handler);
    await bus.emit("test.event", { foo: "bar" });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("test.event", { foo: "bar" });
  });

  it("should call handler only once with once()", async () => {
    const handler = vi.fn();
    bus.once("test.event", handler);
    await bus.emit("test.event", { foo: "bar" });
    await bus.emit("test.event", { foo: "bar" });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should isolate errors: failing handler does not stop others", async () => {
    const handler1 = vi.fn(() => {
      throw new Error("boom");
    });
    const handler2 = vi.fn();
    bus.subscribe("test.event", handler1);
    bus.subscribe("test.event", handler2);
    await bus.emit("test.event", { foo: "bar" });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it("should respect priority ordering", async () => {
    const order: string[] = [];
    bus.subscribe("test.event", async () => { order.push("low"); }, { priority: 0 });
    bus.subscribe("test.event", async () => { order.push("high"); }, { priority: 10 });
    bus.subscribe("test.event", async () => { order.push("mid"); }, { priority: 5 });
    await bus.emit("test.event", { foo: "bar" });
    expect(order).toEqual(["high", "mid", "low"]);
  });

  it("should unsubscribe handler", async () => {
    const handler = vi.fn();
    const id = bus.subscribe("test.event", handler);
    bus.unsubscribe(id);
    await bus.emit("test.event", { foo: "bar" });
    expect(handler).toHaveBeenCalledTimes(0);
  });

  it("should report listener count", async () => {
    const h1 = vi.fn();
    const h2 = vi.fn();
    bus.subscribe("test.event", h1);
    bus.subscribe("test.event", h2);
    expect(bus.listenerCount("test.event")).toBe(2);
    bus.unsubscribe(((bus as any).exactListeners.get("test.event") as any[])[0].id);
    expect(bus.listenerCount("test.event")).toBe(1);
  });

  it("should support RegExp pattern matching", async () => {
    const handler = vi.fn();
    bus.subscribe(/^combat\./, handler);
    await bus.emit("combat.started" as any, { foo: "bar" });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
