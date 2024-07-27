import type { Socket } from 'socket.io';

import { CardEvent } from '../common/enums/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import { performance } from 'perf_hooks';

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeCardDescription.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const start = performance.now();
    const newCard = new Card(cardName, 'Card Description...');
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.updateListAndLog(CardEvent.CREATE, start, updatedLists);
  }

  private reorderCards(
    {
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId
    }: {
      sourceIndex: number;
      destinationIndex: number;
      sourceListId: string;
      destinationListId: string;
    }): void {
    const start = performance.now();
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId
    });
    this.updateListAndLog(CardEvent.REORDER, start, reordered);

  }

  private deleteCard(listId: string, cardId: string): void {
    const start = performance.now();
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.cards = list.cards.filter((card) => card.id !== cardId);
      }
      return list;
    });
    this.updateListAndLog(CardEvent.DELETE, start, updatedLists);
  }

  private renameCard(listId: string, cardId: string, newName: string): void {
    const start = performance.now();
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.cards = list.cards.map((card) => {
          if (card.id === cardId) {
            card.name = newName;
          }
          return card;
        });
      }
      return list;
    });
    this.updateListAndLog(CardEvent.RENAME, start, updatedLists);
  }

  private changeCardDescription(listId: string, cardId: string, newDescription: string): void {
    const start = performance.now();
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        list.cards = list.cards.map((card) => {
          (card.id === cardId) && (card.description = newDescription);
          return card;
        });
      }
      return list;
    });
    this.updateListAndLog(CardEvent.CHANGE_DESCRIPTION, start, updatedLists);
  }

  private duplicateCard(listId: string, cardId: string): void {
    const start = performance.now();
    const lists = this.db.getData();
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        const cardToDuplicate = list.cards.find((card) => card.id === cardId);

        if (cardToDuplicate) {
          const duplicatedCard = cardToDuplicate.clone();
          list.cards = list.cards.concat(duplicatedCard);
        }
      }
      return list;
    });
    this.updateListAndLog(CardEvent.DUPLICATE, start, updatedLists);
  }

  private updateListAndLog(_, start: number, updatedLists: any): void {
    this.db.setData(updatedLists);
    this.updateLists();
  }
}

export { CardHandler };
