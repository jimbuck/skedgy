import { test } from 'ava';

import { Repeater } from './repeater';

class TestRepeater extends Repeater {

  protected async act(): Promise<void> { }

  protected async onError(err: Error): Promise<void> { }
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

test(`Repeater does not start if already running.`, t => {
  const repeater = new TestRepeater({
    maxDelay: 7000,

    // If it logs then that means it is running...
    log: (() => t.fail()) as any
  });
  repeater['_running'] = true;

  repeater.start();

  t.pass();
});

test(`Repeater#nextEvent provides the date of the next fire`, async (t) => {
  const delayTime = 10000;
  const repeater = new TestRepeater({
    minDelay: delayTime,
    maxDelay: delayTime
  });

  repeater.start();

  // Use setTimeout so that it gets called after the setImmediate within Repeater#start.  
  await setTimeoutAsync(0);

  let diff = repeater.nextEvent.valueOf() - Date.now();
  let err = Math.abs(diff - delayTime) / delayTime;

  t.true(err < 0.01);
});

test(`Repeater errors don't stop future triggers`, async (t) => {
  const delayTime = 1000;
  const repeater = new TestRepeater({
    minDelay: delayTime,
    maxDelay: delayTime
  });

  let actCount = 0;
  let errCount = 0;
  repeater['act'] = async () => {
    actCount++;
    throw 'Fake Error 1';
  };
  repeater['onError'] = async () => {
    errCount++;
    throw 'Fake Error 2';
  };

  repeater.start();

  await setTimeoutAsync(2100);

  t.true(actCount > 1);
  t.is(actCount, errCount);
});

function setTimeoutAsync(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}