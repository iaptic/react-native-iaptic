/**
 * Deduplicate processing of updates.
 * 
 * After hot reloads, the iap plugin sends multiple purchase updates or errors (on android).
 * 
 * This class will ensure the processing function is only called once per transaction / error code.
 * This is a workaround for the iap plugin bug.
 * 
 * To use it, provide the processing function and a function that returns a unique identifier for the data to process.
 */
export class DebouncedProcessor<T> {

  /** List of items to process */
  private needUpdate: T[] = [];

  /** Scheduled job that will process the items */
  private processingJob: ReturnType<typeof setTimeout> | null = null;

  /** The function that processes the items */
  private processFunction: (data: T) => void = () => { };

  /** The function that returns a unique identifier for the data to process */
  private idFunction: (data: T) => string = () => '';

  /**
   * Constructor
   * 
   * @param processFunction The function that processes the items
   * @param idFunction The function that returns a unique identifier for the data to process
   */
  constructor(processFunction: (data: T) => void, idFunction: (data: T) => string) {
    this.processFunction = processFunction;
    this.idFunction = idFunction;
  }

  /**
   * Add data to the list of items to process.
   * 
   * - Ensure the data is not already in the list.
   * - Schedule processing if it is not already scheduled.
   * 
   * @param data The data to process
   */
  add(data: T) {
    if (!this.needUpdate.some(existing => this.idFunction(existing) === this.idFunction(data))) {
      this.needUpdate.push(data);
      this.scheduleProcessing();
    }
  }

  private scheduleProcessing() {
    if (this.processingJob) return;
    this.processingJob = setTimeout(() => {
      this.processingJob = null;
      this.process();
    }, 300);
  }

  private process() {
    const list = this.needUpdate;
    this.needUpdate = [];
    for (let i = 0; i < list.length; i++) {
      this.processFunction(list[i]);
    }
  }

  /**
   * Clean up any pending timeouts and clear the update queue
   */
  cleanup() {
    if (this.processingJob) {
      clearTimeout(this.processingJob);
      this.processingJob = null;
    }
    this.needUpdate = [];
  }
}
