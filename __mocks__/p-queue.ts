// Mock implementation of p-queue for Jest tests
export default class PQueue {
  private concurrency: number;
  private queue: Array<() => Promise<any>> = [];
  private running = 0;

  constructor(options: { concurrency?: number } = {}) {
    this.concurrency = options.concurrency || 1;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        this.running++;
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processNext();
        }
      };

      if (this.running < this.concurrency) {
        task();
      } else {
        this.queue.push(task);
      }
    });
  }

  private processNext() {
    if (this.queue.length > 0 && this.running < this.concurrency) {
      const next = this.queue.shift();
      next?.();
    }
  }

  get size() {
    return this.queue.length;
  }

  get pending() {
    return this.running;
  }

  clear() {
    this.queue = [];
  }
}
