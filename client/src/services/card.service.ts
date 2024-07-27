import { socket } from '../context/socket';
import { CardEvent } from '../common/enums/enums';
import { Card } from '../common/types/card.type';

let timeoutId: ReturnType<typeof setTimeout>;

export const handleRenameCard = (
  listId: string,
  cardId: string,
  newName: string
) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    newName && socket.emit(CardEvent.RENAME, listId, cardId, newName);
  }, 500);
};

export const handleDeleteCard = (listId: string, cardId: string) => {
  socket.emit(CardEvent.DELETE, listId, cardId);
};

export const handleDuplicate = (listId: string, cardId: string) => {
  socket.emit(CardEvent.DUPLICATE, listId, cardId);
};

export const handleCreateCard = (listId: string, name: string) => {
  name.trim() !== '' && socket.emit(CardEvent.CREATE, listId, name);
};

export const changeDescription = (
  listId: string,
  cardId: string,
  value: string
) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    value && socket.emit(CardEvent.CHANGE_DESCRIPTION, listId, cardId, value);
  }, 500);
};

export const addCardToList = (
  cards: Card[],
  index: number,
  card: Card
): Card[] => {
  cards.splice(index, 0, card);
  return cards;
};

export const removeCardFromList = (cards: Card[], index: number): Card[] => {
  cards.splice(index, 1);
  return cards;
};
