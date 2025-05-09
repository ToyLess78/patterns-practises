import { Card } from '../data/models/card';
import { List } from '../data/models/list';

// PATTERN:{Proxy}
function logMethodCalls<T extends object>(
  target: T,
  key: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: unknown[]) => unknown>
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (...args: unknown[]): unknown {
    console.log(`Function ${String(key)} is called with arguments: `, args);
    return originalMethod.apply(this, args);
  };
}

class ReorderService {
  @logMethodCalls
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const card = items[startIndex];
    const listWithRemoved = this.remove(items, startIndex);
    return this.insert(listWithRemoved, endIndex, card);
  }

  @logMethodCalls
  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    const target: Card | undefined = lists.find(
      (list) => list.id === sourceListId
    )?.cards?.[sourceIndex];

    if (!target) {
      return lists;
    }

    return lists.map((list) => {
      if (list.id === sourceListId) {
        list.setCards(this.remove(list.cards, sourceIndex));
      }

      if (list.id === destinationListId) {
        list.setCards(this.insert(list.cards, destinationIndex, target));
      }

      return list;
    });
  }

  @logMethodCalls
  private remove<T>(items: T[], index: number): T[] {
    return [...items.slice(0, index), ...items.slice(index + 1)];
  }

  @logMethodCalls
  private insert<T>(items: T[], index: number, value: T): T[] {
    return [...items.slice(0, index), value, ...items.slice(index)];
  }
}

export { ReorderService };
