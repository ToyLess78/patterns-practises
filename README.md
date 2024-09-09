
Task Flow
==========

## patterns practices and principles


This project follows several design patterns to ensure flexibility, maintainability, and scalability. Here are the key patterns used:

- **PATTERN: Memento**
  This pattern is used to save and restore an object's state without violating encapsulation. It allows the system to implement features like undo/redo by storing previous states of objects.

- **PATTERN: Prototype**
  The Prototype pattern helps in cloning objects, especially when the object creation is resource-heavy. It is used here to easily create new cards by copying an existing one and modifying it.

- **PATTERN: Observer**
  The Observer pattern enables the system to maintain a subscription list, where objects (observers) get automatically notified when there are changes in another object (subject). This is used for logging and tracking card movements and actions.

- **PATTERN: Proxy**
  The Proxy pattern acts as a surrogate for another object to control access to it. In this project, it is used to manage logging actions for reordering lists and cards, ensuring that all moves are tracked without directly modifying the core logic.

- **Undo/Redo**
  Undo and redo functionalities are implemented using the Memento pattern to store snapshots of the system's state. This allows users to revert to previous states or reapply actions they’ve undone.

## Info

- This project saves data in memory, so you don't need any database
- This project uses [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## Requirements

- NodeJS (16.x.x)
- NPM (8.x.x)

## Start the application

1. Install dependencies

```
npm i
```

2. Start backend

```
npm start -w server
```

3. Start client

```
npm start -w client
```
