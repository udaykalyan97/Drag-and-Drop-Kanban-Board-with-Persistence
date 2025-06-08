import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { loadBoard, saveBoard } from "../utils/storage";
import "./KanbanBoard.css";

const initialBoard = {
  todo: {
    title: "To Do",
    items: [
      { id: "1", content: "Create wireframes" },
      { id: "2", content: "Define scope" },
    ],
  },
  inProgress: {
    title: "In Progress",
    items: [{ id: "3", content: "Develop Kanban board" }],
  },
  done: {
    title: "Done",
    items: [{ id: "4", content: "Setup project repo" }],
  },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const stored = loadBoard();
    setColumns(stored || initialBoard);
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceItems = [...sourceCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      const updated = {
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
      };
      setColumns(updated);
      saveBoard(updated);
    } else {
      const destItems = [...destCol.items];
      destItems.splice(destination.index, 0, movedItem);

      const updated = {
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems,
        },
      };

      setColumns(updated);
      saveBoard(updated);

      // Simulate optimistic update with fake API failure rollback
      const success = Math.random() > 0.2;
      if (!success) {
        alert("Failed to save. Rolling back.");
        setColumns(loadBoard() || initialBoard);
      }
    }
  };

  return (
    <div className="kanban-container">
      <h2>🧩 Kanban Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-columns">
          {Object.entries(columns).map(([colId, col]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h3>{col.title}</h3>
                  {col.items.map((item, index) => (
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {(provided) => (
                        <div
                          className="kanban-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
