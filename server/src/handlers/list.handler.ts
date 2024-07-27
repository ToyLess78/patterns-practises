import type { Socket } from 'socket.io';

import { ListEvent } from '../common/enums/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { performance } from 'perf_hooks';
import { logger } from '../logger/logger';
import {
  consoleSubscriber,
  fileSubscriber,
  logOperation
} from '../services/logger.service';

// PATTERN:{Observer}
fileSubscriber.subscribe(logger);
consoleSubscriber.subscribe(logger);

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const start = performance.now();
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    this.updateListAndLog(ListEvent.REORDER, start, reorderedLists);
  }

  private createList(name: string): void {
    const start = performance.now();
    const lists = this.db.getData();
    const newList = new List(name);
    this.updateListAndLog(ListEvent.CREATE, start, lists.concat(newList));
  }

  private deleteList(listId: string): void {
    const start = performance.now();
    const lists = this.db.getData();
    const updatedLists = lists.filter((list) => list.id !== listId);
    this.updateListAndLog(ListEvent.DELETE, start, updatedLists);
  }

  private renameList(listId: string, newName: string): void {
    const start = performance.now();
    const lists = this.db.getData();
    const updatedLists: List[] = lists.map((list) => {
      if (list.id === listId) {
        list.name = newName;
      }
      return list;
    });
    this.updateListAndLog(ListEvent.RENAME, start, updatedLists);
  }

  private updateListAndLog(
    eventName,
    start: number,
    updatedLists: List[]
  ): void {
    this.db.setData(updatedLists);
    this.updateLists();
    logOperation(eventName, start);
  }
}

export { ListHandler };
