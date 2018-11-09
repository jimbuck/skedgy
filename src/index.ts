
import { Options, AsyncQueue } from './lib/models';
import { Worker } from './lib/worker';
import { Poller } from './lib/poller';
import { MemQueue } from './lib/queue';
import { logger } from './utils/logger';

const log = logger('core');

export { Options, AsyncQueue } from './lib/models';
export { MemQueue } from './lib/queue';

export abstract class Scheduler<T> {

  /**
   * The number of milliseconds until the the next poll is made.
   * 
   * @readonly
   */
  public get nextPoll(): number {
    if (!this._poller.nextEvent) return null;

    let next = this._poller.nextEvent.valueOf() - Date.now();

    return next < 0 ? 0 : next;
  }

  /**
   * The number of milliseconds until the the next task is started.
   * 
   * @readonly
   */
  public get nextWork(): number {
    if (!this._worker.nextEvent) return null;

    let next = this._worker.nextEvent.valueOf() - Date.now();

    return next < 0 ? 0 : next;
  }

  private _options: Options<T>;

  private _worker: Worker<T>;  
  private _poller: Poller;
  
  protected queue: AsyncQueue<T>;
  protected isStarted: boolean;

  constructor(options: Options<T>) {
    this._options = Object.assign({
      pollMinDelay: 300,  // Five minutes
      pollMaxDelay: 300,  // No variance
      workMinDelay: 0,    // No delay
      workMaxDelay: 0     // No delay
    }, options);

    this.queue = this._options.queue || new MemQueue();

    this._worker = new Worker<T>({
      minDelay: this._options.workMinDelay,
      maxDelay: this._options.workMaxDelay,
      db: this.queue,
      work: this.work.bind(this)
    });

    this._poller = new Poller({
      minDelay: this._options.pollMinDelay,
      maxDelay: this._options.pollMaxDelay,
      poll: this.poll.bind(this)
    });
  }

  /**
   * Starts the service (beings by polling for new work and begin any saved work).
   */
  public start(): void {
    if (this.isStarted) return;

    log('Starting...');
    this._worker.start();
    this._poller.start();
    this.isStarted = true;
    log('Started!');
  }
  
  /**
   * Stops the service (any in-progress work may be lost). 
   */
  public stop(): void {
    if (!this.isStarted) return;
    log('Stopping...');
    this._worker && this._worker.stop();
    this._poller && this._poller.stop();
    this.isStarted = false;
    log('Stopped!');
  }

  /**
   * Checks for new work, returning a promise to notify of completion.
   * 
   * @param {(data: T) => void} queue Method used to push data onto the work queue.
   * @returns {Promise<void>} A promise resolving when the poll is complete.
   */
  protected abstract poll(): Promise<void>;

  /**
   * Executes some work based on data from the queue.
   * 
   * @param {T} item The current item off of the queue.
   * @returns {Promise<void>}
   */
  protected abstract work(item: T): Promise<void>;

  /**
   * Adds a found item to the queue and starts the worker if it is not already running.
   * @param item The item to enqueue for work.
   */
  protected async enqueue(item: T) {
    this.queue.enqueue(item);
    setImmediate(() => this._worker.start('New work!'));
  }
}