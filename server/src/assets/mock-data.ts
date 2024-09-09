import { Card } from '../data/models/card';
import { List } from '../data/models/list';

const toDo = new List('To Do');
toDo.cards = [
  new Card(
    'Implement renaming lists',
    'Expected result - possibility to change the name of the list'
  ),
  new Card(
    'Implement adding cards',
    'Expected result - possibility to create new cards'
  ),
  new Card(
    'Implement removing cards',
    'Expected result - possibility to delete the card when button is clicked'
  ),
  new Card(
    'Implement card title renaming',
    'Expected result - possibility to change the card title'
  ),
  new Card(
    'Implement card description renaming',
    'Expected result - possibility to change the card description'
  ),
  new Card(
    'Implement card copying',
    'Expected result - possibility to copy card. Should be implemented using Prototype pattern. Id should be new for a new card. The name of the card should have "copy" suffix'
  ),
  new Card(
    'Implement logging on server side',
    'Expected result - implemented logging with 3 levels: info, warn, error. Should be implemented using Observer pattern. There should be 2 loggers: first will write only errors into console, second will write all logs into file'
  ),
  new Card(
    'Implement logging of reorder action',
    'Expected result - implemented logging for the ReorderService (logging proxy). Should be implemented using Proxy pattern. Should be logged for each card/list with the info when it was moved'
  )
];

const inProgress = new List('In Progress');
inProgress.cards = [
  new Card(
    'Implement adding lists',
    'Expected result - possibility to create a new list'
  ),
  new Card(
    'Implement card sorting functionality',
    'Expected result - possibility to sort cards by title or creation date'
  ),
  new Card(
    'Implement search functionality',
    'Expected result - possibility to search for cards and lists using keywords'
  )
];

const toTest = new List('To Test');
toTest.cards = [
  new Card(
    'Test renaming functionality',
    'Expected result - verify that renaming of lists and cards works as expected'
  ),
  new Card(
    'Test adding/removing cards',
    'Expected result - verify that adding and removing cards works as expected'
  )
];

const done = new List('Done');
done.cards = [
  new Card(
    'Implement initial project setup',
    'Completed the setup of the initial project structure'
  ),
  new Card(
    'Implement base UI components',
    'Completed the implementation of basic UI components'
  )
];

export const lists = [toDo, inProgress, toTest, done];
