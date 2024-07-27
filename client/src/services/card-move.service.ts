import { addCardToList, removeCardFromList } from './card.service';
import { getCardsFromList, updateListCards } from './list.service';
import { List } from '../common/types/list.type';

export const moveCardBetweenLists = (
  lists: List[],
  sourceListId: string,
  destinationListId: string,
  sourceIndex: number,
  destinationIndex: number
): List[] => {
  const sourceCards = getCardsFromList(lists, sourceListId);
  const destinationCards = getCardsFromList(lists, destinationListId);
  const [movedCard] = sourceCards.splice(sourceIndex, 1);

  const updatedSourceLists = updateListCards(lists, sourceListId, () =>
    removeCardFromList(sourceCards, sourceIndex)
  );

  return updateListCards(updatedSourceLists, destinationListId, _ =>
    addCardToList(destinationCards, destinationIndex, movedCard)
  );
};
