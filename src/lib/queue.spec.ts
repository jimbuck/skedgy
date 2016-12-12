import { test } from 'ava';

import { MemQueue } from './queue';

test(`MemQueue accepts list of items`, t => {
  t.notThrows(() => new MemQueue());
  
  const q = new MemQueue([2, 4, 6]);
  t.deepEqual(q['_queue'], [2, 4, 6]);
});

test(`MemQueue#peek returns the first item without removing`, async t => {
  const q = new MemQueue([2, 4, 6]);
  t.deepEqual(q['_queue'], [2, 4, 6]);
  const peekedItem = await q.peek();
  t.is(peekedItem, 2);
  t.deepEqual(q['_queue'], [2, 4, 6]);
});

test(`MemQueue#dequeue returns the first item after removing`, async t => {
  const q = new MemQueue([2, 4, 6]);
  t.deepEqual(q['_queue'], [2, 4, 6]);
  const dequeuedItem = await q.dequeue();
  t.is(dequeuedItem, 2);
  t.deepEqual(q['_queue'], [4, 6]);
});

test(`MemQueue#enqueue adds a new item to the end of the list`, async t => {
  const q = new MemQueue([2, 4, 6]);
  t.deepEqual(q['_queue'], [2, 4, 6]);
  await q.enqueue(8);
  t.deepEqual(q['_queue'], [2, 4, 6, 8]);
});