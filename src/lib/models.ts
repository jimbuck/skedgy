/**
 * The available options used to configure skedgy.
 * 
 * @export
 * @interface Options
 * @template T
 */
export interface Options<T> {

  /**
   * The minimum number of milliseconds to wait before checking for new work.
   * 
   * @type {number}
   * @memberOf Options
   */
  pollMinDelay?: number;

  /**
   * The maximum number of milliseconds to the wait before checking for new work ().
   * 
   * @type {number}
   * @memberOf Options
   */
  pollMaxDelay?: number;

  /**
   * The minimum amount of time in milliseconds to delay between task completion and next task processing. 
   * 
   * @type {number}
   * @memberOf Options
   */
  taskMinDelay?: number;

  /**
   * The maximum amount of time in milliseconds to delay between task completion and next task processing. 
   * 
   * @type {number}
   * @memberOf Options
   */
  taskMaxDelay?: number;

  /**
   * FILO Queue used to store the data. Defaults to a simple in-memory queue.
   *
   * Required API:
   *  peek(): Promise<T>
   *  enqueue(item: T): Promise<T>
   *  dequeue(): Promise<T>
   * 
   * @type {AsyncQueue<T>}
   * @memberOf Options
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
   * 
   * @memberOf PromiseQueue
   */
  peek(): Promise<T>;
  
  /**
   * Adds the item to the end of the queue.
   * 
   * @param {T} item The item to be added.
   * @returns {Promise<void>} The enqueued item.
   * 
   * @memberOf PromiseQueue
   */
  enqueue(item: T): Promise<T>;

  /**
   * Removes the first item from the queue and returns the item.
   * 
   * @returns {Promise<T>}
   * 
   * @memberOf PromiseQueue
   */
  dequeue(): Promise<T>;
}