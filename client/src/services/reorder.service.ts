import { List } from '../common/types/types';
import { DraggableLocation } from '@hello-pangea/dnd';
import { findListIndexById, reorderLists as reorderListsHelper } from './list.service';
import { duplicateCard, moveCardToDifferentList, moveCardWithinList, removeCardFromList } from './card.service';

const reorderCardsHelper = (
  lists: List[],
  sourceListIndex: number,
  destinationListIndex: number,
  sourceIndex: number,
  destinationIndex: number
): List[] => {
  const sourceList = lists[sourceListIndex];
  const destinationList = lists[destinationListIndex];

  if (sourceListIndex === destinationListIndex) {
    const updatedList = moveCardWithinList(sourceList, sourceIndex, destinationIndex);
    return lists.map((list, index) => (index === sourceListIndex ? updatedList : list));
  }

  const { updatedSourceList, updatedDestinationList } = moveCardToDifferentList(
    sourceList,
    destinationList,
    sourceIndex,
    destinationIndex
  );

  return lists.map((list, index) =>
    index === sourceListIndex
      ? updatedSourceList
      : index === destinationListIndex
        ? updatedDestinationList
        : list
  );
};

export const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const sourceListIndex = findListIndexById(lists, source.droppableId);
  const destinationListIndex = findListIndexById(lists, destination.droppableId);

  if (sourceListIndex === -1 || destinationListIndex === -1) {
    return lists;
  }

  return reorderCardsHelper(
    lists,
    sourceListIndex,
    destinationListIndex,
    source.index,
    destination.index
  );
};

export const reorderLists = reorderListsHelper;
export const duplicateCardInList = duplicateCard;
export const removeCard = removeCardFromList;
