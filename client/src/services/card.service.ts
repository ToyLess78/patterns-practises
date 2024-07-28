import { socket } from '../context/socket';
import { CardEvent } from '../common/enums/enums';
import { List } from '../common/types/list.type';
import { findListIndexById } from './list.service';

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

export const moveCardWithinList = (
  list: List,
  sourceIndex: number,
  destinationIndex: number
): List => {
  const updatedCards = Array.from(list.cards);
  const [movedCard] = updatedCards.splice(sourceIndex, 1);
  updatedCards.splice(destinationIndex, 0, movedCard);

  return { ...list, cards: updatedCards };
};

export const moveCardToDifferentList = (
  sourceList: List,
  destinationList: List,
  sourceIndex: number,
  destinationIndex: number
): { updatedSourceList: List; updatedDestinationList: List } => {
  const sourceCards = Array.from(sourceList.cards);
  const destinationCards = Array.from(destinationList.cards);
  const [movedCard] = sourceCards.splice(sourceIndex, 1);
  destinationCards.splice(destinationIndex, 0, movedCard);

  return {
    updatedSourceList: { ...sourceList, cards: sourceCards },
    updatedDestinationList: { ...destinationList, cards: destinationCards }
  };
};

export const duplicateCardInList = (list: List, cardIndex: number): List => {
  const updatedCards = Array.from(list.cards);
  const cardToDuplicate = { ...updatedCards[cardIndex], id: `${updatedCards[cardIndex].id}-copy` };
  updatedCards.splice(cardIndex + 1, 0, cardToDuplicate);

  return { ...list, cards: updatedCards };
};

export const duplicateCard = (lists: List[], listId: string, cardIndex: number): List[] => {
  const listIndex = findListIndexById(lists, listId);

  if (listIndex === -1) {
    return lists;
  }

  const list = lists[listIndex];
  const updatedList = duplicateCardInList(list, cardIndex);

  return lists.map((l, index) => (index === listIndex ? updatedList : l));
};

export const removeCardFromList = (lists: List[], listId: string, cardIndex: number): List[] => {
  const listIndex = findListIndexById(lists, listId);

  if (listIndex === -1) {
    return lists;
  }

  const list = lists[listIndex];
  const updatedCards = list.cards.filter((_, index) => index !== cardIndex);

  return lists.map((l, index) =>
    index === listIndex ? { ...list, cards: updatedCards } : l
  );
};
