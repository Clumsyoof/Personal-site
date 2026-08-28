import { readable, type Readable } from 'svelte/store';

/**
 * Creates a readable clock store that ticks every `intervalMs` milliseconds.
 * Encapsulates timer state and lifecycle: starts ticking when first subscriber
 * connects (on client), and automatically clears interval when unsubscribed.
 */
export function createClockStore(intervalMs: number = 1000): Readable<Date> {
  return readable(new Date(), (set) => {
    set(new Date());
    const interval = setInterval(() => {
      set(new Date());
    }, intervalMs);

    return () => {
      clearInterval(interval);
    };
  });
}

export const clockStore: Readable<Date> = createClockStore();
