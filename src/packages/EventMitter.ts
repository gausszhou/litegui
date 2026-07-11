import mitt from "mitt";
import type { Handler } from "mitt";

const emitter = mitt();

export default class EventMitter {
  emit(event: string, data?: any) {
    emitter.emit(event, data);
  }
  on(eventName: string, callback: Handler) {
    emitter.on(eventName, callback);
  }
  off(eventName: string, callback: Handler) {
    emitter.off(eventName, callback);
  }
}
