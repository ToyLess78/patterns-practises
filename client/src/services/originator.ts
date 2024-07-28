import { List } from '../common/types/types';
import { Memento, createMemento } from './memento';

type Originator = {
  setState: (state: List[]) => Originator;
  getState: () => List[];
  saveToMemento: () => Memento<List[]>;
  restoreFromMemento: (memento: Memento<List[]>) => Originator;
};

const createOriginator = (initialState: List[] = []): Originator => {
  const state = [...initialState];

  const setState = (newState: List[]): Originator =>
    createOriginator([...newState]);

  const getState = (): List[] => state;

  const saveToMemento = (): Memento<List[]> => createMemento(state);

  const restoreFromMemento = (memento: Memento<List[]>): Originator =>
    createOriginator(memento.getState());

  return {
    setState,
    getState,
    saveToMemento,
    restoreFromMemento,
  };
};

export { createOriginator };
