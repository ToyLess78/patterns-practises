import { useCallback, useContext, useEffect, useState } from 'react';
import { DraggableLocation, DropResult } from '@hello-pangea/dnd';
import { ListEvent } from '../common/enums/enums';
import { List } from '../common/types/types';
import { SocketContext } from '../context/socket';
import { reorderCards, reorderLists } from '../services/reorder.service';
import { Originator } from '../services/originator';
import { Caretaker } from '../services/caretaker';

// PATTERN:{memento}
const originator = new Originator();
// PATTERN:{memento}
const caretaker = new Caretaker<List[]>();

const useWorkspace = () => {
  const [lists, setLists] = useState<List[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit(ListEvent.GET, (lists: List[]) => {
      setLists(lists);
      originator.setState(lists);
      caretaker.save(originator.saveToMemento());
    });

    socket.on(ListEvent.UPDATE, (lists: List[]) => {
      setLists(lists);
      originator.setState(lists);
      caretaker.save(originator.saveToMemento());
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        const memento = caretaker.undo();
        if (memento) {
          originator.restoreFromMemento(memento);
          const restoredState = originator.getState();
          setLists([...restoredState]);
          socket.emit(ListEvent.UPDATE, restoredState);
        }
      } else if (event.ctrlKey && event.key === 'y') {
        const memento = caretaker.redo();
        if (memento) {
          originator.restoreFromMemento(memento);
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
      } else {
        newLists = reorderCards([...lists], source, destination);
      }

      setLists(newLists);
      socket.emit(ListEvent.UPDATE, newLists);
      originator.setState(newLists);
      caretaker.save(originator.saveToMemento());
    },
    [lists, socket]
  );

  return { lists, onDragEnd };
};

export { useWorkspace };
