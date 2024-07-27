import { Memento } from './memento';

// PATTERN:{memento}
export class Caretaker<T> {
  private mementos: Memento<T>[] = [];
  private currentIndex: number = -1;

  public save(memento: Memento<T>): void {
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    this.mementos.push(memento);
    this.currentIndex++;
  }

  public undo(): Memento<T> | null {
    if (this.currentIndex <= 0) {
      return null;
    }
    this.currentIndex--;
    return this.mementos[this.currentIndex];
  }

  public redo(): Memento<T> | null {
    if (this.currentIndex >= this.mementos.length - 1) {
      return null;
    }
    this.currentIndex++;
    return this.mementos[this.currentIndex];
  }
}
