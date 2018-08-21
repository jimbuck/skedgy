
import { AsyncQueue } from './models';
import { Repeater } from '../utils/repeater';
import { logger } from '../utils/logger';

const log = logger('worker');

export class Worker<T> extends Repeater {  
  constructor(options: {
    minDelay?: number,
    maxDelay?: number,
    db: AsyncQueue<T>,
    work: (item: T) => Promise<void>
  }) {
    super({
      minDelay: options.minDelay,
      maxDelay: options.maxDelay || 0,
      cb: async () => {
        log('Checking work...');
        let item = await options.db.peek();

        if (!item) {
          log('Work not found!');
          return this.stop();
        }

        log('Doing work...');
        await options.work(item);

        await options.db.dequeue();
        log('Finished work!');
      },
      log
    });
  }
}