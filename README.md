# skedgy

Periodically check for and queue work to be done!

[![Build Status](https://img.shields.io/travis/JimmyBoh/skedgy/master.svg?style=flat-square)](https://travis-ci.org/JimmyBoh/skedgy)
[![Code Coverage](https://img.shields.io/coveralls/JimmyBoh/skedgy/master.svg?style=flat-square)](https://coveralls.io/github/JimmyBoh/skedgy?branch=master)
[![Dependencies](https://img.shields.io/david/JimmyBoh/skedgy.svg?style=flat-square)](https://david-dm.org/JimmyBoh/skedgy)
[![DevDependencies](https://img.shields.io/david/dev/JimmyBoh/skedgy.svg?style=flat-square)](https://david-dm.org/JimmyBoh/skedgy?type=dev)
[![npm](https://img.shields.io/npm/v/skedgy.svg?style=flat-square)](https://www.npmjs.com/package/skedgy)
[![Monthly Downloads](https://img.shields.io/npm/dm/skedgy.svg?style=flat-square)](https://www.npmjs.com/package/skedgy)
[![Total Downloads](https://img.shields.io/npm/dt/skedgy.svg?style=flat-square)](https://www.npmjs.com/package/skedgy)

Skedgy (pronounced "ske-gee") is an opinionated scheduling library for NodeJS. The purpose of skedgy is to periodically check for work with a random delay between each check, as well as queue and execute tasks with a random delay between each execution. The goal was to create a scheduler that acts naturally, not with exact timing that can be tracked. Tasks are always run one at a time and never retried.

## Example:

```ts
import { Scheduler } from 'skedgy';

// Create a limited set of random 'response' data...
const responses = Array(10).fill(0).map((x) => Math.random().toString(36).substr(2, 10));

// Pretend this is a much cooler check...
async function someExternalRequest(): Promise<string> {
  await randomDelay(3000);
  return responses.pop();
}

// Pretend this is a much cooler action...
async function processData(text: string) {
  await randomDelay(3000);
  console.log(text.toUpperCase());
  await randomDelay(1000);
}

class ExampleScheduler extends Scheduler<string> {
  
  protected async poll(): Promise<void> {
    let result = await someExternalRequest();
    this.enqueue(result);
  }
  
  protected async work(item: string): Promise<void> {
    await processData(item);
  }
}

const sched = new ExampleScheduler({
  pollMinDelay: 3000,
  pollMaxDelay: 8000,
  taskMinDelay: 3000,
  taskMaxDelay: 5000
});

// Start the scheduler...
sched.start();

setTimeout(() => {
    // Force stop after 60s...
    sched.stop();
    process.exit(0);
}, 60 * 1000);

function randomDelay(delay: number) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * delay));
}

```

## Features:
 - Simple to use API.
 - Built on Promises!
 - Randomly vary the interval between polling.
 - Throttle the work functions with a random range (so it's not predictable).
 - Persists work to super simple, overridable queue (defaults to in-mem queue).
 
## Contribute
 
 0. Fork it
 1. `npm i`
 2. `npm run watch`
 3. Make changes and **write tests**.
 4. Send pull request! :sunglasses:
 
## License:
 
MIT
