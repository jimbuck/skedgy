
import { Options, PromiseQueue } from './lib/models';
import { Worker } from './lib/worker';
import { Poller } from './lib/poller';
import { MemQueue } from './lib/queue';
import { Repeater } from './utils/repeater';
import { logger, IDebugger } from './utils/logger';

const log = logger('core');

export class Skedgy<T> {

  public get nextPoll(): number {
    if (!this._poller.nextEvent) return null;

    let next = (this._poller.nextEvent.valueOf() - Date.now()) / 1000;

    return next < 0 ? 0 : next;
  }

  public get nextWork(): number {
    if (!this._worker.nextEvent) return null;

    let next = (this._worker.nextEvent.valueOf() - Date.now()) / 1000;

    return next < 0 ? 0 : next;
  }

  private _options: Options<T>;

  private _db: PromiseQueue<T>;
  private _worker: Worker<T>;  
  private _poller: Repeater;

  constructor(options: Options<T>) {
    this._options = Object.assign({
      pollMinDelay: 300,  // Five minutes
      pollMaxDelay: 300,  // No variance
      taskMinDelay: 0,    // No delay
      taskMaxDelay: 0,    // No delay
      db: new MemQueue()
    }, options);

    this._db = this._options.db;

    this._worker = new Worker<T>({
      minDelay: this._options.taskMinDelay,
      maxDelay: this._options.taskMaxDelay,
      db: this._options.db,
      work: this._options.task.bind(null)
    });

    this._poller = new Poller<T>({
      minDelay: this._options.pollMinDelay,
      maxDelay: this._options.pollMaxDelay,
      poll: this._options.poll,
      enqueue: this._enqueue.bind(this)
    });
  }

  public start(): void {
    log('Starting...');
    this._worker.start();
    this._poller.start();
    log('Started!');
  }

  public stop(): void {
    log('Stopping...');
    this._worker && this._worker.stop();
    this._poller && this._poller.stop();
    log('Stopped!');
  }

  private async _enqueue(data: T): Promise<void> {
    await this._db.enqueue(data);
    this._worker.start();
  }
}