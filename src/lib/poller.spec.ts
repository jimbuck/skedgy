import { test } from 'ava';

import { Poller } from './poller';

test(`Poller requires options`, t => {
  const GenericPoller = Poller as any;
  t.throws(() => new GenericPoller());

  const poller = new Poller({
    minDelay: 4,
    maxDelay: 8,
    poll: async () => { }
  });
});
