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

export class OfflineQueue {
  private queue = new PQueue({ concurrency: 1 });
  private pending: QueuedTask[] = [];

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
