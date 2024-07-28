// PATTERN:{memento}
export type Memento<T> = {
  getState: () => T;
};

export const createMemento = <T>(state: T): Memento<T> => ({
  getState: () => state,
});

