import { test } from 'ava';

import { Skedgy, Options, PromiseQueue } from './';

test(`Skedgy requires options`, t => {
  const GenericSkedgy = Skedgy as any;
  t.throws(() => new GenericSkedgy());
});

test(`Skedgy requires a 'poll' function`, t => {
  t.throws(() => new Skedgy({
    poll: null,
    work: async () => { }
  }));
});

test(`Skedgy requires a 'work' function`, t => {

  t.throws(() => new Skedgy({
    poll: async () => { },
    work: null
  }));
});

test(`Skedgy#start begins both services`, t => {
  const skedgy = new Skedgy({
    poll: async () => { },
    work: async () => { }
  });

  let pollerStartedCount = 0;
  let workerStartedCount = 0;

  skedgy['_poller'] = {
    start: () => pollerStartedCount++
  } as any;  
  skedgy['_worker'] = {
    start: () => workerStartedCount++
  } as any;

  skedgy.start();

  t.is(pollerStartedCount, 1);
  t.is(workerStartedCount, 1);
});

test('Skedgy#stop ends both services', t => {
  const skedgy = new Skedgy({
    poll: async () => { },
    work: async () => { }
  });

  let pollerStoppedCount = 0;
  let workerStoppedCount = 0;

  skedgy['_poller'] = {
    stop: () => pollerStoppedCount++
  } as any;  
  skedgy['_worker'] = {
    stop: () => workerStoppedCount++
  } as any;

  skedgy.stop();

  t.is(pollerStoppedCount, 1);
  t.is(workerStoppedCount, 1);
});

test.cb(`Skedgy#nextPoll returns seconds until next poll call`, t => {
  const pollDelay = 10;
  const skedgy = new Skedgy({
    pollMinDelay: pollDelay,
    pollMaxDelay: pollDelay,  
    poll: async () => { },
    work: async () => { }
  });

  skedgy.start();
    
  setTimeout(() => {
      let err = (skedgy.nextPoll - pollDelay) / pollDelay;
      t.true(err < 0.01);
      t.end();
  }, 0);
});

test.cb(`Skedgy#nextWork returns seconds until next poll call`, t => {
  const workDelay = 10;
  const skedgy = new Skedgy({
    pollMinDelay: 5,
    pollMaxDelay: 5,
    taskMinDelay: workDelay,
    taskMaxDelay: workDelay,
    poll: async () => { },
    work: async () => { }
  });

  skedgy.start();
    
  setTimeout(() => {
      let err = (skedgy.nextWork - workDelay) / workDelay;
      t.true(err < 0.01);
      t.end();
  }, 0);
});