# Board Pages

This folder contains a self-contained board game feature for the operator app.

## Pages

- `BoardAdminPage`: create and edit boards, paint each square as two triangles, and map colors to equations
- `BoardPlayerPage`: load a saved board, choose a color, and solve triangle halves by matching equations

## Local Architecture

- `useBoardAdminPage.ts`: admin state and actions
- `useBoardPlayerPage.ts`: player state and answer-checking logic
- `board.storage.ts`: local storage persistence for saved boards
- `board.utils.ts`: board creation, resizing, and state helpers
- `components/*`: board-only UI parts
- `styles.scss`: board-only styles

## Persistence

Boards are stored in browser `localStorage` under a board-specific key so the admin and player views can share the same saved configurations.

Legacy single-color cells are normalized automatically so older saved boards still render after the triangle split upgrade.
