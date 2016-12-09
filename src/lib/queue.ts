
import { PromiseQueue } from './models';

export class MemQueue<T> implements PromiseQueue<T> {

  private _queue: Array<T> = [];

  public async peek(): Promise<T> {
    return this._queue.length ? Object.assign({}, this._queue[0]) : null;
  }

  public async enqueue(item: T): Promise<void> {
    this._queue.push(item);
  }

  public async dequeue(): Promise<T> {
    return this._queue.shift();
  }
}