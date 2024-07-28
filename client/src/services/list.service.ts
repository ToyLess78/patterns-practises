import { socket } from '../context/socket';
import { ListEvent } from '../common/enums/enums';
import { List } from '../common/types/list.type';

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

export const findListIndexById = (lists: List[], id: string): number =>
  lists.findIndex((list) => list.id === id);

export const reorderLists = (lists: List[], startIndex: number, endIndex: number): List[] => {
  const result = Array.from(lists);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
