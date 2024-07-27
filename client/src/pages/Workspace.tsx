import type { DroppableProvided } from '@hello-pangea/dnd';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import React from 'react';

import { Column } from '../components/column/column';
import { ColumnCreator } from '../components/column-creator/column-creator';
import { Container } from './styled/container';
import { handleCreateList } from '../services/list.service';
import { useWorkspace } from '../hooks/useWorkspace';
import { List } from '../common/types/list.type';

export const Workspace = () => {
  const { lists, onDragEnd } = useWorkspace();

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <Container
              className="workspace-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list: List, index: number) => (
                <Column
                  key={list.id}
                  index={index}
                  listName={list.name}
                  cards={list.cards}
                  listId={list.id}
                />
              ))}
              {provided.placeholder}
              <ColumnCreator onCreateList={(name) => handleCreateList(name)} />
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
};
