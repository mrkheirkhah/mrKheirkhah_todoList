class List {
  listNameEditingEnabled = false;

  addNewTaskToListInputVisible = false;

  cards = [];

  constructor(title, description, board, cards, id) {
    if (title && title !== "") this.title = title;

    if (description && description !== "") this.description = description;

    if (id) {
      this.id = id;
    } else {
      this.id = generateNewId();
    }

    if (board && typeof board == "object") {
      this.thisListBoard = board;
      this.boardListContainer = board.listContainer;
    }

    this.data = {
      title: this.title,
      description: this.description,
      cards: this.cards,
      id: this.id,
      position: this.thisListBoard.lists.length + 1,
    };

    this.node = this.makeList();
  }

  makeList() {
    let listWrapper = document.createElement("div");
    listWrapper.setAttribute("draggable", "true");
    listWrapper.classList.add("task-list_wrapper");
    listWrapper.id = this.id;
    listWrapper.ondragstart = (e) => {
      listDragAndDrop.dragStart(e, this);
    };
    listWrapper.ondragover = (e) => {
      listDragAndDrop.dragOver(e, this);
    };
    listWrapper.ondragend = (e) => {
      listDragAndDrop.dragEnd(e, this);
    };
    let listTitleSection = document.createElement("div");
    listTitleSection.classList.add("list-tile_section");

    let listTitle = document.createElement("p");
    listTitle.classList.add(
      "text-secondary",
      "font-weight-bolder",
      "font-italic"
    );
    listTitle.innerText = this.title;
    listTitle.setAttribute("data-toggle", "tooltip");
    listTitle.setAttribute("data-placement", "top");
    listTitle.setAttribute("title", this.description);
    listTitle.addEventListener("mouseenter", () => {
      $(listTitle).tooltip("show");
    });
    listTitle.addEventListener("mouseleave", () => {
      $(listTitle).tooltip("hide");
    });

    listTitleSection.appendChild(listTitle);

    let listNameEditForm = document.createElement("form");

    let titleEditFormGroup = document.createElement("div");
    titleEditFormGroup.classList.add("form-group");

    let titleEditInput = document.createElement("input");
    titleEditInput.setAttribute("required", true);
    titleEditInput.setAttribute("type", "text");
    titleEditInput.setAttribute("placeholder", "List Name");
    titleEditInput.classList.add("form-control");

    listNameEditForm.classList.add("was-validated");
    listNameEditForm.onsubmit = (event) => {
      debugger;
      this.updateTitle(
        titleEditInput,
        listTitle,
        listNameEditForm,
        listTitle,
        event
      );
    };
    listTitle.addEventListener("click", () => {
      this.toggleListNameEditMode(listNameEditForm, listTitle);
    });
    let inValidFeedback = document.createElement("div");
    inValidFeedback.classList.add("invalid-feedback");
    inValidFeedback.innerText = "Type Something";

    titleEditFormGroup.appendChild(titleEditInput);
    titleEditFormGroup.appendChild(inValidFeedback);
    listNameEditForm.appendChild(titleEditFormGroup);
    listNameEditForm.style.display = "none";
    listTitleSection.appendChild(listNameEditForm);

    let list = document.createElement("ul");
    list.classList.add("task_list");
    list.id = this.id;
    list.ondragstart = (e) => {
      listDragAndDrop.dragStart(e, this);
    };
    list.ondragover = (e) => {
      listDragAndDrop.dragOver(e, this);
    };
    list.ondragend = (e) => {
      listDragAndDrop.dragEnd(e, this);
    };
    this.cardContainer = list;

    let addNewCardSection = document.createElement("div");
    addNewCardSection.classList.add("addNewCardSection");

    let addNewTaskButton = document.createElement("button");
    addNewTaskButton.classList.add("btn", "btn-secondary", "btn-block");
    addNewTaskButton.innerText = "Add New Card";

    let addNewCardForm = document.createElement("form");
    addNewCardForm.style.display = "none";

    let addNewCardFormGroup = document.createElement("div");
    addNewCardFormGroup.classList.add("form-group");

    let addNewCardInput = document.createElement("input");
    addNewCardInput.setAttribute("required", true);
    addNewCardInput.setAttribute("type", "text");
    addNewCardInput.setAttribute("placeholder", "Card Name");
    addNewCardInput.classList.add("form-control");

    let closeAddNewCardForm = document.createElement("button");
    closeAddNewCardForm.setAttribute("type", "button");
    closeAddNewCardForm.classList.add("close");
    closeAddNewCardForm.innerHTML = "&times;";
    closeAddNewCardForm.onclick = () => {
      this.toggleAddNewTaskToListInput(addNewTaskButton, addNewCardForm);
    };

    addNewCardForm.classList.add("was-validated");
    addNewCardForm.onsubmit = (event) => {
      this.addCard(addNewCardInput.value, null, event);
      this.toggleAddNewTaskToListInput(addNewTaskButton, addNewCardForm);
      addNewCardInput.value = "";
    };

    addNewTaskButton.addEventListener("click", () => {
      this.toggleAddNewTaskToListInput(addNewTaskButton, addNewCardForm);
    });

    addNewCardFormGroup.appendChild(addNewCardInput);
    addNewCardFormGroup.appendChild(inValidFeedback);
    addNewCardForm.appendChild(addNewCardFormGroup);
    addNewCardForm.appendChild(closeAddNewCardForm);

    addNewCardSection.appendChild(addNewTaskButton);
    addNewCardSection.appendChild(addNewCardForm);

    listWrapper.appendChild(listTitleSection);
    listWrapper.appendChild(list);
    // listWrapper.appendChild(addNewTaskButton);
    listWrapper.appendChild(addNewCardSection);

    return listWrapper;
  }

  updateTitle(
    newTitleInput,
    listTitleContainer,
    listNameEditForm,
    listNameTitle,
    event
  ) {
    event.preventDefault();
    this.title = newTitleInput.value;
    this.updateData();
    listTitleContainer.innerText = newTitleInput.value;
    newTitleInput.value = "";
    listNameEditForm.style.display = "none";
    listNameTitle.style.display = "block";
    this.listNameEditingEnabled = false;
  }

  toggleListNameEditMode(listNameEditForm, listNameTitle) {
    if (this.listNameEditingEnabled) {
      listNameEditForm.style.display = "none";
      listNameTitle.style.display = "block";
      this.listNameEditingEnabled = false;
    } else {
      listNameEditForm.style.display = "block";
      listNameTitle.style.display = "none";
      this.listNameEditingEnabled = true;
    }
  }

  toggleAddNewTaskToListInput(addNewTaskButton, addNewCardForm) {
    if (this.addNewTaskToListInputVisible) {
      addNewCardForm.style.display = "none";
      addNewTaskButton.style.display = "block";
      this.addNewTaskToListInputVisible = false;
    } else {
      addNewCardForm.style.display = "block";
      addNewTaskButton.style.display = "none";
      this.addNewTaskToListInputVisible = true;
    }
  }

  addCard(cardName, List, event) {
    if (event && typeof event == "object") event.preventDefault();
    let cardObject = {
      title: cardName,
      position: this.cards.length + 1,
    };
    if ((cardObject && cardName !== "") || (list && list.length !== 0)) {
      let newCard = new Card(cardObject, this);
      this.cards.push(newCard.data);
      this.cardContainer.appendChild(newCard.node);
    }
  }

  updateData() {
    this.data.title = this.title;
    this.data.description = this.description;
    this.data.cards = this.cards;
    this.data.id = this.id;
    this.data.position = this.thisListBoard.lists.length + 1;
  }
}
