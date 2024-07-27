import type { DraggableProvided } from '@hello-pangea/dnd';

import { type Card } from '../../common/types/types';
import { CopyButton } from '../primitives/copy-button';
import { DeleteButton } from '../primitives/delete-button';
import { Splitter } from '../primitives/styled/splitter';
import { Text } from '../primitives/text';
import { Title } from '../primitives/title';
import { Container } from './styled/container';
import { Content } from './styled/content';
import { Footer } from './styled/footer';
import {
  changeDescription,
  handleDeleteCard,
  handleDuplicate,
  handleRenameCard
} from '../../services/card.service';

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string;
};

export const CardItem = ({ listId, card, isDragging, provided }: Props) => {
  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={(value) => {
            handleRenameCard(listId, card.id, value.trim() || 'Card Name');
          }}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text
          text={card.description}
          onChange={(value) => {
            changeDescription(
              listId,
              card.id,
              value.trim() || 'Card Description...'
            );
          }}
        />
        <Footer>
          <DeleteButton
            onClick={() => {
              handleDeleteCard(listId, card.id);
            }}
          />
          <Splitter />
          <CopyButton
            onClick={() => {
              handleDuplicate(listId, card.id);
            }}
          />
        </Footer>
      </Content>
    </Container>
  );
};
