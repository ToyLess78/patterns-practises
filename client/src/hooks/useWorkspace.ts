import { useState, useEffect, useContext, useCallback } from 'react';
import { DraggableLocation, DropResult } from '@hello-pangea/dnd';
import { CardEvent, ListEvent } from '../common/enums/enums';
import { List } from '../common/types/types';
import { SocketContext } from '../context/socket';
import { reorderLists, reorderCards, duplicateCardInList, removeCard } from '../services/reorder.service';
import { createOriginator } from '../services/originator';
import { createCaretaker } from '../services/caretaker';

// PATTERN:{memento}
let originator = createOriginator();
// PATTERN:{memento}
let caretaker = createCaretaker<List[]>();

const useWorkspace = () => {
  const [lists, setLists] = useState<List[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit(ListEvent.GET, (lists: List[]) => {
      setLists(lists);
      originator = originator.setState(lists);
      caretaker = caretaker.save(originator.saveToMemento());
    });

    socket.on(ListEvent.UPDATE, (lists: List[]) => {
      setLists(lists);
      originator = originator.setState(lists);
      caretaker = caretaker.save(originator.saveToMemento());
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        const { memento, caretaker: newCaretaker } = caretaker.undo();
        caretaker = newCaretaker;
        if (memento) {
          originator = originator.restoreFromMemento(memento);
          const restoredState = originator.getState();
          setLists([...restoredState]);
          socket.emit(ListEvent.UPDATE, restoredState); // Emit updated state
        }
      } else if (event.ctrlKey && event.key === 'y') {
        const { memento, caretaker: newCaretaker } = caretaker.redo();
        caretaker = newCaretaker;
        if (memento) {
          originator = originator.restoreFromMemento(memento);
          const restoredState = originator.getState();
          setLists([...restoredState]);
          socket.emit(ListEvent.UPDATE, restoredState);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.removeAllListeners(ListEvent.UPDATE).close();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [socket]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      const source: DraggableLocation = result.source;
      const destination: DraggableLocation = result.destination;

      const isNotMoved =
        source.droppableId === destination.droppableId &&
        source.index === destination.index;

      if (isNotMoved) {
        return;
      }

      const isReorderLists = result.type === 'COLUMN';

      let newLists: List[];
      if (isReorderLists) {
        newLists = reorderLists([...lists], source.index, destination.index);
        socket.emit(ListEvent.REORDER, source.index, destination.index);
      } else {
        newLists = reorderCards([...lists], source, destination);
        socket.emit(CardEvent.REORDER, {
          sourceListId: source.droppableId,
          destinationListId: destination.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index
        });
      }

      setLists(newLists);
      socket.emit(ListEvent.UPDATE, newLists);
      originator = originator.setState(newLists);
      caretaker = caretaker.save(originator.saveToMemento());
    },
    [lists, socket]
  );

  const handleDuplicateCard = useCallback(
    (listId: string, cardIndex: number) => {
      const newLists = duplicateCardInList([...lists], listId, cardIndex);
      setLists(newLists);
      socket.emit(CardEvent.DUPLICATE, { listId, cardIndex });
      originator = originator.setState(newLists);
      caretaker = caretaker.save(originator.saveToMemento());
    },
    [lists, socket]
  );

  const handleRemoveCard = useCallback(
    (listId: string, cardIndex: number) => {
      const newLists = removeCard([...lists], listId, cardIndex);
      setLists(newLists);
      socket.emit(CardEvent.DELETE, { listId, cardIndex });
      originator = originator.setState(newLists);
      caretaker = caretaker.save(originator.saveToMemento());
    },
    [lists, socket]
  );

  return { lists, onDragEnd, handleDuplicateCard, handleRemoveCard };
};

export { useWorkspace };
