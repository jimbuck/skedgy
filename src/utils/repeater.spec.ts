import { test } from 'ava';

import { Repeater } from './repeater';

class TestRepeater extends Repeater {
  
  protected async act(): Promise<void> { }
}

test(`Repeater requires options`, t => {
  t.throws(() => new (TestRepeater as any)());

  t.throws(() => new TestRepeater({
    maxDelay: null
  }));
});

test(`Repeater defaults to 'minDelay' of zero`, t => {
  const repeater = new TestRepeater({
    maxDelay: 7000
  });

  t.is(repeater.minDelay, 0);
  t.is(repeater.maxDelay, 7000);
});

test(`Repeater does not allow inverse min-max`, t => {
  t.throws(() => new TestRepeater({
    minDelay: 999,
    maxDelay: 1
  }));
});

test.cb(`Repeater#nextEvent provides the date of the next fire`, t => {
  const delayTime = 10000;
  const repeater = new TestRepeater({
    minDelay: delayTime,
    maxDelay: delayTime
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