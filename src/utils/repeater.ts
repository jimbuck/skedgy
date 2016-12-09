import { logger, IDebugger } from '../utils/logger';
import { guid } from './guid';

export class Repeater {
  
  public get nextEvent(): Date { return this._nextEvent; }

  protected _running: boolean;
  
  private _timer: NodeJS.Timer;
  private _nextEvent: Date;

  private _minDelay: number;
  private _maxDelay: number;
  private _cb: () => Promise<void>;
  private _log: IDebugger;

  constructor(options: { minDelay: number, maxDelay: number, cb: () => Promise<void>, log?: IDebugger }) {
    this._log = options.log || logger('repeater');
    if (!options.maxDelay) {
      let msg = `Repeater requires 'maxDelay'!`;
      this._log(msg);
      throw new Error(msg);
    }

    this._minDelay = options.minDelay || 0;
    this._maxDelay = options.maxDelay;
    this._cb = options.cb;
  }

  public start(): void {
    if (this._running) {
      return;
    }

    this._running = true;
    this._log(`Starting...`);

    setImmediate(async () => {
      await this._cb();
      this._step();
    });
  }

  public stop(): void {
    if (!this._running) return;
  
    this._running = false;
    this._log(`Stopping...`);
    clearTimeout(this._timer);
    this._timer = null;
    this._nextEvent = null;
  }

  private _step(): void {
    if (!this._running) return;

    this._idleThen(async () => {
      await this._cb();
      this._step();
    });
  }

  private _idleThen(cb: () => void): void {
    let diff = this._maxDelay - this._minDelay;
    let idle = 1000 * (Math.floor(Math.random() * diff) + this._minDelay);

    this._nextEvent = new Date(Date.now() + idle);
    this._timer = setTimeout(cb.bind(this) as () => void, idle);
  }
}