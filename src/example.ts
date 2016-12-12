import { Skedgy } from './';

// Create a limited set of random "response" data...
const responses = Array(10).fill(0).map((x) => Math.random().toString(36).substr(2, 10));

// Pretend this is a much cooler action...
function someWebRequest(): Promise<string> {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(responses.pop()), 1000);
  });
}

// Pretend this is a more impressive action...
function transformData(): Promise<void>  {
  return new Promise<void>((resolve) => { 
    setTimeout(resolve, 2000);
  });
}

const sched = new Skedgy<string>({
    pollMinDelay: 5,
    pollMaxDelay: 5,
    taskMinDelay: 3,
    taskMaxDelay: 3,
    poll: async (enqueue) => {
        let tasks = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < tasks; i++) {
            if (responses.length === 0) break;

            let data = await someWebRequest();
            enqueue(data); // Adds the data to the work queue.
        }
    },
    task: async (item) => {
        await transformData();
    }
});

// Start the scheduler...
sched.start();

setTimeout(() => {
    // Force stop after 1m...
    sched.stop();
    process.exit(0);
}, 60 * 1000);