
import { Repeater } from '../utils/repeater';
import { logger } from '../utils/logger';

const log = logger('poller');

export class Poller<T> extends Repeater {
    
  constructor(options: {
    minDelay?: number,
    maxDelay?: number,
    poll: (enqueue: (data: T) => void) => Promise<void>,
    enqueue: (data: T) => Promise<void>
  }) {
    super({
      minDelay: options.minDelay,
      maxDelay: options.maxDelay,
      cb: async () => {
        log('Polling...');
        const pendingQueues: Array<Promise<void>> = [];
        await options.poll(data => {
          log('Enqueueing work...')
          pendingQueues.push(options.enqueue(data));
        });

        await Promise.all(pendingQueues);
        log('Polled!');
      },
      log
    });
  }
}