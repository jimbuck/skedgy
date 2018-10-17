
import { AsyncQueue } from './models';
import { Repeater } from '../utils/repeater';
import { logger } from '../utils/logger';

const log = logger('worker');

export class Worker<T> extends Repeater {

  private _queue: AsyncQueue<T>;
  private _work: (item: T) => Promise<void>;

  constructor(options: {
    minDelay?: number,
    maxDelay?: number,
    db: AsyncQueue<T>,
    work: (item: T) => Promise<void>
  }) {
    super({
      minDelay: options.minDelay,
      maxDelay: options.maxDelay || 0,
      log
    });
    this._queue = options.db;
    this._work = options.work;
  }

  protected async act() {
    log('Checking for work...');
    let item = await this._queue.peek();

    if (!item) {
      log('No work found!');
      return this.stop();
    }

    log('Processing work...');
    await this._work(item);

    await this._queue.dequeue();
    log('Finished work!');
  }
}