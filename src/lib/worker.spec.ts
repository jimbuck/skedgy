import { test } from 'ava';

import { Worker } from './worker';
import { MemQueue } from './queue';

test(`Worker requires options`, t => {
  const GenericWorker = Worker as any;
  t.throws(() => new GenericWorker());

  const worker = new Worker({
    minDelay: 4,
    maxDelay: 8,
    db: new MemQueue(),
    work: async (item) => { }
  });
});

test.cb(`Worker stops if there is no work`, (t) => {
  const worker = new Worker({
    minDelay: 0,
    maxDelay: 0,
    db: new MemQueue(),
    work: async (item) => {
      t.fail();
    }
  });
  const realStop = worker.stop
  worker.stop = () => {
    t.pass();
    t.end();

    realStop.call(worker);
  }

  worker.start();
});

test.cb(`Worker dequeues after work is complete`, (t) => {
  const q = new MemQueue([2]);
  const worker = new Worker({
    minDelay: 0,
    maxDelay: 0,
    db: q,
    work: async (item) => {
      // Do nothing...
    }
  });

  const realStop = worker.stop;  
  worker.stop = () => {
    t.is(q['_queue'].length, 0);
    t.end();

    realStop.call(worker);
  }

  worker.start();
});