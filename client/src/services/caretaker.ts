import { Memento } from './memento';

type Caretaker<T> = {
  save: (memento: Memento<T>) => Caretaker<T>;
  undo: () => { memento: Memento<T> | null; caretaker: Caretaker<T> };
  redo: () => { memento: Memento<T> | null; caretaker: Caretaker<T> };
};

const createCaretaker = <T>(initialMementos: Memento<T>[] = [], initialIndex: number = -1): Caretaker<T> => {
  const mementos = [...initialMementos];
  const currentIndex = initialIndex;

  const save = (memento: Memento<T>): Caretaker<T> => {
    const newMementos = mementos.slice(0, currentIndex + 1);
    newMementos.push(memento);
    return createCaretaker(newMementos, currentIndex + 1);
  };

  const undo = (): { memento: Memento<T> | null; caretaker: Caretaker<T> } => {
    if (currentIndex <= 0) {
      return { memento: null, caretaker: createCaretaker(mementos, currentIndex) };
    }
    return { memento: mementos[currentIndex - 1], caretaker: createCaretaker(mementos, currentIndex - 1) };
  };

  const redo = (): { memento: Memento<T> | null; caretaker: Caretaker<T> } => {
    if (currentIndex >= mementos.length - 1) {
      return { memento: null, caretaker: createCaretaker(mementos, currentIndex) };
    }
    return { memento: mementos[currentIndex + 1], caretaker: createCaretaker(mementos, currentIndex + 1) };
  };

  return {
    save,
    undo,
    redo,
  };
};

export { createCaretaker };
