// PATTERN:{memento}
export class Memento<T> {
  private state: T;

  constructor(state: T) {
    this.state = state;
  }

  public getState(): T {
    return this.state;
  }
}
