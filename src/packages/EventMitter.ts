import mitt from "mitt";
import type { Emitter, Handler } from "mitt";

type EventPayload = unknown;
type EventMap = Record<string, EventPayload>;

/**
 * 实例级事件总线。
 *
 * 每个组件实例持有自己的 emitter，避免不同实例之间互相串事件。
 */
export default class EventMitter {
  private readonly emitter: Emitter<EventMap> = mitt<EventMap>();

  /**
   * 订阅事件。
   */
  on(eventName: string, callback: Handler<EventPayload>): this {
    this.emitter.on(eventName, callback);
    return this;
  }

  /**
   * 取消订阅事件。
   */
  off(eventName: string, callback: Handler<EventPayload>): this {
    this.emitter.off(eventName, callback);
    return this;
  }

  /**
   * 只订阅一次，触发后自动取消。
   */
  once(eventName: string, callback: Handler<EventPayload>): this {
    const wrapper: Handler<EventPayload> = (payload) => {
      this.off(eventName, wrapper);
      callback(payload);
    };
    return this.on(eventName, wrapper);
  }

  /**
   * 触发事件。
   */
  emit(eventName: string, data?: EventPayload): this {
    this.emitter.emit(eventName, data);
    return this;
  }

  /**
   * 清空当前实例的所有订阅。
   */
  clear(): this {
    this.emitter.all.clear();
    return this;
  }
}
