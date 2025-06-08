export const loadBoard = () => {
  try {
    const data = localStorage.getItem("kanban-board");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveBoard = (board) => {
  try {
    localStorage.setItem("kanban-board", JSON.stringify(board));
  } catch {
    // fail silently
  }
};
