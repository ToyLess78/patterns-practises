import type { DraggableLocation } from '@hello-pangea/dnd';
import { reorderArray, updateListCards } from './list.service';
import { moveCardBetweenLists } from './card-move.service';
import { List } from '../common/types/list.type';

const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const {droppableId: sourceListId, index: sourceIndex} = source;
  const {droppableId: destinationListId, index: destinationIndex} = destination;

  const isSameList = sourceListId === destinationListId;

  if (isSameList) {
    return updateListCards(lists, sourceListId, cards =>
      reorderArray(cards, sourceIndex, destinationIndex)
    );
  }

  return moveCardBetweenLists(lists, sourceListId, destinationListId, sourceIndex, destinationIndex);
};

const reorderLists = (items: List[], startIndex: number, endIndex: number): List[] =>
  reorderArray([...items], startIndex, endIndex);

export { reorderLists, reorderCards };
