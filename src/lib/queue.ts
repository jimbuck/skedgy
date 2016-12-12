
import { PromiseQueue } from './models';

export class MemQueue<T> implements PromiseQueue<T> {

  private _queue: Array<T>;

  constructor(items?: Array<T>) {
    this._queue = items || [];
  }

  public async peek(): Promise<T> {
    return this._queue[0];
  }

  public async enqueue(item: T): Promise<void> {
    this._queue.push(item);
  }

  public async dequeue(): Promise<T> {
    return this._queue.shift();
  }
}