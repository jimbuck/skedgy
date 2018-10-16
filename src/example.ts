import { Scheduler } from './';

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