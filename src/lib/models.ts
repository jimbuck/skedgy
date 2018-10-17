/**
 * The available options used to configure skedgy.
 */
export interface Options<T> {

  /**
   * The minimum number of milliseconds to wait before checking for new work.
   */
  pollMinDelay?: number;

  /**
   * The maximum number of milliseconds to the wait before checking for new work ().
   */
  pollMaxDelay?: number;

  /**
   * The minimum amount of time in milliseconds to delay between completion and next processing. 
   */
  workMinDelay?: number;

  /**
   * The maximum amount of time in milliseconds to delay between completion and next processing.
   */
  workMaxDelay?: number;

  /**
   * FILO Queue used to store the data. Defaults to a simple in-memory queue.
   */
  queue?: AsyncQueue<T>;
}


/**
 * A simple queue implementation that relies on promises.
 * 
 * @export
 * @interface AsyncQueue
 * @template T
 */
export interface AsyncQueue<T> {
  
  /**
   * Returns the first item in the queue, without modifying the state of the queue.
   * 
   * @returns {Promise<T>}
   */
  peek(): Promise<T>;
  
  /**
   * Adds the item to the end of the queue.
   * 
   * @param {T} item The item to be added.
   * @returns {Promise<void>}
   */
  enqueue(item: T): Promise<void>;

  /**
   * Removes the first item from the queue and returns the item.
   * 
   * @returns {Promise<T>}
   */
  dequeue(): Promise<T>;
}