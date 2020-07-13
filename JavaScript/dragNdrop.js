class DragNdrop {
  draggedElObjectId = null;

  afterDraggedElObjectId = null;

  boardObject = null;

  dragOver(e, object) {
    e.stopPropagation();
    const draggable = document.querySelector(".dragging");
    let parent = e.currentTarget;
    let container = null;
    if (draggable.classList[0] === parent.classList[0]) {
      container = parent.parentNode;
    } else {
      container = parent;
    }
    e.preventDefault();
    const afterElement = this.getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(draggable);
      this.afterDraggedElObjectId = null;
    } else {
      container.insertBefore(draggable, afterElement);
      this.afterDraggedElObjectId = afterElement.id;
    }
  }

  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".cardContainer:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  dragEnd(e, object) {
    e.stopPropagation();
    this.targetListId = e.currentTarget.parentNode.id;
    if (this.fromListId === this.targetListId)
      arrangeDataInSameList(this.boardObject.thisListBoard.lists, this.targetListId, this.draggedElObjectId, this.afterDraggedElObjectId);
    else
      inserToAnotherList(this.boardObject.thisListBoard.lists, this.fromListId, this.targetListId, this.draggedElObjectId, this.afterDraggedElObjectId);
    
    e.currentTarget.classList.remove("dragging");
    this.draggedElObjectId = null;
    this.afterDraggedElObjectId = null;
    this.boardObject = null;
  }

  dragStart(e, object) {
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null);
    this.draggedElObjectId = e.currentTarget.id;
    this.fromListId = e.currentTarget.parentNode.id;
    this.boardObject = object;
    e.stopPropagation();
  }
}

class ListDragAndDrop extends DragNdrop {
  dragOver(e, object) {
    const draggable = document.querySelector(".dragging");
    let parent = e.currentTarget;
    let container = null;
    if (draggable.classList[0] === parent.classList[0]) {
      container = parent.parentNode;
    } else {
      container = parent;
    }
    e.preventDefault();

    const afterElement = this.getDragAfterElement(container, e.clientX);
    if (afterElement == null) {
      container.appendChild(draggable);
      this.afterDraggedElObjectId = null;
    } else {
      container.insertBefore(draggable, afterElement);
      this.afterDraggedElObjectId = afterElement.id;
    }
  }

  dragEnd(e, object) {
    e.currentTarget.classList.remove("dragging");
    let newDataArray = insertData(
      this.boardObject.thisListBoard.lists,
      this.draggedElObjectId,
      this.afterDraggedElObjectId
    );
    this.draggedElObjectId = null;
    this.afterDraggedElObjectId = null;
    this.boardObject = null;
  }

  dragStart(e, object) {
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null);
    this.draggedElObjectId = e.currentTarget.id;
    this.boardObject = object;
    e.stopPropagation();
  }

  getDragAfterElement(container, x) {
    const draggableElements = [
      ...container.querySelectorAll(".task-list_wrapper:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
}

let listDragAndDrop = new ListDragAndDrop();

let cardDragAndDrop = new DragNdrop();
