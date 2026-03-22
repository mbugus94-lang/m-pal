import { OfflineQueue } from '../queue';

describe('Offline Queue', () => {
  let queue: OfflineQueue;

  beforeEach(() => {
    queue = new OfflineQueue();
  });

  test('should initialize empty', () => {
    expect(queue.size()).toBe(0);
  });

  test('should add items to queue', () => {
    queue.add({ type: 'payment', data: { amount: 100 } });
    expect(queue.size()).toBe(1);
  });

  test('should process queue items in order', async () => {
    const results: number[] = [];
    queue.add({ type: 'payment', data: { amount: 100 } });
    queue.add({ type: 'payment', data: { amount: 200 } });

    await queue.process(async (item) => {
      results.push(item.data.amount);
      return { success: true };
    });

    expect(results).toEqual([100, 200]);
  });

  test('should handle failed items with retry', async () => {
    let attempts = 0;
    queue.add({ type: 'payment', data: { amount: 100 } });

    await queue.process(async () => {
      attempts++;
      return { success: attempts > 1 };
    });

    expect(attempts).toBeGreaterThan(1);
  });

  test('should persist queue state', () => {
    queue.add({ type: 'payment', data: { amount: 100 } });
    const state = queue.serialize();
    expect(state).toBeDefined();
    
    const newQueue = OfflineQueue.deserialize(state);
    expect(newQueue.size()).toBe(1);
  });
});
