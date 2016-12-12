import { test } from 'ava';

import { Repeater } from './repeater';

test(`Repeater requires options`, t => {
  const GenericRepeater = Repeater as any;
  t.throws(() => new GenericRepeater());

  t.throws(() => new Repeater({
    maxDelay: null,
    cb: async () => { }
  }));
});

test(`Repeater defaults to 'minDelay' of zero`, t => {
  const repeater = new Repeater({
    maxDelay: 7,
    cb: async () => { }
  });

  t.is(repeater.minDelay, 0);
  t.is(repeater.maxDelay, 7);
});

test(`Repeater does not allow inverse min-max`, t => {
  t.throws(() => new Repeater({
    minDelay: 999,
    maxDelay: 1,
    cb: async () => { }
  }));
});

test.cb(`Repeater#nextEvent provides the date of the next fire`, t => {
  const delayTime = 10 * 1000;
  const repeater = new Repeater({
    minDelay: delayTime / 1000,
    maxDelay: delayTime / 1000,
    cb: async () => { }
  });

  repeater.start();

  // Use setTimeout so that it gets called after the setImmediate within Repeater#start.  
  setTimeout(() => {
    let diff = repeater.nextEvent.valueOf() - Date.now();
    let err = Math.abs(diff - delayTime) / delayTime;

    t.true(err < 0.01);
    t.end();
  }, 0);
});