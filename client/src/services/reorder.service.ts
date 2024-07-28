import { List } from '../common/types/types';
import { DraggableLocation } from '@hello-pangea/dnd';
import { reorderArray } from './list.service';

const findListIndexById = (lists: List[], id: string): number =>
  lists.findIndex((list) => list.id === id);

const moveCardWithinList = (
  list: List,
  sourceIndex: number,
  destinationIndex: number
): List => {
  const updatedCards = Array.from(list.cards);
  const [movedCard] = updatedCards.splice(sourceIndex, 1);
  updatedCards.splice(destinationIndex, 0, movedCard);

  return { ...list, cards: updatedCards };
};

const moveCardToDifferentList = (
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

const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const sourceListIndex = findListIndexById(lists, source.droppableId);
  const destinationListIndex = findListIndexById(lists, destination.droppableId);

  if (sourceListIndex === -1 || destinationListIndex === -1) {
    return lists;
  }

  const sourceList = lists[sourceListIndex];
  const destinationList = lists[destinationListIndex];

  if (source.droppableId === destination.droppableId) {
    const updatedList = moveCardWithinList(sourceList, source.index, destination.index);
    return lists.map((list, index) => (index === sourceListIndex ? updatedList : list));
  }

  const { updatedSourceList, updatedDestinationList } = moveCardToDifferentList(
    sourceList,
    destinationList,
    source.index,
    destination.index
  );

  return lists.map((list, index) =>
    index === sourceListIndex
      ? updatedSourceList
      : index === destinationListIndex
        ? updatedDestinationList
        : list
  );
};

const reorderLists = (
  items: List[],
  startIndex: number,
  endIndex: number
): List[] => reorderArray([...items], startIndex, endIndex);

export { reorderLists, reorderCards };
