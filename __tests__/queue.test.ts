import { OfflineQueue, QueuedTask } from '../queue';

describe('OfflineQueue', () => {
  let queue: OfflineQueue;

  beforeEach(() => {
    queue = new OfflineQueue();
  });

  describe('constructor', () => {
    it('should initialize with empty queue', () => {
      expect(queue).toBeDefined();
      expect(queue.getAll()).toEqual([]);
    });
  });

  describe('enqueue', () => {
    it('should add task to queue', async () => {
      const task: QueuedTask = {
        id: 'task-1',
        timestamp: Date.now(),
        provider: 'mpesa-ke',
        amount: 100,
        phone: '254712345678',
        reference: 'TEST-001',
        description: 'Test payment',
        status: 'pending',
        retries: 0,
      };

      const mockFn = jest.fn().mockResolvedValue({ success: true });
      await queue.enqueue(mockFn, task);

      const allTasks = queue.getAll();
      expect(allTasks.length).toBe(1);
      expect(allTasks[0].id).toBe('task-1');
    });
  });

  describe('getAll', () => {
    it('should return all queued tasks', () => {
      const tasks = queue.getAll();
      expect(tasks).toBeInstanceOf(Array);
    });
  });

  describe('getPending', () => {
    it('should return only pending tasks', () => {
      const pending = queue.getPending();
      expect(pending).toBeInstanceOf(Array);
    });
  });

  describe('clear', () => {
    it('should clear all tasks', async () => {
      const task: QueuedTask = {
        id: 'task-1',
        timestamp: Date.now(),
        provider: 'mpesa-ke',
        amount: 100,
        phone: '254712345678',
        reference: 'TEST-001',
        description: 'Test payment',
        status: 'pending',
        retries: 0,
      };

      const mockFn = jest.fn().mockResolvedValue({ success: true });
      await queue.enqueue(mockFn, task);

      expect(queue.getAll().length).toBe(1);
      queue.clear();
      expect(queue.getAll().length).toBe(0);
    });
  });

  describe('size', () => {
    it('should return queue size', () => {
      expect(queue.size()).toBe(0);
    });
  });
});
