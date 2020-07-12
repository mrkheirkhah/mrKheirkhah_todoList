class DragNdrop {
  dragingElement = null;

  dragingElementData = null;

  dragedOverEl = null;

  dragOver(e) {
    document.querySelectorAll(".dropShadow").forEach(function (e) {
      e.remove();
    });
    let dropShadow = document.createElement("DIV");
    dropShadow.classList.add("dropShadow");
    if (this.isBefore(this.dragingElement, e.target)) {
      this.dragedOverEl = e.target;
      e.target.parentNode.insertBefore(dropShadow, e.target);
    } else {
      this.dragedOverEl = e.target;
      e.target.parentNode.insertBefore(dropShadow, e.target.nextSibling);
    }
  }

  dragEnd() {
    if (this.isBefore(this.dragingElement, this.dragedOverEl)) {
      this.dragedOverEl.parentNode.insertBefore(this.dragingElement, this.dragedOverEl);
    } else {
      this.dragedOverEl.parentNode.insertBefore(this.dragingElement, this.dragedOverEl.nextSibling);
    }
    this.dragingElement = null;
    this.dragedOverEl = null;
    document.querySelectorAll(".dropShadow").forEach(function (e) {
      e.remove();
    });
    document.querySelectorAll(".dragging").forEach((e) => {
      e.classList.remove("dragging");
    });
  }

  dragStart(e) {
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null);
    this.dragingElement = e.target;
  }

    // makeAreaDropAble() {

    // }
    
   isBefore(el1, el2) {
    let cur;
    if (el2.parentNode === el1.parentNode) {
      for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
        if (cur === el2) return true;
      }
    }
    return false;
  }
}

class ListDragAndDrop extends DragNdrop {}

class cardDragAndDrop extends DragNdrop {}
