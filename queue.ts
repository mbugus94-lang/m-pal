import fs from 'fs/promises';
import path from 'path';
import PQueue from 'p-queue';

const QUEUE_FILE = path.join(process.cwd(), 'afripay-queue.json');

export interface QueuedTask {
  id: string;
  timestamp: number;
  provider: string;
  amount: number;
  phone: string;
  reference: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  retries: number;
}

interface QueueItem {
  type: string;
  data: any;
  attempts?: number;
}

export class OfflineQueue {
  private queue = new PQueue({ concurrency: 1 });
  private pending: QueuedTask[] = [];
  private items: QueueItem[] = [];

  async load() {
    try {
      const data = await fs.readFile(QUEUE_FILE, 'utf8');
      this.pending = JSON.parse(data);
    } catch {
      this.pending = [];
    }
  }

  private async save() {
    await fs.writeFile(QUEUE_FILE, JSON.stringify(this.pending, null, 2));
  }

  // Test-compatible API methods
  size(): number {
    return this.items.length;
  }

  add(item: QueueItem): void {
    this.items.push({ ...item, attempts: 0 });
  }

  async process(handler: (item: QueueItem) => Promise<{ success: boolean }>): Promise<void> {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      let success = false;
      
      while (!success && (item.attempts || 0) < 3) {
        item.attempts = (item.attempts || 0) + 1;
        const result = await handler(item);
        success = result.success;
      }
    }
    // Clear processed items
    this.items = [];
  }

  serialize(): string {
    return JSON.stringify({ items: this.items });
  }

  static deserialize(state: string): OfflineQueue {
    const queue = new OfflineQueue();
    try {
      const parsed = JSON.parse(state);
      if (parsed.items && Array.isArray(parsed.items)) {
        queue.items = parsed.items;
      }
    } catch {
      // Ignore parse errors
    }
    return queue;
  }

  // Original API methods
  async enqueue(task: () => Promise<any>, metadata: QueuedTask) {
    await this.load();
    this.pending.push(metadata);
    await this.save();

    return this.queue.add(async () => {
      try {
        metadata.status = 'processing';
        await this.save();
        
        await task();
        
        metadata.status = 'completed';
        this.pending = this.pending.filter(t => t.id !== metadata.id);
        await this.save();
      } catch (e) {
        metadata.retries = (metadata.retries || 0) + 1;
        metadata.error = String(e);
        metadata.status = 'failed';
        await this.save();
        console.error('❌ Queue task failed, will retry later:', e);
        throw e;
      }
    });
  }

  getPending(): QueuedTask[] {
    return this.pending.filter(t => t.status === 'pending');
  }

  getPendingCount(): number {
    return this.getPending().length;
  }

  async clear() {
    this.pending = [];
    await this.save();
  }
}
