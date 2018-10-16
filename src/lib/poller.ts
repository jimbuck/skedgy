
import { Repeater } from '../utils/repeater';
import { logger } from '../utils/logger';

const log = logger('poller');

export class Poller extends Repeater {

  private _poll: () => Promise<void>;

  constructor(options: {
    minDelay?: number,
    maxDelay?: number,
    poll: () => Promise<void>,
  }) {
    super({
      minDelay: options.minDelay,
      maxDelay: options.maxDelay,
      log
    });
    this._poll = options.poll;
  }

  public async act() {
    log('Polling...');
    await this._poll();
    log('Polled!');
  }
}