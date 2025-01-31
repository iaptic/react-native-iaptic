import { IapticEventType, IapticEventMap, IapticEventListener } from '../types';
import { logger } from './IapticLogger';

export type IapticRegisteredEventListener = {
  type: IapticEventType;
  callback: Function;
  context: string;
  remove: () => void;
};

/**
 * Manages event listeners for Iaptic events
 * 
 * @internal
 */
export class IapticEvents {

  private eventListeners: IapticRegisteredEventListener[] = [];

  /**
   * Add an event listener
   */
  addEventListener<T extends IapticEventType>(eventType: T, listener: IapticEventListener<T>, context: string): IapticRegisteredEventListener {
    logger.debug(`adding event listener ${context}:${eventType}`);
    const _that = this;
    const obj = {
      type: eventType,
      callback: listener,
      context: context,
      remove: () => _that.removeEventListener(eventType, listener)
    };
    this.eventListeners.push(obj);
    return obj;
  }

  /**
   * Remove an event listener
   */
  removeEventListener<T extends IapticEventType>(eventType: T, listener: IapticEventListener<T>): void {
    this.eventListeners = this.eventListeners.filter(wrapper => wrapper.type !== eventType || wrapper.callback !== listener);
  }

  /**
   * Remove all event listeners for a specific event type.
   * 
   * If no event type is specified, removes all listeners for all events
   */
  removeAllEventListeners(eventType?: IapticEventType): void {
    if (eventType) {
      this.eventListeners = this.eventListeners.filter(wrapper => wrapper.type !== eventType);
    } else {
      this.eventListeners = [];
    }
  }

  /**
   * Emit an event to all registered listeners
   */
  public emit<T extends IapticEventType>(eventType: T, ...args: IapticEventMap[T]): void {
    logger.debug(`emitting event ${eventType} with args: ${JSON.stringify(args)} for ${this.eventListeners.filter(l => l.type === eventType).length} listeners`);
    // setTimeout is used to ensure that the event listeners are called after the event has been fully processed
    this.eventListeners.forEach((obj, index) => {
      try {
        if (obj.type === eventType) {
          obj.callback(...args);
        }
      } catch (error) {
        logger.error(`Error in ${obj.context}:${eventType} listener: ${error}`);
      }
    });
  }
} 
