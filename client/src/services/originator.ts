import { Memento } from './memento';
import { List } from '../common/types/types';

// PATTERN:{memento}
export class Originator {
  private state: List[] = [];

  public setState(state: List[]): void {
    this.state = [...state];
  }

  public getState(): List[] {
    return this.state;
  }

  public saveToMemento(): Memento<List[]> {
    return new Memento(this.getState());
  }

  public restoreFromMemento(memento: Memento<List[]>): void {
    this.setState(memento.getState());
  }
}
