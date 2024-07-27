import { socket } from '../context/socket';
import { Card } from '../common/types/card.type';
import { ListEvent } from '../common/enums/enums';
import { List } from '../common/types/list.type';

// export const removeCardFromList = (cards: Card[], index: number): Card[] =>
//   cards.slice(0, index).concat(cards.slice(index + 1));
//
// export const addCardToList = (
//   cards: Card[],
//   index: number,
//   card: Card
// ): Card[] => cards.slice(0, index).concat(card).concat(cards.slice(index));

export const handleCreateList = (name: string) => {
  name.trim() !== '' ? socket.emit(ListEvent.CREATE, name) : null;
};

export const handleDeleteList = (listId: string) => {
  socket.emit(ListEvent.DELETE, listId);
};

let timeoutId: ReturnType<typeof setTimeout>;

export const handleRenameList = (listId: string, newName: string) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    newName && socket.emit(ListEvent.RENAME, listId, newName);
  }, 500);
};

export const updateListCards = (
  lists: List[],
  listId: string,
  updateFn: (cards: Card[]) => Card[]
): List[] =>
  lists.map((list) =>
    list.id === listId ? { ...list, cards: updateFn([...list.cards]) } : list
  );

export const getCardsFromList = (lists: List[], listId: string): Card[] => {
  const list = lists.find((list) => list.id === listId);
  return list ? list.cards : [];
};

export const reorderArray = <T>(
  array: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const [removed] = array.splice(startIndex, 1);
  array.splice(endIndex, 0, removed);
  return array;
};
