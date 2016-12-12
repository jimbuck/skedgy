import { test } from 'ava';

import { Poller } from './poller';
import { MemQueue } from './queue';

test(`Poller requires options`, t => {
  const GenericPoller = Poller as any;
  t.throws(() => new GenericPoller());

  const poller = new Poller<number>({
    minDelay: 4,
    maxDelay: 8,
    enqueue: async (data: number) => { },
    poll: async (enqueue) => { }
  });
});

test(`Poller allows multiple 'enqueue' calls`, async t => {
  let enqueueCount = 0;
  const poller = new Poller<number>({
    minDelay: 4,
    maxDelay: 8,
    enqueue: async (data: number) => {
      enqueueCount++;
    },
    poll: async (enqueue) => {
      enqueue(2);
      enqueue(4);
      enqueue(6);
    }
  });

  poller.start();

  await delay(1000);

  t.is(enqueueCount, 3);
});

function delay(time: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  })
}